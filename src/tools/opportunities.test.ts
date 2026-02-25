import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerOpportunityTools } from "./opportunities.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerOpportunityTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register CRUD tools + 3 tab tools = 8 total", () => {
    registerOpportunityTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(8);
  });

  it("should register all CRUD tools", () => {
    registerOpportunityTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_opportunities_search");
    expect(names).toContain("boond_opportunities_get");
    expect(names).toContain("boond_opportunities_create");
    expect(names).toContain("boond_opportunities_update");
    expect(names).toContain("boond_opportunities_delete");
  });

  it("should register all 3 tab tools", () => {
    registerOpportunityTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_opportunities_information");
    expect(names).toContain("boond_opportunities_actions");
    expect(names).toContain("boond_opportunities_documents");
  });

  it("should register tab tools as readOnly and non-destructive", () => {
    registerOpportunityTools(server);
    const tabCalls = vi.mocked(server.registerTool).mock.calls.filter(
      (c) => typeof c[0] === "string" && [
        "boond_opportunities_information",
        "boond_opportunities_actions",
        "boond_opportunities_documents",
      ].includes(c[0] as string)
    );

    expect(tabCalls).toHaveLength(3);
    for (const call of tabCalls) {
      const [, metadata] = call;
      expect(metadata.annotations?.readOnlyHint).toBe(true);
      expect(metadata.annotations?.destructiveHint).toBe(false);
    }
  });
});

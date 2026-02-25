import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResourceTools } from "./resources.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerResourceTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register CRUD tools + 6 tab tools = 11 total", () => {
    registerResourceTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(11);
  });

  it("should register all CRUD tools", () => {
    registerResourceTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_resources_search");
    expect(names).toContain("boond_resources_get");
    expect(names).toContain("boond_resources_create");
    expect(names).toContain("boond_resources_update");
    expect(names).toContain("boond_resources_delete");
  });

  it("should register all 6 tab tools", () => {
    registerResourceTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_resources_information");
    expect(names).toContain("boond_resources_technical");
    expect(names).toContain("boond_resources_financial");
    expect(names).toContain("boond_resources_actions");
    expect(names).toContain("boond_resources_contracts");
    expect(names).toContain("boond_resources_documents");
  });

  it("should register tab tools as readOnly and non-destructive", () => {
    registerResourceTools(server);
    const tabCalls = vi.mocked(server.registerTool).mock.calls.filter(
      (c) => typeof c[0] === "string" && [
        "boond_resources_information",
        "boond_resources_technical",
        "boond_resources_financial",
        "boond_resources_actions",
        "boond_resources_contracts",
        "boond_resources_documents",
      ].includes(c[0] as string)
    );

    expect(tabCalls).toHaveLength(6);
    for (const call of tabCalls) {
      const [, metadata] = call;
      expect(metadata.annotations?.readOnlyHint).toBe(true);
      expect(metadata.annotations?.destructiveHint).toBe(false);
    }
  });
});

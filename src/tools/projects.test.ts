import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerProjectTools } from "./projects.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerProjectTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register CRUD tools + 4 tab tools = 9 total", () => {
    registerProjectTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(9);
  });

  it("should register all CRUD tools", () => {
    registerProjectTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_projects_search");
    expect(names).toContain("boond_projects_get");
    expect(names).toContain("boond_projects_create");
    expect(names).toContain("boond_projects_update");
    expect(names).toContain("boond_projects_delete");
  });

  it("should register all 4 tab tools", () => {
    registerProjectTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_projects_information");
    expect(names).toContain("boond_projects_planning");
    expect(names).toContain("boond_projects_actions");
    expect(names).toContain("boond_projects_documents");
  });

  it("should register tab tools as readOnly and non-destructive", () => {
    registerProjectTools(server);
    const tabCalls = vi.mocked(server.registerTool).mock.calls.filter(
      (c) => typeof c[0] === "string" && [
        "boond_projects_information",
        "boond_projects_planning",
        "boond_projects_actions",
        "boond_projects_documents",
      ].includes(c[0] as string)
    );

    expect(tabCalls).toHaveLength(4);
    for (const call of tabCalls) {
      const [, metadata] = call;
      expect(metadata.annotations?.readOnlyHint).toBe(true);
      expect(metadata.annotations?.destructiveHint).toBe(false);
    }
  });
});

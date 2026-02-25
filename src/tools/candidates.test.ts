import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCandidateTools } from "./candidates.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerCandidateTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register CRUD tools + 4 tab tools = 9 total", () => {
    registerCandidateTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(9);
  });

  it("should register all CRUD tools", () => {
    registerCandidateTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_candidates_search");
    expect(names).toContain("boond_candidates_get");
    expect(names).toContain("boond_candidates_create");
    expect(names).toContain("boond_candidates_update");
    expect(names).toContain("boond_candidates_delete");
  });

  it("should register all 4 tab tools", () => {
    registerCandidateTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_candidates_information");
    expect(names).toContain("boond_candidates_technical");
    expect(names).toContain("boond_candidates_actions");
    expect(names).toContain("boond_candidates_documents");
  });

  it("should register tab tools as readOnly and non-destructive", () => {
    registerCandidateTools(server);
    const tabCalls = vi.mocked(server.registerTool).mock.calls.filter(
      (c) => typeof c[0] === "string" && [
        "boond_candidates_information",
        "boond_candidates_technical",
        "boond_candidates_actions",
        "boond_candidates_documents",
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

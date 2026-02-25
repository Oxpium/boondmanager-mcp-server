import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerApplicationTools } from "./application.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerApplicationTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register 2 application tools", () => {
    registerApplicationTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
  });

  it("should register dictionary tool", () => {
    registerApplicationTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_application_dictionary");
  });

  it("should register current user tool", () => {
    registerApplicationTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_application_current_user");
  });

  it("should register all tools as readOnly", () => {
    registerApplicationTools(server);
    for (const call of vi.mocked(server.registerTool).mock.calls) {
      const [, metadata] = call;
      expect(metadata.annotations?.readOnlyHint).toBe(true);
      expect(metadata.annotations?.destructiveHint).toBe(false);
    }
  });
});

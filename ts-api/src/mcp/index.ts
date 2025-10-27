import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { z } from "zod";
import logger from "@/core/logger";
import { app } from "@/core/server";

// Create an MCP server
export const server = new McpServer({
	name: "local-mcp-server",
	version: "1.0.0",
});

// @todo register list of tools

app.post("/mcp", async (req, res) => {
	// Create a new transport for each request to prevent request ID collisions
	const transport = new StreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true,
	});

	res.on("close", () => {
		transport.close();
	});

	await server.connect(transport);
	await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.MCP_SERVER_PORT || "9001", 10);
app
	.listen(port, () => {
		logger.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
	})
	.on("error", (error) => {
		logger.error("Server error: %O", error);
	});

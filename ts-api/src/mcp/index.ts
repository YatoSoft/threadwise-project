import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import logger from "@/core/logger";
import { app } from "@/core/server";
import { getLatLong } from "@/mcp/tools/geocode";
import {
	fetchWeather,
	weatherAPIDailyAggResponseSchema,
	weatherAPIForecastResponseSchema,
} from "@/mcp/tools/weather";

// Create an MCP server
export const server = new McpServer({
	name: "local-mcp-server",
	version: "1.0.0",
});

// @todo register list of tools
server.registerTool(
	"get-lat-lon",
	{
		title: "Reverse Geocoder",
		description: "Get latitude and longitude for a given location",
		inputSchema: {
			location: z.string(),
		},
		outputSchema: {
			lat: z.string(),
			lon: z.string(),
		},
	},
	async ({ location }) => {
		const res = await getLatLong(location);

		return res;
	},
);

server.registerTool(
	"get-weather",
	{
		title: "Forecast & Weather Fetcher",
		description: "Get weather data for a location",
		inputSchema: {
			lat: z.string(),
			lon: z.string(),
			dateStart: z.string(),
			dateEnd: z.string(),
		},
		outputSchema: {
			forecast: z.union([
				weatherAPIForecastResponseSchema,
				z.array(weatherAPIDailyAggResponseSchema),
			]),
		},
	},
	async ({ lat, lon, dateStart, dateEnd }) => {
		const weather = await fetchWeather({ lat, lon, dateStart, dateEnd });

		return weather;
	},
);

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

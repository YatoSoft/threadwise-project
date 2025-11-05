import OpenAI from "openai";
import { main } from "@/data/instructions";
import { getLatLong } from "@/mcp/tools/geocode";
import { fetchWeather } from "@/mcp/tools/weather";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const tool: OpenAI.Responses.FunctionTool = {
	type: "function",
	name: "get_lat_long",
	description: "Get latitude and longitude for a given location",
	parameters: {
		type: "object",
		properties: {
			location: {
				type: "string",
			},
		},
	},
	strict: false,
};

client.responses.create({
	model: "gpt-5-nano",
	instructions: main,
	tools: [tool],
});

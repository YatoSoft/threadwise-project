import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

interface LocationResponse {
	place_id: string;
	licence: string;
	osm_type: string;
	osm_id: string;
	lat: string;
	lon: string;
	display_name: string;
	class: string;
	type: string;
	importance: number;
	icon: string;
}

export const getLatLong = async (location: string) => {
	const response = await fetch(
		`https://us1.locationiq.com/v1/search?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`,
	);
	const data: LocationResponse[] = await response.json();
	const { lat, lon } = data[0];

	return {
		content: [{ type: "text", text: JSON.stringify({ lat, lon }) }],
		structuredContent: { lat, lon },
	} as CallToolResult;
};

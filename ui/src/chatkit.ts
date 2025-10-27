import type { ChatKitOptions } from "@openai/chatkit";

const options: ChatKitOptions = {
	api: {
		// TODO: configure your ChatKit API integration (URL, auth, uploads).
	},
	theme: {
		colorScheme: "dark",
		radius: "pill",
		density: "normal",
		color: {
			grayscale: {
				hue: 217,
				tint: 2,
				shade: 1,
			},
			accent: {
				primary: "#35afe3",
				level: 1,
			},
		},
		typography: {
			baseSize: 16,
			fontFamily: "Inter, sans-serif",
			fontSources: [
				{
					family: "Inter",
					src: "https://rsms.me/inter/font-files/Inter-Regular.woff2",
					weight: 400,
					style: "normal",
				},
				// ...and 3 more font sources
			],
		},
	},
	composer: {
		attachments: {
			enabled: false,
		},
	},
	startScreen: {
		greeting: "",
		prompts: [
			{
				icon: "circle-question",
				label: "What is ChatKit?",
				prompt: "What is ChatKit?",
			},
			// ...and 4 more prompts
		],
	},
	// Optional fields not shown: locale, initialThread, threadItemActions, header, onClientTool, entities, widgets
};

export default options;

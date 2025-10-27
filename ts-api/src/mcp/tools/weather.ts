import { DateTime } from "luxon";
import {} from "@/mcp/index";

const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

export interface WeatherInputArgs {
	lat: string;
	lon: string;
	dateStart: string;
	dateEnd?: string;
}

export type WeatherOutput = {
	date: string;
	cloud_cover: number;
	humidity: number;
	temperature: {
		min?: number;
		max?: number;
		afternoon?: number;
		night?: number;
		evening?: number;
		morning?: number;
		current?: number;
	};
	weather: {
		description: string;
	}[];
}[];

interface WeatherAPIDailyAggResponse {
	lat: number;
	lon: number;
	tz: string;
	date: string;
	units: string;
	cloud_cover: {
		afternoon: number;
	};
	humidity: {
		afternoon: number;
	};
	precipitation: {
		total: number;
	};
	temperature: {
		min: number;
		max: number;
		afternoon: number;
		night: number;
		evening: number;
		morning: number;
	};
	pressure: {
		afternoon: number;
	};
	wind: {
		max: {
			speed: number;
			direction: number;
		};
	};
}

interface WeatherAPIDaily {
	dt: number;
	sunrise: number;
	sunset: number;
	moonrise: number;
	moonset: number;
	moon_phase: number;
	summary: string;
	temp: {
		day: number;
		min: number;
		max: number;
		night: number;
		eve: number;
		morn: number;
	};
	feels_like: {
		day: number;
		night: number;
		eve: number;
		morn: number;
	};
	pressure: number;
	humidity: number;
	dew_point: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	clouds: number;
	pop: number;
	rain: number;
	uvi: number;
}

interface WeatherAPIForecastResponse {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: {
		dt: number;
		sunrise: number;
		sunset: number;
		temp: number;
		feels_like: number;
		pressure: number;
		humidity: number;
		dew_point: number;
		uvi: number;
		clouds: number;
		visibility: number;
		wind_speed: number;
		wind_deg: number;
		wind_gust: number;
		weather: {
			id: number;
			main: string;
			description: string;
			icon: string;
		}[];
	};
	daily: WeatherAPIDaily[];
}

const isWithin8DaysFromToday = (date: string): boolean => {
	const now = DateTime.now();
	const toDate = DateTime.fromISO(date);
	const diff = toDate.diff(now, "days");

	return diff.days <= 8;
};

const getRequestConfig = ({
	lat,
	lon,
	dateStart,
	dateEnd,
}: WeatherInputArgs) => {
	// we need to get forecast aggregate if outside of daily forecast range
	if (dateEnd && !isWithin8DaysFromToday(dateEnd)) {
		return {
			url: `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&date=${dateStart}&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`,
			type: "daily_aggregate",
		};
	}

	// current and forecast
	return {
		url: `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`,
		type: "current_forecast",
	};
};

const fetchAggregateWeather = async ({
	lat,
	lon,
	dateStart,
	dateEnd,
}: WeatherInputArgs) => {
	const data = [];
	const totalDays = DateTime.fromISO(dateEnd as string).diff(
		DateTime.fromISO(dateStart),
		"days",
	);
	const dates = Array(totalDays.days).map((_, index) =>
		DateTime.fromISO(dateStart).plus({ days: index }).toISODate(),
	);

	for (const date of dates) {
		const url = `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&date=${date}&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`;
		const response = await fetch(url);
		const resData: WeatherAPIDailyAggResponse = await response.json();

		data.push(resData);
	}

	return data;
};

export const fetchWeather = async ({
	lat,
	lon,
	dateStart,
	dateEnd,
}: WeatherInputArgs) => {
	// @todo map responses to common format
	const requestConfig = getRequestConfig({ lat, lon, dateStart, dateEnd });

	if (requestConfig.type === "daily_aggregate") {
		const data: WeatherOutput = await fetchAggregateWeather({
			lat,
			lon,
			dateStart,
			dateEnd,
		});

		return {
			content: [{ type: "text", text: JSON.stringify(data) }],
			structuredContent: data,
		};
	}

	const response = await fetch(requestConfig.url);
	const data: WeatherAPIForecastResponse = await response.json();

	return {
		content: [{ type: "text", text: JSON.stringify(data) }],
		structuredContent: data,
	};
};

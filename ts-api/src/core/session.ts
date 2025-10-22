import { RedisStore } from "connect-redis";
import session from "express-session";
import { Redis } from "ioredis";
import logger from "@/core/logger";

const redis = new Redis("redis://redis:6379");

redis.on("connection", () => {
	logger.log("redis connection started");

	redis.on("error", (e) => {
		logger.error(e.message);
	});
});

const redisStore = new RedisStore({
	client: redis,
	prefix: "sess:",
});

const appSession = session({
	store: redisStore,
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET as string,
	cookie: {
		httpOnly: true,
	},
});

export default appSession;

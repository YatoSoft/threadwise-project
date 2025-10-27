import { RedisStore } from "connect-redis";
import session from "express-session";
import { Redis } from "ioredis";

export const redis = new Redis("redis://redis:6379");

const redisStore = new RedisStore({
	client: redis,
	prefix: "sess:",
});

const appSession = session({
	store: redisStore,
	name: "appSid",
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET as string,
	cookie: {
		httpOnly: true,
	},
});

export default appSession;

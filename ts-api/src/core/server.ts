import http from "node:http";

import express from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import { bindMiddleware } from "@/core/middleware";
import session, { redis } from "@/core/session";

const app = bindMiddleware(express());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

io.engine.use(helmet());
io.engine.use(session);

export { app, io, server, redis };

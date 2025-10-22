import http from "node:http";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import logger from "@/core/logger";
import { bindMiddleware } from "@/core/middleware";
import session from "@/core/session";

const app = bindMiddleware(express());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello from ThreadWise TypeScript API!" });
});

io.engine.use(helmet());
io.engine.use(session);
io.on("connection", (socket) => {
	logger.log(`socket connection ${socket.id}`);
});

server.listen(port, () => {
	logger.log(`Server listening on port ${port}`);
});

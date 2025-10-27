import logger from "@/core/logger";
import { app, io, redis, server } from "@/core/server";
import mountRoutes from "./core/router";

const main = async () => {
	const port = process.env.PORT || 3000;

	mountRoutes(app);

	server.listen(port, () => {
		logger.log(`Server listening on port ${port}`);
	});

	io.on("connection", (socket) => {
		logger.debug(`socket connection ${socket.id}`);

		socket.on("error", (e) => {
			logger.error("%O", e);
		});
	});

	redis.on("connection", () => {
		logger.log("redis connection started");
	});

	redis.on("error", (e) => {
		logger.error(e.message);
	});
};

main().catch((e) => {
	logger.error("%O", e);
});

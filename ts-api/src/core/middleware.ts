import compression from "compression";
import cors from "cors";
import type { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import pino from "pino-http";
import logger from "@/core/logger";
import session from "@/core/session";

const genericErrorHandler = async (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	logger.error(err);

	res.status(500).send({ error: err.message });
};

const pinoConfig = {
	transport: {
		target: "pino-http-print",
		level: "info",
		options: {
			colorize: true,
			translateTime: true,
			all: true,
			prettyOptions: {
				colorizeObjects: true,
			},
		},
	},
};

export const bindMiddleware = (app: Express): Express => {
	logger.debug("Binding middleware");
	app.use(cors({ origin: "http://localhost:5173" }));
	app.use(session);
	app.use(helmet());
	app.use(pino(pinoConfig));
	app.use(compression());
	app.use(genericErrorHandler);

	logger.debug("Middleware bound");
	return app;
};

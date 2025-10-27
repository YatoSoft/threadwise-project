import type { Express, Request, Response } from "express";

const mountRoutes = (app: Express) => {
	app.get("/", async (req: Request, res: Response) => {
		res.status(200).json({ message: "Hello from ThreadWise TypeScript API!" });
	});
};

export default mountRoutes;

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import { PORT } from './config/env.config'

(async (): Promise<void> => {

    const app: Application = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get('/', (req: Request, res: Response): void => {
        res.json({
            success: true,
            message: 'Welcome to Presence API.'
        });
    });

    app.use('/api/v1/auth', authRoutes)

    app.listen(PORT, (): void => {
        console.log(`Presence API server is running on: http://localhost:${PORT}`);
    });
})();
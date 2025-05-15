import express, { Application, Request, Response } from 'express';
import cors from 'cors';

(async (): Promise<void> => {

    const PORT: number = 3000;
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

    app.listen(PORT, (): void => {
        console.log(`Presence API server is running on: http://localhost:${PORT}`);
    });
})();
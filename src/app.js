import express from 'express';
import authRoutes from './Routes/authRoute.js';
import groupRoutes from './Routes/groupRoute.js';
import contributionRoutes from './Routes/contributionRoutes.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use("/contributions", contributionRoutes);
app.use("/group", groupRoutes);

export default app;
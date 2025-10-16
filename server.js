import app from './src/app.js';
import { connectDB } from './src/database/db.js';

const PORT = 3000;
connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

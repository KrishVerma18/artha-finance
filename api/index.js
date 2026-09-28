import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

// Ensure DB is initialized for serverless invocations
await connectDB();

export default app;

// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initOrbitDB } from './services/fileService.js';
import fileRoutes from './routes/fileRoutes.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize OrbitDB
initOrbitDB().catch(console.error);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use file routes
app.use('/files', fileRoutes);

// Route to serve the test HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
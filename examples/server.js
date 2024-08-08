import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initOrbitDB, fileRoutes, config } from 'darkolat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initiate app
const app = express();

// Initialize OrbitDB
initOrbitDB().catch(console.error);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use file routes
app.use('/files', fileRoutes);

// Route to serve the test HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
# Sia Orbit Storage

A package for file storage using OrbitDB and Sia.

## Installation

```bash
npm install sia-orbit-storage
```

## Usage

1. Set up your environment variables in a `.env` file:

```
PORT=3000
S5_NODE_URL=your_s5_node_url
S5_CLIENT_PWD=your_s5_client_password
S5_CLIENT_AUTH_TOKEN=your_s5_client_auth_token
```

2. In your Express application:

```javascript
import express from 'express';
import { initOrbitDB, fileRoutes } from 'sia-orbit-storage';

const app = express();

// Initialize OrbitDB
initOrbitDB().catch(console.error);

// Use file routes
app.use('/files', fileRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

3. You can now use the `/files/upload` and `/files/download/:fileName` routes in your application.

## API

- `initOrbitDB()`: Initializes the OrbitDB instance.
- `uploadFile(fileName, fileBuffer)`: Uploads a file to the storage.
- `downloadFile(fileName)`: Downloads a file from the storage.
- `fileRoutes`: Express router with file upload and download routes.

## Example

See the `examples` directory for a complete server setup.

## License

MIT
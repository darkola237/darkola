import { initOrbitDB, uploadFile, downloadFile } from './services/fileService.js';
import fileRoutes from './routes/fileRoutes.js';
import config from './config.js';

export {
  initOrbitDB,
  uploadFile,
  downloadFile,
  fileRoutes,
  config
};
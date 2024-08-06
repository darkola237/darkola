// routes/fileRoutes.js
import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();
const upload = multer();

// Route for uploading a file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Route for downloading a file
router.get('/download/:fileName', fileController.downloadFile);

export default router;
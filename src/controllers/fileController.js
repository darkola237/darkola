// controllers/fileController.js
import * as fileService from '../services/fileService.js';

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const { buffer: fileBuffer, originalname: fileName } = req.file;
    const cid = await fileService.uploadFile(fileName, fileBuffer);
    res.json({ message: 'File uploaded and backup created successfully', cid: cid });
  } catch (error) {
    console.error('Error in upload controller:', error);
    res.status(500).send('Error uploading file');
  }
};

export const downloadFile = async (req, res) => {
  const { fileName } = req.params;

  try {
    const fileBuffer = await fileService.downloadFile(fileName);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error in download controller:', error);
    if (error.message === 'File not found') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Error downloading file');
    }
  }
};
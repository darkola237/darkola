// siaStorage.js
import axios from 'axios';
import FormData from 'form-data';
import { Buffer } from 'buffer';
import config from './config.js';
import { Readable } from 'stream';
import https from 'https';

const SiaStorage = async () => {
  const put = async (hash, data) => {
    console.log("SiaStorage.put called with data:", data); // Debug log
    try {
      const form = new FormData();

      // Create a Readable stream from the buffer
      const stream = new Readable();
      stream.push(data);
      stream.push(null);  // Signals the end of the stream

      form.append('file', stream, {
        filename: hash,
        contentType: 'application/octet-stream',
        knownLength: data.length  // Specify the length of the data
      });

      const response = await axios.post(`${config.S5_NODE_URL}/s5/upload`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${config.S5_CLIENT_AUTH_TOKEN}`
        },
        maxBodyLength: Infinity,  // To allow large file uploads
        maxContentLength: Infinity
      });

      console.log(`File uploaded to Sia with CID: ${response.data.cid}`);
      return response.data.cid;
    } catch (error) {
      console.error('Error uploading to Sia:', error);
      throw error;
    }
  };

  const get = async (hash) => {

    const agent = new https.Agent({
      rejectUnauthorized: false,
      family: 4,
    });
    try {
      const authToken = Buffer.from(`${config.S5_CLIENT_PWD}`).toString('base64');
      const response = await axios.get(`${config.S5_DOWNLOAD_URL}/s5/blob/${hash}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Basic ${authToken}`
        },
        httpsAgent: agent
      });
      console.log("data getted ", Buffer.from(response.data))
      // return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading from Sia:', error);
      throw error;
    }
  };


  const del = async (hash) => {
    console.warn('Delete operation not supported in Sia storage');
  };

  const iterator = async function* () {
    console.warn('Iterator not implemented for Sia storage');
    yield;
  };

  const merge = async (other) => {
    console.warn('Merge operation not implemented for Sia storage');
  };

  const clear = async () => {
    console.warn('Clear operation not supported in Sia storage');
  };

  const close = async () => {
    // No specific close operation needed for Sia storage
  };

  return {
    put,
    get,
    del,
    iterator,
    merge,
    clear,
    close
  };
};

export default SiaStorage;

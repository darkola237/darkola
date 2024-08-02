// models/SiaS5Storage.js
import axios from 'axios';
import FormData from 'form-data';
import { Buffer } from 'buffer';

export default class SiaS5Storage {
  constructor(options) {
    this.s5NodeUrl = options.s5NodeUrl;
    this.s5ClientAuthToken = options.s5ClientAuthToken;
  }

  async put(key, value) {
    try {
      const form = new FormData();
      form.append('file', value, { filename: key });

      const response = await axios.post(`${this.s5NodeUrl}/s5/upload`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${this.s5ClientAuthToken}`
        }
      });
      return response.data.cid;
    } catch (error) {
      console.error('Error uploading to S5:', error);
      throw error;
    }
  }

  async get(key) {
    try {
      const response = await axios.get(`${this.s5NodeUrl}/s5/blob/${key}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${this.s5ClientAuthToken}`
        }
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading from S5:', error);
      throw error;
    }
  }
}
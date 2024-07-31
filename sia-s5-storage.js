const axios = require('axios');

class SiaStorage {
  constructor(options) {
    this.s5ApiUrl = options.s5ApiUrl;
  }

  async put(key, value) {
    try {
      const response = await axios.post(`${this.s5ApiUrl}/s5/upload`, value, {
        headers: {
          'Content-Type': 'application/octet-stream'
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
      const response = await axios.get(`${this.s5ApiUrl}/s5/blob/${key}`);
      return response.data;
    } catch (error) {
      console.error('Error downloading from S5:', error);
      throw error;
    }
  }

  async delete(key) {
    // S5/Sia doesn't support direct deletion, so we'll just ignore this
    return;
  }

  async close() {
    // No need to close anything for S5/Sia
  }
}

module.exports = SiaStorage;

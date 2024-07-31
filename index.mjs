import { create as createIPFS } from 'ipfs-core';
import OrbitDB from 'orbit-db';
import axios from 'axios';

class SiaS5Storage {
  constructor(options) {
    this.s5NodeUrl = options.s5NodeUrl;
  }

  async put(key, value) {
    try {
      console.log("this node url: ", this.s5NodeUrl);
      const response = await axios.post(`${this.s5NodeUrl}/s5/upload`, value, {
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
      const response = await axios.get(`${this.s5NodeUrl}/s5/blob/${key}`);
      return response.data;
    } catch (error) {
      console.error('Error downloading from S5:', error);
      throw error;
    }
  }

  async del(key) {
    console.warn('Delete operation not supported in S5/Sia');
  }

  async *query() {
    console.warn('Iteration not directly supported in S5 API');
  }
}

const initOrbitDB = async () => {
  const ipfs = await createIPFS();
  const orbitdb = await OrbitDB.createInstance(ipfs);

  const db = await orbitdb.keyvalue('sia-test-db', {
    storage: new SiaS5Storage({
      s5NodeUrl: 'https://s5.daltek.tech' // URL of your S5 node
    })
  });

  console.log('Database created');

  // Example usage
  await db.put('key1', 'value1');
  const value = await db.get('key1');
  console.log('Retrieved value:', value);

  backupOrbitDB(db, 'https://s5.daltek.tech').catch(console.error);
};

const backupOrbitDB = async (db, s5NodeUrl) => {
  try {
    // Create a snapshot of the database
    const snapshot = await db.saveSnapshot();
    
    // Convert the snapshot to a buffer
    const snapshotBuffer = Buffer.from(JSON.stringify(snapshot));
    
    const s5ClientAuthToken = 'S5A5ndByxZSiLXjmWBJYHKcbCe7a1aWCzgbx1ZPebKKN6bL';
    // Upload the snapshot to S5
    const response = await axios.post(`${s5NodeUrl}`, snapshotBuffer, {
      headers: {
        Authorization: `Bearer ${s5ClientAuthToken}`,
        'Content-Type': 'application/octet-stream'
      }
    });

    console.log(`Backup saved with CID: ${response.data.cid}`);
  } catch (error) {
    console.error('Error backing up to S5:', error);
  }
};

initOrbitDB().catch(console.error);

// services/fileService.js
import { create as createIPFS } from 'ipfs-core';
import OrbitDB from 'orbit-db';
import SiaStorage from '../siaStorage.js';
import CustomSiaStore from '../customSiaStore.js';

let orbitdb;
let db;
let siaStorage;

export const initOrbitDB = async () => {
  const ipfs = await createIPFS();
  orbitdb = await OrbitDB.createInstance(ipfs);

  // Add the custom store type to OrbitDB
  OrbitDB.addDatabaseType('custom-sia-store', CustomSiaStore);

  siaStorage = await SiaStorage();

  db = await orbitdb.open('file-storage-db', {
    create: true,
    type: 'custom-sia-store',
    storage: siaStorage
  });

  console.log('Database created with custom Sia storage');

  // Add event listeners
  db.events.on('write', (address, entry, heads) => {
    console.log('Write operation occurred:', entry);
  });

  db.events.on('replicate', (address) => {
    console.log('Replication event:', address);
  });
};

export const uploadFile = async (fileName, fileBuffer) => {
  try {
    if (!db) {
      await initOrbitDB();
    }
    const cid = await db.put(fileName, fileBuffer);
    console.log(`File uploaded with CID: ${cid}`);
    return cid;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const downloadFile = async (fileName) => {
  try {
    if (!db) {
      await initOrbitDB();
    }
    const fileBuffer = await db.get(fileName);
    if (!fileBuffer) {
      throw new Error('File not found');
    }
    return fileBuffer;
  } catch (error) {
    console.error('Error in downloadFile:', error);
    throw error;
  }
};
// services/fileService.js
import { create as createIPFS } from 'ipfs-core';
import OrbitDB from 'orbit-db';
import SiaStorage from '../siaStorage.js';

let orbitdb;
let db;

export const initOrbitDB = async () => {
    const ipfs = await createIPFS();
    orbitdb = await OrbitDB.createInstance(ipfs);

    const siaStorage = await SiaStorage();

    const entryStorage = siaStorage;
    const headsStorage = siaStorage;
    const indexStorage = siaStorage;

    db = await orbitdb.open('file-storage-db', {
        create: true,
        type: 'keyvalue',
        entryStorage,
        headsStorage,
        indexStorage
    });

    console.log('Database created with Sia storage');
};

let siaStorage;

export const initSiaStorage = async () => {
  siaStorage = await SiaStorage();
};

export const uploadFile = async (fileName, fileBuffer) => {
  try {
    if (!siaStorage) {
      await initSiaStorage();
    }
    const cid = await siaStorage.put(fileName, fileBuffer);
    console.log(`File uploaded with CID: ${cid}`);
    return cid;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const downloadFile = async (fileName) => {
    try {
        if (!siaStorage) {
            await initSiaStorage();
          }
        // const fileBuffer = await db.get(fileName);
        const fileBuffer = await siaStorage.get(fileName);
        if (!fileBuffer) {
            throw new Error('File not found');
        }
        return fileBuffer;
    } catch (error) {
        console.error('Error in downloadFile:', error);
        throw error;
    }
};

const OrbitDB = require('orbit-db');
const axios = require('axios');

const backupOrbitDB = async (orbitdbInstance, s5ApiUrl) => {
  // Parcourir toutes les bases de données OrbitDB
  for (const [dbAddress, db] of orbitdbInstance.databases) {
    // Obtenir toutes les données de la base
    const allData = await db.all();

    // Convertir en JSON
    const jsonData = JSON.stringify(allData);

    try {
      // Uploader sur S5/Sia
      const response = await axios.post(`${s5ApiUrl}/s5/upload`, jsonData, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      console.log(`Backup of ${dbAddress} stored with CID: ${response.data.cid}`);
    } catch (error) {
      console.error(`Error backing up ${dbAddress}:`, error);
    }
  }
};

// Exemple d'utilisation
const main = async () => {
  const orbitdb = await OrbitDB.createInstance(ipfs);
  await backupOrbitDB(orbitdb, 'https://your-s5-node-domain.com');
};

main();
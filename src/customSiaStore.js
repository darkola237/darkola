// customSiaStore.js
import KeyValueStore from 'orbit-db-kvstore';
import SiaStorage from './siaStorage.js';

class CustomSiaStore extends KeyValueStore {
    constructor(ipfs, id, dbname, options) {
        super(ipfs, id, dbname, options);
        this.siaStorage = options.storage || SiaStorage();
    }

    async put(key, value) {
        console.log("CustomSiaStore.put called with key:", key);
        await this.siaStorage.put(key, value);
        return super.put(key, value);
    }

    async get(key) {
        console.log("CustomSiaStore.get called with key:", key);
        const value = await this.siaStorage.get(key);
        if (value) return value;
        return super.get(key);
    }
}

export default CustomSiaStore;
// config.js
import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  S5_NODE_URL: process.env.S5_NODE_URL,
  S5_CLIENT_PWD: process.env.S5_CLIENT_PWD,
  S5_CLIENT_AUTH_TOKEN: process.env.S5_CLIENT_AUTH_TOKEN
};

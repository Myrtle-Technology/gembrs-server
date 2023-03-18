import { config } from 'dotenv';
config();

export default () => ({
  database_uri: process.env.MONGODB_URI,
});

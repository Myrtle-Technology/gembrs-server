import { MongoClient } from 'mongodb';
import config from '../../config/configuration';

const MONGO_URL = config().database_uri;

export const getDb = async () => {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined');
  }
  const client = await MongoClient.connect(MONGO_URL, {});
  return client.db();
};

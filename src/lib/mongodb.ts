import { MongoClient } from 'mongodb';
import type { Collection } from 'mongodb';

const collectionList = [
    'users',
    'books',
    'chapter',
    'vocabulary',
    'articleList',
    'article',
    'notes',
    'comments',
] as const;

type CollectionName = typeof collectionList[number];

let dbPool: Record<CollectionName, Collection> | null = null;
const uri:string = process.env.NEXT_PUBLIC_MONGO_DB_URI!;
export async function getDbPool() {
    if (dbPool) {
        return dbPool;
    }
    
    if (!uri) {
        throw new Error('MONGO_DB_URI is not defined');
    }

    const client = new MongoClient(uri);

    const clientPromise = await client.connect();

    const db = clientPromise.db('build-own-vocabulary');

    dbPool = {} as Record<CollectionName, Collection>;

    for (const collectionName of collectionList) {
        dbPool[collectionName] = db.collection(collectionName);
    }

    return dbPool;
}
const confiq = {
  url: String(import.meta.env.VITE_APPWRITE_URL),
  projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  collectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  bucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default confiq;

import confiq from "../confiq.js";
import { Client, ID, Databases, Storage, Permission, Role,Query } from "appwrite";

export class Service {
  client = new Client();
  database;
  storage;

  constructor() {
    this.client.setEndpoint(confiq.url).setProject(confiq.projectId);
    this.database = new Databases(this.client);
    this.storage  = new Storage(this.client);
  }

  async createPost({ title, content, image, status, userId, slug, type, Author }) {
    return this.database.createDocument(
      confiq.databaseId,
      confiq.collectionId,
      ID.unique(),
      { Title: title, Content: content, "Content-Image": image, Status: status, Slug: slug, UserID: userId, Type: type, Author },
      [ Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId)) ]
    );
  }

  async updatePost(id, data) {
  return this.database.updateDocument(
    confiq.databaseId,
    confiq.collectionId,
    id,
    data
  );
}


  async deletePost(id) {
    return this.database.deleteDocument(confiq.databaseId, confiq.collectionId, id);
  }

  async getPost(id) {
    return this.database.getDocument(confiq.databaseId, confiq.collectionId, id);
  }

  
  async allPosts() {
  return this.database.listDocuments(
    confiq.databaseId,
    confiq.collectionId,
    [
      Query.equal("Status", "public"),
      Query.orderDesc("$createdAt"),
    ]
  );
}
      async allUserPosts(userId) {
    return this.database.listDocuments(
      confiq.databaseId,
      confiq.collectionId,
      [
        Query.equal("UserID", userId),
        Query.orderDesc("$createdAt")
      ]
    );
  }


  async fileUpload(file) {
    return this.storage.createFile(
      confiq.bucketId,
      ID.unique(),
      file,
      [ Permission.read(Role.any()) ]
    );
  }

  async deleteFile(fileId) {
    return this.storage.deleteFile(confiq.bucketId, fileId);
  }

  async getFile(fileId) {
    return this.storage.getFileView(confiq.bucketId, fileId);
  }
  async getFileDownload(fileId) {
  return this.storage.getFileDownload(confiq.bucketId, fileId);
}

}


const service = new Service();
export default service;

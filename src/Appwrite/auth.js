import confiq from "../confiq.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(confiq.url).setProject(confiq.projectId);
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    const user = await this.account.create(ID.unique(), email, password, name);
    return this.login(email, password);
  }

  async login(email, password) {
    return this.account.createEmailPasswordSession(email, password);
  }

  async getUser() {
    return this.account.get();
  }

  async logout() {
    return this.account.deleteSessions();
  }

  async updateName(name) {
    return this.account.updateName(name);
  }

  async updatePrefs(prefs) {
    return this.account.updatePrefs(prefs);
  }
}

const authService = new AuthService();
export default authService;

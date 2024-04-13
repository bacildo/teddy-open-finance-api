import "reflect-metadata";
import { Database, Server } from "./index";

export class App {
  private server = new Server();
  private databaseSql = new Database();

  async appInitialize(): Promise<Server> {
    await this.databaseSql.connectMysql();
    setTimeout(() => {
      this.server.init();
      this.server.start();
    }, 1500);

    return this.server;
  }
}

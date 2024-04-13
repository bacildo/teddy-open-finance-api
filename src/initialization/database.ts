import "reflect-metadata";
import { Service } from "typedi";
import { DataSource } from "typeorm";
import { databaseEnabled, mysqlOptions } from "../config";

@Service()
export class Database {
  private static dataSourceMysql: DataSource;

  async connectMysql(): Promise<void> {
    if (databaseEnabled.mysqlOptions) {
      const { type, database } = mysqlOptions;
      Database.dataSourceMysql = new DataSource(mysqlOptions);
      setTimeout(async () => {
        try {
          await Database.dataSourceMysql.initialize();
          console.log("Successfully Connected!", type, database);
        } catch (error) {
          console.error("Connection Failed!", type, error);
        }
      }, 1000);
    }
  }

  public static get mysql(): DataSource {
    return Database.dataSourceMysql;
  }

  public get mysqlIsInitialized(): boolean {
    return Database.mysql?.isInitialized || false;
  }
}

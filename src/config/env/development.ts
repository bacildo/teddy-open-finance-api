import { resolve } from "path";
import { DataSourceOptions } from "typeorm";
export const sourcepath = resolve(__dirname, "../../");

export const mysqlOptions: DataSourceOptions = {
  type: "mysql",
  name: "mysql",
  host: "localhost",
  port: 3306,
  acquireTimeout: 20000,
  database: "management",
  username: "dev",
  password: "dev",
  logging: ["error"],
  entities: [`${sourcepath}/entities/sql/*.{js,ts}`],
};

export const configSecret = "SECRETTOKEN";

export const databaseEnabled = {
  mysqlOptions: true,
};
export const shortUrlBase = "http://localhost/";

export const serverPort = {
  port: 3000,
};

import * as express from "express";
import "reflect-metadata";
import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";
import { Service } from "typedi";
import { serverPort, sourcepath } from "../config";
import { UserRepository } from "../repositories"; // Importe o seu UserRepository aqui

@Service()
export class Server {
  private app!: express.Application;

  init(): void {
    const routingControllersOptions: RoutingControllersOptions = {
      cors: true,
      defaultErrorHandler: false,
      controllers: [`${sourcepath}/controllers/**/*{.js,.ts}`],
      validation: {
        skipMissingProperties: true,
        validationError: { target: false, value: false },
      },
      middlewares: [express.json(), express.urlencoded({ extended: true })],
      currentUserChecker: async (action: Action) => {
        const userId = action.request.user && (action.request.user as any).id;
        if (!userId) {
          return null;
        }
        const userRepository = new UserRepository(); // Use a injeção de dependência se possível
        const user = await userRepository.findUserById(userId);
        return user || null;
      },
    };

    this.app = createExpressServer(routingControllersOptions);

    console.log("Server Initialized");
  }

  start(): void {
    if (!this.app) {
      console.error(
        "Express application not initialized. Call init() before start()."
      );
      return;
    }

    this.app.listen(serverPort.port, () => {
      console.log("Server running on port " + serverPort.port);
    });
  }
}

import { Listener } from './libs/listener.ts';
import { Server } from './typings/server.ts';

export class HTTPServer extends Listener {
  private readonly configuration: Server;
  constructor(configuration: Server) {
    super();
    this.configuration = configuration;
  }
}
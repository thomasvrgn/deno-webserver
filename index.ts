import { Listener } from './libs/listener.ts';
import { ServerConfiguration } from './typings/server.ts';
import { RequestMethods } from './typings/methods.ts';
import { MethodEvent } from './typings/event.ts';
import { serve, Server, ServerRequest } from 'https://deno.land/std@0.74.0/http/server.ts';

export class HTTPServer extends Listener implements RequestMethods {
  private readonly configuration: ServerConfiguration = {
    port: 3000,
    hostname: 'localhost',
  };
  public readonly events: MethodEvent[] = [];
  private readonly server: Server = serve(this.configuration);
  // Defining configuration and extending Listener
  constructor(configuration: ServerConfiguration) {
    super();
    this.configuration = configuration;
    this.server = serve(this.configuration);
  }
  // Request methods
  public get(routeName: string, callback: Function): void {
    this.events.push({
      name: routeName,
      callback: callback,
      category: 'get',
    });
  }
  public post(routeName: string, callback: Function): void {
    this.events.push({
      name: routeName,
      callback: callback,
      category: 'post',
    });
  }
  public emit(eventName: string, ...data: any[]): Function | null {
    const eventArray: string[] = eventName.split('||');
    const name: string = eventArray[0];
    const category: string = eventArray[1];
    const selectedEvent: MethodEvent | null = this.events.splice(
      this.events.indexOf(
        this.events.filter((x: MethodEvent) => x.name === name && x.category === category)[0]
      ),
      1
    )[0] || null;
    if (!selectedEvent) return null;
    return selectedEvent.callback(...data);
  }
  // Server listening starting
  public async start(): Promise<void> {
    for await (const request of this.server) {
      this.emit(`${request.url}||${request.method.toLowerCase()}`, request);
    }
  }
}

const server: HTTPServer = new HTTPServer({
  port: 8080,
  hostname: 'localhost',
});

server.get('/', function(request: ServerRequest) {
  request.respond({
    body: `URL demandée : ${request.url}`
  });
});

await server.start();
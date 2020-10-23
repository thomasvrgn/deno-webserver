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
  public get port(): number { return this.configuration.port };
  public get hostname(): string { return this.configuration.hostname };

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
  public async listen(callback: Function): Promise<void> {
    await callback();
    for await (const request of this.server) {
      this.emit(`${request.url}||${request.method.toLowerCase()}`, request);
    }
  }
}

const server: HTTPServer = new HTTPServer({
  port: 8080,
  hostname: 'localhost',
});

server.get('/', async function(request: ServerRequest) {
  await request.respond({
    body: `Requested URL: ${request.url}`
  });
});

await server.listen(function() {
  console.log('Server listening on', server.port);
});
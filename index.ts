import { serve, Server, ServerRequest } from 'https://deno.land/std@0.74.0/http/server.ts';

export interface Event {
  name: string,
  callback: Function,
  id: string,
}

export class Listener {
  private _events: Array<Event> = [];
  private lastID: number = 0;
  public on(eventName: string, callback: Function): void {
    this.events.push({
      name: eventName,
      callback: callback,
      id: String(this.lastID + 1),
    });
  }

  public emit(eventName: string, ...data: Array<any>): Function | null {
    const selectedEvent: Event = this._events.filter((x: Event) => x.name === eventName)[0];
    if (!selectedEvent) return null;
    this._events = this._events.filter((x: Event) => x.id !== selectedEvent.id);
    return selectedEvent.callback(...data);
  }

  public off(eventName: string): void {
    this._events = this._events.filter((x: Event) => x.name !== eventName);
  }

  public get events(): Array<Event> {
    return this._events;
  }

  public event(eventName: string): Event | null {
    return this._events.filter((x: Event) => x.name === eventName)[0] || null;
  }
}

export class HTTPServer extends Listener {
  private readonly port: number = 8080;
  private server: Server = serve({ port: this.port });
  constructor(port: number) {
    super();
    this.port = port;
  }
  public get(endpoint: string, callback: Function): void {
    this.on(endpoint, callback);
  }
  public async serve(): Promise<void> {
    this.server = serve({
      port: this.port,
    });
    for await (const request of this.server) this.emit(request.url, request);
  }
}

const server = new HTTPServer(3000);

server.get('/', function(req: ServerRequest) {
  console.log('GET:', req.url)
})

await server.serve();
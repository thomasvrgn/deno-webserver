import { Event } from '../typings/event.ts';
import { EventListener } from '../typings/listener.ts';

export class Listener implements EventListener {
  public readonly events: Event[] = [];
  public on(eventName: string, callback: Function): void {
    this.events.push({
      name: eventName,
      callback: callback,
    });
  }
  public emit(eventName: string, ...data: any[]): Function | null {
    const selectedEvent: Event | null = this.events.splice(
      this.events.indexOf(
        this.events.filter((x: Event) => x.name === eventName)[0]
      ),
      1
    )[0] || null;
    if (!selectedEvent) return null;
    return selectedEvent.callback(...data);
  }
  public off(eventName: string): void {
    this.events.splice(
      this.events.indexOf(
        this.events.filter((x: Event) => x.name === eventName)[0]
      ),
      1
    );
  }
}
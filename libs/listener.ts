import { Event } from '../typings/event.ts';
import { EventListener } from '../typings/listener.ts';

export class Listener implements EventListener {
  public readonly events: Event[] = [];
  public on(eventName: string, callback: Function): void {}
  public emit(eventName: string): Function | null {
    return null;
  }
  public off(eventName: string): void {}
}
import { Event } from './event.ts';
export interface EventListener {
  events: Event[];
  emit: (eventName: string) => Function | null,
  on: (eventName: string, callback: Function) => void,
  off: (eventName: string) => void,
}
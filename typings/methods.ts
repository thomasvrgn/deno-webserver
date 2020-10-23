import { EventListener } from './listener.ts';
import {Event} from './event.ts';

export interface RequestMethods {
  get: (routeName: string, callback: Function) => void,
  post: (routeName: string, callback: Function) => void,
}

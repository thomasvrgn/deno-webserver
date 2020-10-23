export interface Event {
  name: string,
  callback: Function,
}

export interface MethodEvent extends Event {
  name: string,
  callback: Function,
  category: string,
}
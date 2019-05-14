export interface IAnyObject {
  [property: string]: any;
}

export type Options = IAnyObject;
export type Command = string | IAnyObject;
export type Parameters = any[] | IAnyObject;
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type DataObject<T extends object> = T | DeepPartial<T>;

export interface ICount {
  count: number;
}
export type ID = string | number;

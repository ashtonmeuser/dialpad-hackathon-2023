import { JSON } from "json-as/assembly";

// Byte offset in exported linear Wasm memory
// Must be exported by top-level module i.e. `export { offset } from './lib';`
export const offset: usize = heap.alloc(65536); // Allocate space for JSON

// @ts-expect-error
@json class Contact {
  number!: string;
  country!: string;
}

// @ts-expect-error
@json class Operator extends Contact {
  name!: string;
  id!: i64;
}

// @ts-expect-error
@json class Call {
  caller!: Contact;
  assignee!: i64;
  timestamp!: number;
}

// @ts-expect-error
@json export class DialpadData {
  timestamp!: number;
  caller!: Contact;
  operators!: Array<Operator>;
  call_history!: Array<Call>;
}

// Convenience function to load agent and call history JSON
// JSON is stored in exported linear Wasm memory
export function getData(): DialpadData {
  const length: u32 = u32(load<u32>(offset)); // JSON length
  const json = String.UTF8.decodeUnsafe(offset + 4, length); // Stored JSON
  return JSON.parse<DialpadData>(json);
}

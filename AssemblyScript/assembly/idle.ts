import { getData, DialpadData } from './lib';
export { offset } from './lib';

// Route calls to the longest idle operator
export function route(): i64 {
  const data: DialpadData = getData();

  // Gotta monkey around a bit as AssemblyScript doesn't support closures
  // See https://github.com/AssemblyScript/assemblyscript/issues/798
  let lastCalls = new Map<i64, number>();
  for (let i = 0; i < data.operators.length; i++) lastCalls.set(data.operators[i].id, 0);
  const calls = data.call_history; // .sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);
  for (let i = 0; i < calls.length; i++) lastCalls.set(calls[i].assignee, calls[i].timestamp);
  const keys = lastCalls.keys();
  let assigneeId: i64 = 0;
  let assigneeTimestamp: number = -1;
  for (let i = 0; i < keys.length; i++) {
    if (assigneeTimestamp < 0 || lastCalls.get(keys[i]) < assigneeTimestamp) {
      assigneeId = keys[i];
      assigneeTimestamp = lastCalls.get(keys[i]);
    }
  }

  return assigneeId;
}

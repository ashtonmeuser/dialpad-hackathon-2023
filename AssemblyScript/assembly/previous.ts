import { getData, DialpadData } from './lib';
export { offset } from './lib';

// Route calls to the same operator as last time if applicable
export function route(): i64 {
  const data: DialpadData = getData();
  for (let i = 0; i < data.call_history.length; i++) {
    const call = data.call_history[i];
    if (call.caller.number == data.caller.number) {
      return call.assignee;
    }
  }
  return data.operators[(i32)(Math.random() * data.operators.length)].id; // Default to random agent
}

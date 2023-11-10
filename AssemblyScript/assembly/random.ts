import { getData, DialpadData } from './lib';
export { offset } from './lib';

// Route calls to a random operator
export function route(): i64 {
  const data: DialpadData = getData();
  const numAgents = data.operators.length;
  const assigneeIndex = (i32)(Math.random() * numAgents);
  return data.operators[assigneeIndex].id;
}

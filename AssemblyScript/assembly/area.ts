import { getData, DialpadData } from './lib';
export { offset } from './lib';

// Route calls to an agent with the same area code
export function route(): i64 {
  const data: DialpadData = getData();
  for (let i = 0; i < data.operators.length; i++) {
    if (data.operators[i].number.substr(1, 3) == data.caller.number.substr(1, 3)) {
      return data.operators[i].id;
    }
  }
  return data.operators[0].id;
}

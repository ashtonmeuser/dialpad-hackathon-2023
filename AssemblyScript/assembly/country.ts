import { getData, DialpadData } from './lib';
export { offset } from './lib';

// Route calls to an agent in the same country
export function route(): i64 {
  const data: DialpadData = getData();
  for (let i = 0; i < data.operators.length; i++) {
    if (data.operators[i].country == data.caller.country) {
      return data.operators[i].id;
    }
  }
  return data.operators[0].id;
}

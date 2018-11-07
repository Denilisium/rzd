export function groupBy<T>(array: T[], key: string): { [key: string]: T[] } {
  return array.reduce((prev, curr) => {
    (prev[curr[key]] = prev[curr[key]] || []).push(curr);
    return prev;
  }, {});
}

export function orderByDesc<T>(array: T[], key: string): T[] {
  return array.sort((a, b) => {
    return a[key] - b[key];
  });
}
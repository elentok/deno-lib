export function sum<T>(arr: T[], predicate: (item: T) => number): number {
  return arr.reduce((prevSum, item) => prevSum + predicate(item), 0)
}

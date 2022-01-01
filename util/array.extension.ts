export {};

declare global {
  interface Array<T> {
    randomElement(): T;
    randomElements(n: number): Array<T>;
  }
}

Array.prototype.randomElement = function <T>(): T {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.randomElements = function <T>(n: number): T[] {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(this.randomElement());
  }
  return result;
};

import { bold, cyan, italic, yellow } from "colors";

export function warn(s: string): string {
  return yellow(s);
}

export function value(s: string): string {
  return cyan(bold(s));
}

export function question(s: string): string {
  return italic(s);
}

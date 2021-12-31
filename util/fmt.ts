import { italic, red, yellow } from "colors";

export function warn(s: string): string {
  return yellow(s);
}

export function value(s: string): string {
  return italic(s);
}

export function error(s: string): string {
  return red(s);
}

export function info(s: string): string {
  return s;
}

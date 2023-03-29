// For some reason `replaceAll` isn't defined even if the ES2022 lib is included
// in TypeScript's compiler configuration. Dunno what's going on - hence this hack
declare global {
  interface String {
    replaceAll(s: string, r: string): string
  }
}

export { }

// For some reason `replaceAll` isn't defined even if the ES2022 lib is included
// in TypeScript's compiler configuration. Dunno what's going on - hence this hack
declare global {
  interface String {
    replaceAll(s: string, r: string): string
  }
}

/**
 * Simple interface to define objects that allow for writing lines
 */
export interface Writer {
  /**
   * Write a single line
   *
   * @param line line to write (handle missing values!)
   */
  write(line?: string)
}

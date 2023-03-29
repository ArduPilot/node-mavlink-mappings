/**
 * Simple object cloning facility
 */
function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input))
}

/**
 * A pipeable object definition
 */
export interface Pipeable<I> {
  pipe<O>(transform: (input: I) => O): O & Pipeable<O>
}

/**
 * Construction of Pipeable object
 */
export function pipeable<I>(input: I) {
  const result = clone(input)
  if ((result as any).pipe) {
    throw new Error('Error: the given object is already pipeable')
  }

  const pipeableResult = result as Pipeable<I>
  pipeableResult.pipe = <O>(transform: (input: I) => O) => pipeable<O>(transform(result))

  return result as I & Pipeable<I>
}

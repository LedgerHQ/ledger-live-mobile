import assert from 'assert';

/**
 * Validates that an unknown-typed `object` is an actual object and that it potentially has properties of type T.
 * These properties may or may not actually exist, and their type is unknown.
 *
 * This is useful to let TypeScript know about potential properties of the object so it doesn't complain when you try
 * to use them.
 */
export const isObjectLike = <T>(object: unknown): object is Partial<Record<keyof T, unknown>> => {
  return typeof object === 'object' && object !== null;
};

/**
 * Asserts that an unknown `token` is one of the values of an Enum `enumObject`.
 * @param token The token to check.
 * @param enumObject The Enum with values to compare.
 */
export const assertEnum: <Enum>(token: unknown, enumObject: Enum) => asserts token is Enum[keyof Enum] = <Enum>(
  token: unknown,
  enumObject: Enum,
): asserts token is Enum[keyof Enum] => {
  const keys = Object.keys(enumObject).filter((key) => {
    return !/^\d/.test(key);
  });
  const values = keys.map((key) => {
    return (enumObject as Record<string, unknown>)[key];
  });
  assert(values.includes(token), `token must be one of: ${values.join()}, but got ${token}`);
};

/**
 * Throws an error if called. This is useful to assert switch blocks where the default case should never be hit.
 */
export function assertUnreachable(x: string): never {
  throw new Error(`Value of "${x}" was unexpectedly found.`);
}

export function assertArrayOfString(array: unknown): asserts array is string[] {
  assert(Array.isArray(array), `'array' is not an array`);
  assert(
    array.every((element) => typeof element === 'string'),
    'all elements of the array must be a string',
  );
}

export function assertArrayOfInstance<T>(
  array: unknown,
  Class: new (...args: any[]) => T,
  message?: string | Error,
): asserts array is Array<T> {
  assert(Array.isArray(array), message);
  assert(
    array.every((elem) => elem instanceof Class),
    message,
  );
}

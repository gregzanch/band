/**
 * Omit properties from an object
 * @param {string[]} props
 * @param {Object} obj
 * @returns {Object}
 * @example
 * ```js
 * omit(["dogs"], { cats: 2, dogs: 5 }) // { cats: 2 }
 * ```
 */

export function omit(props = [], obj) {
  if (obj == null || ["string", "number", "bigint", "boolean", "symbol", "undefined"].includes(typeof obj)) {
    return obj
  }
  const keys = Object.keys(obj)
  return keys.filter((key) => !props.includes(key)).reduce((acc, prop) => ({ ...acc, [prop]: obj[prop] }), {})
}

/**
 * Traverse up the DOM until a condition is met
 * @param {HTMLElement|Node} node start node
 * @param {(node: HTMLElement|Node) => boolean} condition traverse until condition is met
 * @returns {HTMLElement|Node|null} node that passed met the condition
 */
export function traverseUpUntil(
  node: HTMLElement | Node,
  condition: (node: HTMLElement | Node) => boolean
): HTMLElement | Node | null {
  let child = node
  let parent = child.parentElement
  if (parent == null) {
    return child
  }
  if (condition(node)) {
    return node
  }
  while (parent && !condition(parent)) {
    child = parent
    parent = child.parentElement
  }
  return condition(parent) ? parent : null
}

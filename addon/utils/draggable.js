import { assign } from '@ember/polyfills';
import { setProperties } from '@ember/object';
/**
 * Returns a new array with a single element moved within that array
 * @param  {array}  array
 * @param  {number} from  index to move from
 * @param  {to}     to    index to move to
 */
export function moveArrayElement(array, from, to) {
  array = [ ...array ];

  // adjust the index, to account for the difference between drop targets - these are indexed from -1
  // as we need to allow items to be placed before the item at index 0
  to = (to < from ? to + 1 : to);

  if (from > array.length || to > array.length) {
    return array;
  }

  return array.insertAt(to, array.splice(from, 1)[0]);
}

/**
 * Returns a new object with the item from the provided group & key moved to the target group & key
 * @param  {object} object
 * @param  {number} from      index to move from
 * @param  {string} fromGroup group name to move from
 * @param  {number} to        index to move to
 * @param  {string} toGroup   group name to move to
 * @return {object}
 */
export function moveObjectElement(object, [from, fromGroup], [to, toGroup]) {
  object = assign({}, object);

  // if it's moving within the same group, just move within that array
  if (fromGroup === toGroup) {
    object[fromGroup] = moveArrayElement(object[fromGroup], from, to);

    return object;
  }

  const elementToMove = object[fromGroup][from];

  setProperties(object, {
    [fromGroup]: [ ...object[fromGroup] ].removeAt(from),
    [toGroup]: [ ...object[toGroup] ].insertAt(to + 1, elementToMove)
  });

  return object;
}

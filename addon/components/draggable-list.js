import Component from '@ember/component';
import layout from '../templates/components/draggable-list';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

import { htmlSafe } from '@ember/template';
import { computed, setProperties } from '@ember/object';

import { isPresent, typeOf, tryInvoke } from '@ember/utils';
import { assign } from '@ember/polyfills';

export const EVENT_ITEM_DROPPED = Symbol('item dropped');
export const EVENT_ITEM_HOVER = Symbol('item hovered');
export const EVENT_ITEM_GRAB = Symbol('item grabbed');

export default Component.extend({
  layout,

  /**
   * Items to render in the list
   * @type {array|object|null}
   */
  items: null,

  /**
   * Events property used to communicate with child components
   * @type {object}
   */
  events: null,

  /**
   * Y coordinates of the mouse cursor
   * @type {number|null}
   */
  mouseY: null,

  /**
   * Index of the currently active item
   * @type {number|null}
   */
  activeIndex: null,

  /**
   * Active group (if in a grouped list)
   * @type {string|null}
   */
  activeGroup: null,

  /**
   * Index of the current drop target
   * @type {number|null}
   */
  dropTarget: null,

  /**
   * The current drop target group
   * @type {string|null}
   */
  groupTarget: null,

  /**
   * Sets up event listeners
   * @override
   */
  init() {
    this._super(...arguments);

    this.set('events', EmberObject.extend(Evented).create());

    this.events.on(EVENT_ITEM_DROPPED, () => {
      if (isPresent(this.dropTarget) && isPresent(this.activeIndex)) {
        if (this.isGroupedList && isPresent(this.groupTarget) && isPresent(this.activeGroup)) {
          return tryInvoke(this, 'onChange', [this.moveObjectElement(this.items, this.activeIndex, this.activeGroup, this.dropTarget, this.groupTarget)]);
        }

        tryInvoke(this, 'onChange', [this.moveArrayElement(this.items, this.activeIndex, this.dropTarget)]);
      }

      this.set('dropTarget', null);
    });

    this.events.on(EVENT_ITEM_HOVER, (dropTarget, groupTarget = null) => {
      this.setProperties({
        dropTarget,
        groupTarget
      });
    });

    this.events.on(EVENT_ITEM_GRAB, (activeIndex, element, activeGroup = null) => {
      this.setProperties({
        activeIndex,
        activeGroup,
        elementHeight: element.offsetHeight
      });

      // add event listener on the whole document, this stops the component bugging out if mouse is moved outside the element
      document.addEventListener('mouseup', this.mouseUpListener);
      document.addEventListener('mouseleave', this.mouseUpListener);
    });

    // create event listener to bind to mouse events on the document
    this.set('mouseUpListener', {
      handleEvent: () => {
        this.events.trigger(EVENT_ITEM_DROPPED);

        this.setProperties({
          activeIndex: null,
          activeGroup: null,
          groupTarget: null,
          dropTarget: null
        });

        document.removeEventListener('mouseup', this.mouseUpListener);
        document.removeEventListener('mouseleave', this.mouseUpListener);
      }
    });
  },

  /**
   * Removes event listeners from document if this element is removed
   */
  willDestroy() {
    this._super(...arguments);

    document.removeEventListener('mouseup', this.mouseUpListener);
    document.removeEventListener('mouseleave', this.mouseUpListener);
  },

  /**
   * Event listener for document mouse up events
   * @type {object}
   */
  mouseUpListener: null,

  /**
   * Whether the list provided is grouped
   */
  isGroupedList: computed('items', {
    get() {
      return typeOf(this.items) === 'object';
    }
  }),

  /**
   * Returns a new array with a single element moved within that array
   * @param  {array}  array
   * @param  {number} from  index to move from
   * @param  {to}     to    index to move to
   */
  moveArrayElement(array, from, to) {
    array = [ ...array ];

    // adjust the index, to account for the difference between drop targets - these are indexed from -1
    // as we need to allow items to be placed before the item at index 0
    to = (to < from ? to + 1 : to);

    if (from > array.length || to > array.length) {
      return array;
    }

    return array.insertAt(to, array.splice(from, 1)[0]);
  },

  /**
   * Returns a new object with the item from the provided group & key moved to the target group & key
   * @param  {object} object
   * @param  {number} from      index to move from
   * @param  {string} fromGroup group name to move from
   * @param  {number} to        index to move to
   * @param  {string} toGroup   group name to move to
   * @return {object}
   */
  moveObjectElement(object, from, fromGroup, to, toGroup) {
    object = assign({}, object);

    // if it's moving within the same group, just move within that array
    if (fromGroup === toGroup) {
      object[fromGroup] = this.moveArrayElement(object[fromGroup], from, to);

      return object;
    }

    const elementToMove = object[fromGroup][from];

    setProperties(object, {
      [fromGroup]: [ ...object[fromGroup] ].removeAt(from),
      [toGroup]: [ ...object[toGroup] ].insertAt(to + 1, elementToMove)
    });

    return object;
  },

  /**
   * Handles mouse events to get the pointer location
   * @param  {MouseEvent} event
   */
  mouseMove(event) {
    const rect = this.element.getBoundingClientRect();

    let top = event.clientY - rect.top;

    if (top < 0) {
      top = 0;
    }

    if (top > rect.height) {
      top = rect.height;
    }

    this.set('mouseY', top);
  },

  /**
   * Style for the element currently being dragged
   */
  draggingStyle: computed('mouseY', {
    get() {
      return htmlSafe(`top:${this.mouseY - this.elementHeight}px;`);
    }
  })
});

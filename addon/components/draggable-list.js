import Component from '@ember/component';
import layout from '../templates/components/draggable-list';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

import { isPresent, tryInvoke } from '@ember/utils';

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
   * X coordinates of the mouse cursor
   * @type {number|null}
   */
  mouseX: null,

  /**
   * Index of the currently active item
   * @type {number|null}
   */
  activeIndex: null,

  /**
   * Index of the current drop target
   * @type {number|null}
   */
  dropTarget: null,

  /**
   * Whether to allow dragging elements outside the container
   * @type {Boolean}
   */
  isGrouped: false,

  elementHeight: null,

  elementWidth: null,

  /**
   * Sets up event listeners
   * @override
   */
  init() {
    this._super(...arguments);

    //grouped elements pass in their own evented so it can be shared
    if (this.isGrouped) {
      return;
    }

    this.set('events', EmberObject.extend(Evented).create());

    this.events.on(EVENT_ITEM_DROPPED, () => {
      if (isPresent(this.dropTarget) && isPresent(this.activeIndex)) {
        tryInvoke(this, 'onChange', [this.moveArrayElement(this.items, this.activeIndex, this.dropTarget)]);
      }

      this.setProperties({
        dropTarget: null,
        dropGroup: null
      });
    });

    this.events.on(EVENT_ITEM_HOVER, (dropTarget, dropGroup) => {
      this.setProperties({
        dropTarget,
        dropGroup
      });
    });

    this.events.on(EVENT_ITEM_GRAB, ([activeIndex], activeItem, element) => {
      this.setProperties({
        activeIndex,
        activeItem,
        elementHeight: element.offsetHeight,
        elementWidth: element.offsetWidth
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
          dropTarget: null,
          dropGroup: null
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
   * Handles mouse events to get the pointer location
   * @param  {MouseEvent} event
   */
  mouseMove(event) {
    if (this.isGrouped) {
      return true;
    }

    const rect = this.element.getBoundingClientRect();

    let top = event.clientY - rect.top;
    let left = event.clientX - rect.left;

    if (top < 0) {
      top = 0;
    }

    if (top > rect.height) {
      top = rect.height;
    }

    this.setProperties({
      mouseY: top,
      mouseX: left
    });
  },

  /**
   * Style to show on the element being dragged to allow it to follow the mouse
   *
   * @type string
   */
  style: computed('mouseY', 'mouseX', 'isGrouped', {
    get() {
      const style = `position:absolute;pointer-events:none;top:${this.mouseY - this.elementHeight}px;`;

      if (this.isGrouped) {
        return htmlSafe(`${style}left:${this.mouseX - this.elementWidth}px;`);
      }
      return htmlSafe(style);
    }
  })
});

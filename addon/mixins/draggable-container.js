import Mixin from '@ember/object/mixin';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

import { isPresent, tryInvoke } from '@ember/utils';

export const EVENT_ITEM_DROPPED = Symbol('item dropped');
export const EVENT_ITEM_HOVER = Symbol('item hovered');
export const EVENT_ITEM_GRAB = Symbol('item grabbed');

export default Mixin.create({
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
   * Whether to allow dragging elements horizontally
   * @type {Boolean}
   */
  allowHorizontal: false,

  /**
   * Whether the list is part of a group
   * @private
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

    // grouped elements handle set-up from their parent
    if (this.isGrouped) {
      return;
    }

    this.set('events', EmberObject.extend(Evented).create());

    this.events.on(EVENT_ITEM_DROPPED, () => {
      const { dropTarget, activeIndex, dropGroup, activeGroup } = this;

      this.setProperties({
        dropTarget: null,
        activeIndex: null,
        activeGroup: null,
        dropGroup: null
      });

      if (isPresent(dropTarget) && isPresent(activeIndex)) {
        tryInvoke(this, 'onChange', [ [activeIndex, activeGroup], [dropTarget, dropGroup] ]);
      }
    });

    this.events.on(EVENT_ITEM_HOVER, (dropTarget, dropGroup) => {
      this.setProperties({
        dropTarget,
        dropGroup
      });
    });

    this.events.on(EVENT_ITEM_GRAB, ([activeIndex, activeGroup], activeItem, element) => {
      this.setProperties({
        activeIndex,
        activeGroup,
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
          activeGroup: null,
          activeItem: null,
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
});

import Component from '@ember/component';
import layout from '../../templates/components/draggable-list/item';
import { computed } from '@ember/object';

import { EVENT_ITEM_HOVER } from '../draggable-list';

export default Component.extend({
  layout,

  /**
   * Item index
   * @type {number|null}
   */
  index: null,

  /**
   * Index of the currently active item
   * @type {number|null}
   */
  activeIndex: null,

  /**
   * Inactive items can't be dragged
   * @type {Boolean}
   */
  inactive: false,

  /**
   * Index of the current drop target
   * @type {number|null}
   */
  dropTarget: null,

  /**
   * Events property used to communicate with parent component
   * @type {object}
   */
  events: null,

  /**
   * Whether this element is currently being dragged
   * @type {boolean}
   */
  isDragging: computed('index', 'activeIndex', {
    get() {
      return (this.activeIndex === this.index);
    }
  }),

  /**
   * Whether this item is visible.
   * Set to false if this item is being dragged, and the current drop target is not this item's current location.
   * @type {boolean}
   */
  isVisible: computed('isDragging', 'dropTarget', {
    get() {
      if (this.isDragging) {
        return (this.dropTarget === null || this.dropTarget === this.index);
      }

      return true;
    }
  }),

  /**
   * Handles mouse events to detect the active drop target.
   * @param  {MouseEvent} event
   */
  mouseMove(event) {
    if (this.activeIndex === null) {
      return;
    }

    const rect = this.element.getBoundingClientRect();
    const dropIndex = this.index + (((event.clientY - rect.top) > (rect.height / 2)) ? 0 : -1);

    if (this.activeIndex === dropIndex || this.activeIndex === (dropIndex + 1)) {
      return this.events.trigger(EVENT_ITEM_HOVER, null);
    }

    this.events.trigger(EVENT_ITEM_HOVER, dropIndex);
  }
});

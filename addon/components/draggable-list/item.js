import Component from '@ember/component';
import layout from '../../templates/components/draggable-list/item';
import { computed } from '@ember/object';

import { EVENT_ITEM_GRAB, EVENT_ITEM_HOVER } from '../draggable-list';

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
   * Item's group (if in a grouped list)
   * @type {string|null}
   */
  group: null,

  /**
   * Active group (if in a grouped list)
   * @type {string|null}
   */
  activeGroup: null,

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
   * The current drop target group
   * @type {string|null}
   */
  groupTarget: null,

  /**
   * Events property used to communicate with parent component
   * @type {object}
   */
  events: null,

  /**
   * Whether this element is currently being dragged
   * @type {boolean}
   */
  isDragging: computed('index', 'activeIndex', 'group', 'activeGroup', {
    get() {
      return ((this.activeIndex === this.index) && (this.activeGroup === this.group));
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
        return (this.dropTarget === null || this.dropTarget === this.index && this.groupTarget === this.group);
      }

      return true;
    }
  }),

  /**
   * Starts dragging an element on mouse down.
   * @param  {MouseEvent} event
   */
  mouseDown(event) {
    if (this.inactive) {
      return;
    }

    event.preventDefault();

    this.events.trigger(EVENT_ITEM_GRAB, this.index, this.element, this.group);
  },

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

    if ((this.group === this.activeGroup) && (this.activeIndex === dropIndex || this.activeIndex === (dropIndex + 1))) {
      return this.events.trigger(EVENT_ITEM_HOVER, null, this.group);
    }

    this.events.trigger(EVENT_ITEM_HOVER, dropIndex, this.group);
  }
});

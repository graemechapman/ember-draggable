import Component from '@ember/component';
import layout from '../../templates/components/draggable-list/drag-handle';

import { EVENT_ITEM_GRAB } from '../draggable-list';

export default Component.extend({
  layout,

  /**
   * Item index
   * @type {number|null}
   */
  index: null,

  /**
   * Events property used to communicate with parent component
   * @type {object}
   */
  events: null,

  /**
   * Starts dragging an element on mouse down.
   * @param  {MouseEvent} event
   */
  mouseDown(event) {
    event.preventDefault();

    this.events.trigger(EVENT_ITEM_GRAB, this.index, this.element);
  }
});

import Component from '@ember/component';
import layout from '../../templates/components/draggable-list/item';
import { computed } from '@ember/object';

import { EVENT_ITEM_GRAB, EVENT_ITEM_HOVER } from '../draggable-list';

export default Component.extend({
  layout,

  index: null,
  activeIndex: false,
  group: null,
  activeGroup: null,

  isDragging: computed('index', 'activeIndex', 'group', 'activeGroup', {
    get() {
      return ((this.activeIndex === this.index) && (this.activeGroup === this.group));
    }
  }),

  mouseDown(event) {
    event.preventDefault();

    this.events.trigger(EVENT_ITEM_GRAB, this.index, this.element, this.group);
  },

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

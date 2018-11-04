import Component from '@ember/component';
import layout from '../templates/components/drag-list-group';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import { isPresent, tryInvoke } from '@ember/utils';
import { debounce } from '@ember/runloop';

import { EVENT_ITEM_GRAB, EVENT_ITEM_DROPPED, EVENT_ITEM_HOVER } from './draggable-list';

export default Component.extend({
  layout,

  events :null,

  activeIndex: null,

  activeGroup: null,

  dropTarget: null,
  dropGroup: null,

  init() {
    this._super(...arguments);

    this.set('events', EmberObject.extend(Evented).create());

    this.events.on(EVENT_ITEM_DROPPED, () => {
      if (isPresent(this.dropTarget) && isPresent(this.activeIndex)) {
        tryInvoke(this, 'onChange', [this.moveArrayElement(this.items, this.activeIndex, this.dropTarget)]);
      }

      this.set('dropTarget', null);
    });

    this.events.on(EVENT_ITEM_HOVER, (dropTarget, dropGroup) => {
      debounce(this, () => {
        this.setProperties({
          dropTarget,
          dropGroup
        });
      }, 50, true);
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

  mouseMove(event) {
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
  }
});

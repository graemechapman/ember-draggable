import Component from '@ember/component';
import layout from '../templates/components/draggable-list';
import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

import { htmlSafe } from '@ember/template';
import { computed, setProperties } from '@ember/object';

import { isPresent, typeOf } from '@ember/utils';
import { assign } from '@ember/polyfills';

export const EVENT_ITEM_DROPPED = Symbol('item dropped');
export const EVENT_ITEM_HOVER = Symbol('item hovered');
export const EVENT_ITEM_GRAB = Symbol('item grabbed');

export default Component.extend({
  layout,

  items: null,
  events: null,
  mouseY: null,
  activeIndex: null,
  dropTarget: null,
  mouseUpListener: null,
  groupTarget: null,
  activeGroup: null,

  init() {
    this._super(...arguments);

    this.set('events', EmberObject.extend(Evented).create());

    this.events.on(EVENT_ITEM_DROPPED, () => {
      if (isPresent(this.dropTarget) && isPresent(this.activeIndex)) {
        if (this.isGroupedList && isPresent(this.groupTarget) && isPresent(this.activeGroup)) {
          return this.onChange(this.moveObjectElement(this.items, this.activeIndex, this.activeGroup, this.dropTarget, this.groupTarget));
        }

        this.onChange(this.moveArrayElement(this.items, this.activeIndex, this.dropTarget));
      }

      this.set('dropTarget', null);
    });

    this.events.on(EVENT_ITEM_HOVER, (itemId, group = null) => {
      this.set('dropTarget', itemId);
      this.set('groupTarget', group);
    });

    this.events.on(EVENT_ITEM_GRAB, (itemId, element, group = null) => {
      this.set('activeIndex', itemId);
      this.set('activeGroup', group);
      this.set('elementHeight', element.offsetHeight);

      // add event listener on the whole document, this stops the component bugging out if mouse is moved outside the element
      this.set('mouseUpListener', document.addEventListener('mouseup', () => {
        this.events.trigger(EVENT_ITEM_DROPPED);

        this.set('activeIndex', null);
        this.set('activeGroup', null);
        this.set('groupTarget', null);
        this.set('dropTarget', null);

        document.removeEventListener('mouseup', this.mouseUpListener);
      }));
    });
  },

  isGroupedList: computed('items', {
    get() {
      return typeOf(this.items) === 'object';
    }
  }),

  moveArrayElement(array, from, to) {
    array = [ ...array ];

    const modifier = (to > from ? 0 : 1);

    array.insertAt(to + modifier, array.splice(from, 1)[0]);

    return array;
  },

  moveObjectElement(originalObject, from, fromGroup, to, toGroup) {
    const object = assign({}, originalObject);

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

  mouseMove(event) {
    const rect = this.element.getBoundingClientRect();

    this.set('mouseY', event.clientY - rect.top);
  },

  style: computed('mouseY', {
    get() {
      return htmlSafe(`position:absolute;pointer-events:none;top:${this.mouseY - this.elementHeight}px`);
    }
  })
});

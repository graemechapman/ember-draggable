import Component from '@ember/component';
import layout from '../templates/components/draggable-list';

import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

import draggableContainer from '../mixins/draggable-container';

export default Component.extend(draggableContainer, {
  layout,

  /**
   * Style to show on the element being dragged to allow it to follow the mouse
   *
   * @type string
   */
  style: computed('mouseY', 'mouseX', 'allowHorizontal', {
    get() {
      const style = `position:absolute;pointer-events:none;top:${this.mouseY - this.elementHeight}px;`;

      if (this.allowHorizontal) {
        return htmlSafe(`${style}left:${this.mouseX - this.elementWidth}px;`);
      }
      return htmlSafe(style);
    }
  })
});

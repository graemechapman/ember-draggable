import ItemComponent from '../draggable-list/item';
import layout from '../../templates/components/draggable-grid/item';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default ItemComponent.extend({
  layout,

  classNames: ['draggable-grid-item'],

  classNameBindings: ['isDragging:ghost', 'inactive:inactive'],
  attributeBindings: ['style'],
  column: null,
  row: null,
  width: 1,
  height: 1,

  style: computed('row', 'column', 'height', 'width', {
    get() {
      return htmlSafe(`
        grid-column: ${this.column} / span ${this.width};
        grid-row: ${this.row} / span ${this.height};
      `);
    }
  })
});

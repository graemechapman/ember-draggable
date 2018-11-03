import ListComponent from './draggable-list';
import layout from '../templates/components/draggable-grid';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default ListComponent.extend({
  layout,

  columns: null,
  rows: null,

  style: computed('rows', 'columns', {
    get() {
      return htmlSafe(`
        grid-template-columns: repeat(${this.columns}, 1fr);
        grid-auto-rows: 1fr;
      `);
    }
  })
});

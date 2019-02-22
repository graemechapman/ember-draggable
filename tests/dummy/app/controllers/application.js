import Controller from '@ember/controller';

import { moveArrayElement, moveObjectElement } from 'ember-draggable/utils/draggable';

export default Controller.extend({
  listItems: null,
  groupItems: null,

  init() {
    this._super(...arguments);

    this.set('listItems', [
      { id: 1, text: 'foo' },
      { id: 2, text: 'bar' },
      { id: 3, text: 'baz' },
      { id: 4, text: 'bam' }
    ]);

    this.set('groupItems', {
      Lepismidae: [
        { id: 1, text: 'takar' },
        { id: 2, text: 'nosology' }
      ],
      panhandle: [
        { id: 1, text: 'casiri' },
        { id: 2, text: 'Guadagnini' }
      ],
      lunare: [
        { id: 1, text: 'terminatory' },
        { id: 2, text: 'semifunctional' }
      ],
      taxinomist: []
    });
  },

  actions: {
    didChange([from], [to]) {
      this.set('listItems', moveArrayElement(this.listItems, from, to));
    },

    didChangeGroup(from, to) {
      this.set('groupItems', moveObjectElement(this.groupItems, from, to));
    }
  }
});

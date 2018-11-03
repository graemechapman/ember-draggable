import Controller from '@ember/controller';

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

    this.set('gridItems', [
      { id: 1, text: 'foo', row: 1, column: 1, height: 1, width: 1 },
      { id: 2, text: 'bar', row: 3, column: 3, height: 1, width: 1 },
      { id: 3, text: 'baz', row: 2, column: 2, height: 1, width: 1 },
      { id: 4, text: 'bam', row: 1, column: 5, height: 1, width: 1 }
    ]);

    this.set('groupItems', {
      asdf: [
        { id: 1, text: 'foo' },
        { id: 2, text: 'bar' }
      ],
      ghjk: [
        { id: 3, text: 'baz' },
        { id: 4, text: 'bam' }
      ],
      qwerty: []
    });
  },

  actions: {
    didChange(items) {
      return this.set('listItems', items);
    },
    didChangeGroup(items) {
      this.set('groupItems', items);
    },
    didChangeGrid(items) {
      this.set('gridItems', items);
    }
  }
});

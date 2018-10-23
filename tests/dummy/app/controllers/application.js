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

    this.set('groupItems', {
      asdf: [
        { id: 1, text: 'foo' },
        { id: 2, text: 'bar' }
      ],
      ghjk: [
        { id: 3, text: 'baz' },
        { id: 4, text: 'bam' }
      ]
    });
  },

  actions: {
    didChange(items) {
      return this.set('listItems', items);
    },
    didChangeGroup(items) {
      this.set('groupItems', Object.assign({}, items));
      this.notifyPropertyChange('groupItems');
    }
  }
});

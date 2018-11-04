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

    this.set('groupItems', [
      {
        text: 'asdf',
        items: [
          { id: 1, text: 'foo' },
          { id: 2, text: 'bar' }
        ]
      },
      {
        text: 'ghjk',
        items: [
          { id: 3, text: 'baz' },
          { id: 4, text: 'bam' }
        ],
      },
      {
        text: 'qwerty',
        items: []
      }
    ]);
  },

  actions: {
    didChange(items) {
      return this.set('listItems', items);
    },
    didChangeGroup(items, stuff) {
      console.log(items, stuff);
      // this.set('groupItems', items);
    }
  }
});

import EmberObject from '@ember/object';
import DraggableContainerMixin from 'ember-draggable/mixins/draggable-container';
import { module, test } from 'qunit';

module('Unit | Mixin | draggable-container', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let DraggableContainerObject = EmberObject.extend(DraggableContainerMixin);
    let subject = DraggableContainerObject.create();
    assert.ok(subject);
  });
});

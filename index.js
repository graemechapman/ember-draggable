'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this.import('addon/styles/ember-draggable.css');
  }
};

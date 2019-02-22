import ListComponent from '@ember/component';
import layout from '../templates/components/drag-list-group';

import draggableContainer from '../mixins/draggable-container';

export default ListComponent.extend(draggableContainer, {
  layout
});

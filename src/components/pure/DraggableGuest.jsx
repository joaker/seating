import React,{PropTypes} from 'react';

import cnames from 'classnames/dedupe';
import { DragSource, DropTarget } from 'react-dnd';

const DraggableTypes = {
  guest: 'guest',
};

const guestSource = {
  beginDrag(props) {
    //props.setDragFocus();
    return {
      seatNumber: props.seatNumber,
      guestID: props.guestID,
    };
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class GuestContainer extends React.Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        color: isDragging ? 'blue': '',
        cursor: 'move'
      }}>
        {this.props.children}
      </div>
    );
  }
}

//name: PropTypes.string.isRequired,
GuestContainer.propTypes = {

  seatNumber: PropTypes.number.isRequired,

  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};


const DraggableGuest = DragSource(DraggableTypes.guest, guestSource, collectSource)(GuestContainer);

export default DraggableGuest;

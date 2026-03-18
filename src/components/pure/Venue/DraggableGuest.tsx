import React, { useEffect } from 'react';

import cnames from 'classnames/dedupe';
import { DragSource } from 'react-dnd';
import { DraggableTypes } from './dnd-types';

const guestSource = {
  beginDrag(props: any) {
    return {
      seatNumber: props.seatNumber,
      guestID: props.guestID,
    };
  }
};

function collectSource(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const guestIcon = (<span className={cnames('fa', 'fa-user')} />);

interface GuestContainerProps {
  connectDragSource: (el: React.ReactElement) => React.ReactElement | null;
  connectDragPreview: (el: React.ReactElement) => void;
  isDragging: boolean;
  children?: React.ReactNode;
  guestID?: any;
  seatNumber?: any;
}

const GuestContainer = React.memo((props: GuestContainerProps) => {
  const { connectDragSource, connectDragPreview, isDragging } = props;

  useEffect(() => {
    // Set custom drag preview — mirrors componentDidMount behavior
    connectDragPreview(guestIcon);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return connectDragSource(
    <div style={{
      opacity: isDragging ? 0.5 : 1,
      color: isDragging ? 'blue' : '',
      cursor: 'move',
    }}>
      {props.children}
    </div>
  );
});

// Cast to ComponentType<any> — react-dnd v2 HOC loses prop types at this boundary
const DraggableGuest: React.ComponentType<any> = React.memo(
  DragSource(DraggableTypes.guest, guestSource, collectSource)(GuestContainer as any)
);

export default DraggableGuest;

import styles from '../../../style/venue.module.scss';
import React from 'react';
import cnames from 'classnames/dedupe';
import sequal from 'shallowequal';
import DraggableGuest from './DraggableGuest';
import DroppableSeat from './DroppableSeat';

const angryStyle = styles.angry || 'angryGuest';
const happyStyle = styles.happy || 'happyGuest';

export const EmptySeat = () => (<div className={cnames(styles.seatAreaWrapper)}><div className={cnames(styles.seatArea, styles.emptySeat)}/></div>);

export class Seat extends React.Component{
  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){

    const next = Object.assign({}, nextProps)
    const thisun = Object.assign({}, this.props);

    delete next.focusGuest;
    delete thisun.focusGuest;

    var skipUpdate = sequal(next, thisun);

    return !skipUpdate;

  }
    // const {seatNumber, seatData = {}} = this.props;
    // const data = seatData[seatNumber];
    // if(!data) return (<EmptySeat/>);
    // const {guest, score} = seatData[seatNumber];

  render(){
    const {seatNumber, guestID, hateScore, likeScore, focusState, focusReaction, hasGuest, focusGuest, clearFocusedGuest, swapGuests} = this.props;
    const emptySeat = !hasGuest;// || !guest.id;
    if(emptySeat) return (<EmptySeat/>);

    //const { hate: hateScore, like: likeScore } = score;

    const scoreClass = (hateScore && angryStyle) ||
      (likeScore && happyStyle) ||
      styles.neutral;


    //const scoreClass = score ? styles.angry : styles.neutral;

    const showGuest = true;
    const content = showGuest ? guestID : seatNumber;

    const hasFocus = focusState ? (styles.hasFocus || 'hasFocus') : 'unfocused';




    return (
      <DroppableSeat
        swapGuests={swapGuests}
        seatNumber={seatNumber}
        guestID={guestID}
        className={cnames(styles.seatAreaWrapper, focusReaction, hasFocus, focusState)}>
        <DraggableGuest {...this.props}
          guestID={guestID}
          seatNumber={seatNumber}
          setDragFocus={() => focusGuest(guestID, 'dragging')}
          clearFocusedGuest={() => clearFocusedGuest(guestID, 'dragging')}
          >
        <div
          data-guest-id={guestID}
          onMouseDown={() => focusGuest(guestID, 'guestChosen')}
          className={cnames(styles.guest, 'glyphicon', 'glyphicon-user', scoreClass)}
          >{''}
        </div>
      </DraggableGuest>
    </DroppableSeat>
    );
  }
}

export default Seat;

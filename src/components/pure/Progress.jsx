import React from 'react';
import cnames from 'classnames/dedupe';
import {ProgressBar} from 'react-bootstrap'
import { connect } from 'react-redux';

const UnconnectedProgress = ({ratio = 0, children, started}) => {
  const percent = Math.round(ratio * 100);

  const progressPercent = percent + '%';

  //console.log('ratio is: ' + ratio +';')

  const progressType = ratio == 1 ?
    'progress-bar-info' : ( ratio ? 'progress-bar-primary progress-bar-striped' : '');

  const progressStyle = {
    minWidth: '2em',
    width: progressPercent,
    maxWith: progressPercent,
    minWith: progressPercent,
  };

  const ariaValues = {
    ['aria-valuenow']: ratio,
    ['aria-valuemin']: 0,
    ['aria-valuemax']:1
  };

  const content = ratio ? (
    <div className={cnames('progress-bar', progressType)} role="progressbar"  style={progressStyle}>
      {progressPercent}
      {children}
    </div>
  ) : '';

  const progressInstance = (
    <ProgressBar now={60} label="%(percent)s%" />
  );

  return (
    <div className="progress" style={{width:'100%'}}>
      {content}
    </div>);
}

const mapStateToProps = (state = Map()) => {
  return {
    ratio: state.get('optimizeProgressRatio'),
  };
};

const Progress = connect(
  mapStateToProps
)(UnconnectedProgress);

export default Progress;

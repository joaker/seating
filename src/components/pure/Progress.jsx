import React from 'react';
import cnames from 'classnames/dedupe';

const Progress = ({ratio = 0, children, started}) => {
  const percent = Math.round(ratio * 100);
  const progressPercent = percent + '%';

  console.log('ratio is: ' + ratio +';')

  const progressType = ratio == 1 ?
    'progress-bar-success' : ( ratio ? 'progress-bar-info' : '');

  const content = ratio ? (
    <div className={cnames('progress-bar', progressType)} role="progressbar" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={1} style={{minWidth: '2em', width: progressPercent}}>
      {progressPercent}
      {children}
    </div>
  ) : '';


  return (
    <div className="progress">
      {content}
    </div>);
}


export default Progress;

import React from 'react';
import cnames from 'classnames/dedupe';

const Progress = ({ratio = 0, children, started}) => {
  const percent = Math.round(ratio * 100);
  const progressPercent = percent + '%';

  const content = (!ratio && !started) ? undefined : (
    <div className={cnames('progress-bar', 'progress-bar-info')} role="progressbar" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={1} style={{minWidth: '2em', width: progressPercent}}>
      {progressPercent}
      {children}
    </div>
  );


  return (
    <div className="progress">
      {content}
    </div>);
}


export default Progress;

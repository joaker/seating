import React from 'react';
import styles from './ProgressStrip.module.scss';

interface ProgressStripProps {
  ratio: number;
  visible: boolean;
  complete: boolean;
}

const ProgressStrip: React.FC<ProgressStripProps> = ({ ratio, visible, complete }) => {
  const percent = Math.round(ratio * 100);

  return (
    <div
      className={`${styles.strip} ${!visible ? styles.hidden : ''} ${complete ? styles.complete : ''}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={styles.fill}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
};

export default ProgressStrip;

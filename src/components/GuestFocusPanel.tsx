import React from 'react';
import styles from './GuestFocusPanel.module.scss';
import names from '../data/names';

interface GuestFocusPanelProps {
  focusedGuest: any;
  onClear: () => void;
}

const GuestFocusPanel: React.FC<GuestFocusPanelProps> = ({ focusedGuest, onClear }) => {
  if (!focusedGuest || focusedGuest.id == null) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <span className={`${styles.emptyIcon} fa fa-mouse-pointer`} />
          <span className={styles.emptyText}>
            Click any guest to see<br />their relationships
          </span>
        </div>
      </div>
    );
  }

  const hates: number[] = focusedGuest.hates || [];
  const likes: number[] = focusedGuest.likes || [];
  const hasRelations = hates.length > 0 || likes.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.guestTitle}>{names.get(focusedGuest.id)}</span>
        <button className={styles.clearBtn} onClick={onClear} type="button" aria-label="Clear focus">
          <span className="fa fa-times" />
        </button>
      </div>

      <div className={styles.divider} />

      {!hasRelations && (
        <div className={styles.noRelations}>No strong opinions</div>
      )}

      {hates.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Conflicts ({hates.length})</div>
          {hates.map((id) => (
            <div key={id} className={`${styles.card} ${styles.conflictCard}`}>
              <span className={`${styles.cardIcon} ${styles.conflictIcon} fa fa-frown-o`} />
              {names.get(id)}
            </div>
          ))}
        </div>
      )}

      {likes.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Friends ({likes.length})</div>
          {likes.map((id) => (
            <div key={id} className={`${styles.card} ${styles.friendCard}`}>
              <span className={`${styles.cardIcon} ${styles.friendIcon} fa fa-smile-o`} />
              {names.get(id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestFocusPanel;

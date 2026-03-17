import styles from '../style/venue.module.scss';

import cnames from 'classnames/dedupe';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from './pure/Venue/Layout';
import ProgressComponent from './pure/Progress';
import { useVenueState } from '../hooks/useVenueState';

// Progress.jsx is a checkJs:false file — cast to avoid strict prop inference
const Progress = ProgressComponent as React.ComponentType<any>;

const Venue = () => {
  const navigate = useNavigate();
  const venueState = useVenueState();

  const { guests, guestCount, lastRunTime, seatsPerTable, progressRatio } = venueState;

  // Replaces componentWillMount — redirect to generate-guests if no guests loaded
  useEffect(() => {
    const numberOfGuests = guests.length;
    if (numberOfGuests) return;
    navigate('/generate-guests');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cnames(styles.venue, 'Venue')}>
      <div className={cnames('headerTable', 'container-fluid')}>
        <div className={cnames('row')}>
          <div className={cnames('col-12')}>
            <h2 style={{ display: 'block' }}>
              Venue {lastRunTime ? (
                <div style={{ display: 'inline-block' }}>
                  <h4 className="text-muted text-veryMuted" style={{ display: 'inline-block' }}>
                    Last Run: {lastRunTime}
                  </h4>
                </div>
              ) : ''}
              <Progress ratio={progressRatio} />
            </h2>
          </div>
        </div>
      </div>
      <Layout guestCount={guestCount} seatsPerTable={seatsPerTable} />
    </div>
  );
};

export default Venue;

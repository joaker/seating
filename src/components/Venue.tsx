import styles from '../style/venue.module.scss';

import cnames from 'classnames/dedupe';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from './pure/Venue/Layout';
import { useVenueState } from '../hooks/useVenueState';

const Venue = () => {
  const navigate = useNavigate();
  const venueState = useVenueState();

  const { guests, guestCount, seatsPerTable } = venueState;

  // Replaces componentWillMount — redirect to generate-guests if no guests loaded
  useEffect(() => {
    const numberOfGuests = guests.length;
    if (numberOfGuests) return;
    navigate('/generate-guests');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cnames(styles.venue, 'Venue')}>
      <Layout guestCount={guestCount} seatsPerTable={seatsPerTable} />
    </div>
  );
};

export default Venue;

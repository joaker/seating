import React from 'react';

const Expander = ({expanded}) => expanded ?
  <span className="fa fa-caret-down" aria-hidden="true"></span> :
  <span className="fa fa-caret-right" aria-hidden="true"></span>;

export default Expander;

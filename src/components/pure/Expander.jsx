import React from 'react';

const Expander = ({expanded}) => expanded ?
  <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span> :
  <span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>;

export default Expander;

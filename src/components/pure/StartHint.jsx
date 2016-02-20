import React from 'react';

const StartHint = ({children}) => (
  <div className="startHint text-success" style={{display:'inline-block', float: 'right',}}>
    <label style={{display:'inline-block', marginRight: '.5em', marginTop:'-1em'}}>{children}</label>
    <span style={{fontSize:'80%'}} className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
  </div>
);

export default StartHint;

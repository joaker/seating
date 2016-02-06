import React from 'react';
import cnames from 'classnames/dedupe';

export const InputGroup = (props = {}) => (
  <div {...props} className={cnames("input-group", props.className)}>
    {props.children}
  </div>
);

export const GroupButton = (props = {}) => (
    <span className={"input-group-btn"}>
      <button type="button" className="btn btn-secondary" {...props} >{props.children || "Click..."}</button>
    //      {props.children}
    </span>
);
export const GroupInput = (props = {}) => (
    <input type="text" placeholder="Enter text...." {...props} className={cnames("form-control", props.className)} />
);

/*
<div className="input-group">
      <span className="input-group-btn">
        <button className="btn btn-secondary" type="button">Go!</button>
      </span>
      <input type="text" className="form-control" placeholder="Search for...">
    </div>
*/

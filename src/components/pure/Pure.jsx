import React from 'react';
import cnames from 'classnames/dedupe';

import { connect } from 'react-redux';
import {List, Map} from 'immutable';
import sequal from 'shallowequal';
import PureComponent from 'react-pure-render/component';

export const purify = (Stateless) => {
  class Pure extends PureComponent {
    render() {
      return (<Stateless {...this.props}/>)
    }
  }
  return Pure;
}

export default purify;

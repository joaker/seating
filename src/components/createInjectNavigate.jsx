import React from 'react';

import { useNavigate } from "react-router-dom";

export const createInjectNavigate = (Wrapper) => (props) => {
    const navigate = useNavigate();
    return (<Wrapper navigate={navigate} {...props} />)
};

export default createInjectNavigate;


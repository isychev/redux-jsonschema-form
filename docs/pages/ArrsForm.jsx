import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { Form } from '../../index';

const ArrayForm = () => {
  console.log('was in ArrayForm');
  return (
    <Form formName={'form2'}/>
  );
};

ArrayForm.propTypes = {};
ArrayForm.defaultProps = {};

export default ArrayForm;

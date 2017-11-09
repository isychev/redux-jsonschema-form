import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { Form } from '../../index';

const SimpleForm = () => {
  console.log('was in ObjectForm');
  return (
    <Form formName={'form1'}/>
  );
};

SimpleForm.propTypes = {};
SimpleForm.defaultProps = {};

export default SimpleForm;

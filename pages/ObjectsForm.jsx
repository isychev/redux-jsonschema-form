import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { Form } from '../../index';

const ObjectForm = () => {
  console.log('was in ObjectForm');
  return (
    <Form formName={'form3'}/>
  );
};

ObjectForm.propTypes = {};
ObjectForm.defaultProps = {};

export default ObjectForm;

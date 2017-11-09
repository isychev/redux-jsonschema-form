import React from 'react';
import PropTypes from 'prop-types';

const UpDownWidget = props => {
  const { rangeSpec } = props.registry.utils;
  const BaseInput = props.registry.BaseInput;
  return <BaseInput type="number" {...props} {...rangeSpec(props.schema)} />;
};

UpDownWidget.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  registry: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UpDownWidget;

import React from 'react';
import PropTypes from 'prop-types';

const URLWidget = props => {
  const BaseInput = props.registry.BaseInput;
  return <BaseInput type="url" {...props} />;
};

URLWidget.defaultProps = {
  value: '',
};

URLWidget.propTypes = {
  value: PropTypes.string,
  registry: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default URLWidget;

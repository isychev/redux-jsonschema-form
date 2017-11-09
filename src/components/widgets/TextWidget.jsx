import React from 'react';
import PropTypes from 'prop-types';

const TextWidget = props => {
  const BaseInput = props.registry.BaseInput;
  return <BaseInput {...props} />;
};

TextWidget.defaultProps = {
  value: '',
};
TextWidget.propTypes = {
  registry: PropTypes.objectOf(PropTypes.any).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TextWidget;

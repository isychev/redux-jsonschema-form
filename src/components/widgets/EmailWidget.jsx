import React from 'react';
import PropTypes from 'prop-types';

const EmailWidget = props => {
  const BaseInput = props.registry.BaseInput;
  return <BaseInput type="email" {...props} />;
};

EmailWidget.propTypes = {
  registry: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EmailWidget;

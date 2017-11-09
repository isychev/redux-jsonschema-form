import React from 'react';
import PropTypes from 'prop-types';

function HiddenWidget({ id, value }) {
  return (
    <input
      type="hidden"
      id={id}
      value={typeof value === 'undefined' ? '' : value}
      data-qa={id}
    />
  );
}
HiddenWidget.defaultProps = {
  value: '',
};

HiddenWidget.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default HiddenWidget;

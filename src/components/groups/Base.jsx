import React from 'react';
import PropTypes from 'prop-types';
import { renderGroupChildren } from './groupServices';
/**
 * base group (not used)
 * @param children {ReactComponent} component children
 * @constructor
 */
const BaseGroup = ({ groups, uiGroup, SchemaField, arrProps }) => (
  <div data-qa="BaseGroup">
    {renderGroupChildren({
      groups,
      uiGroup,
      SchemaField,
      arrProps,
    })}
  </div>
);

BaseGroup.propTypes = {
  uiGroup: PropTypes.objectOf(PropTypes.any),
  SchemaField: PropTypes.func,
  arrProps: PropTypes.arrayOf(PropTypes.any),
  groups: PropTypes.objectOf(PropTypes.any),
};
BaseGroup.defaultProps = {
  uiGroup: {},
  SchemaField: null,
  arrProps: [],
  groups: {},
};

export default BaseGroup;

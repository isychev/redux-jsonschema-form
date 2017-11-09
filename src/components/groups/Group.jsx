import React from 'react';
import PropTypes from 'prop-types';
import { renderGroupChildren } from './groupServices';

const trans = f => f;
/**
 * base component for FieldGroup and GroupField components
 * @param groups       {array}   array with all groups components
 * @param uiGroup      {object}  object of group
 * @param SchemaField  {object}  base component of row
 * @param arrProps     {array}   array with all props of all fields
 * @param isLastGroup  {bool}    flag last group
 * @return {XML}
 * @constructor
 */
const Group = ({ groups, uiGroup, SchemaField, arrProps, isLastGroup }) => (
  <div className={`form-group-wrap ${!isLastGroup ? 'border-b' : ''}`}>
    {uiGroup.title ? (
      <div
        className={`row my-4 ${(((arrProps[0] || {}).registry || {})
          .formContext || {}
        ).paddingClassName}`}
      >
        <div className="col">
          <h5>{trans(uiGroup.title)}</h5>
          {uiGroup.help ? (
            <p className="text-muted">{trans(uiGroup.help)}</p>
          ) : null}
        </div>
      </div>
    ) : null}
    {renderGroupChildren({
      groups,
      uiGroup,
      SchemaField,
      arrProps,
    })}
  </div>
);

Group.defaultProps = {
  uiGroup: {},
  SchemaField: null,
  arrProps: [],
  groups: {},
  isLastGroup: false,
};

Group.propTypes = {
  uiGroup: PropTypes.objectOf(PropTypes.any),
  SchemaField: PropTypes.func,
  arrProps: PropTypes.arrayOf(PropTypes.any),
  groups: PropTypes.objectOf(PropTypes.any),
  isLastGroup: PropTypes.bool,
};

export default Group;

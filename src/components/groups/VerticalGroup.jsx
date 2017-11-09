import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { renderGroupChildren, getRenderFields } from './groupServices';

/**
 * render fields in vertical row
 * @param groups       {object}  object with all groups components
 * @param uiGroup      {object}  object of group
 * @param SchemaField  {object}  base component of row
 * @param arrProps     {array}   array with all props of all fields
 * @return {XML}
 * @constructor
 */

const VerticalGroup = ({ arrProps, groups, SchemaField, uiGroup }) => {
  let classNames = '';
  let elemProps = getRenderFields(uiGroup.fields || [], arrProps);
  if (elemProps.some(el => el.errorSchema)) {
    classNames += ' field-error has-error has-danger';
  }

  elemProps = elemProps.map(propsElem => ({
    ...propsElem,
    uiSchema: {
      ...propsElem.uiSchema,
      'ui:options': {
        ...propsElem.uiSchema['ui:options'],
        label: false,
      },
    },
  }));
  const FieldTemplate = get(elemProps, [0, 'registry', 'FieldTemplate'], null);
  const required = elemProps.some(el => el.required);
  const rawHelp = get(elemProps, [0, 'uiSchema', 'ui:help'], null);
  const id = get(elemProps, [0, 'idSchema', '$id'], null);
  if (!elemProps.length) {
    return null;
  }
  return (
    <FieldTemplates
      id={id}
      rawHelp={rawHelp}
      required={required}
      displayLabel
      label={uiGroup.title || get(elemProps, [0, 'schema', 'title'])}
      classNames={classNames}
    >
      <div>
        {renderGroupChildren({
          groups,
          uiGroup,
          SchemaField,
          arrProps: elemProps,
        })}
      </div>
    </FieldTemplates>
  );
};

VerticalGroup.defaultProps = {
  arrProps: [],
  groups: {},
  SchemaField: null,
  uiGroup: {},
};

VerticalGroup.propTypes = {
  arrProps: PropTypes.arrayOf(PropTypes.any),
  groups: PropTypes.objectOf(PropTypes.any),
  uiGroup: PropTypes.objectOf(PropTypes.any),
  SchemaField: PropTypes.oneOfType([PropTypes.any]),
};

export default VerticalGroup;

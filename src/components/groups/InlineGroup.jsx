import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { getRenderFields } from './groupServices';

/**
 * render fields in inline row
 * @param groups       {array}   array with all groups components
 * @param uiGroup      {object}  object of group
 * @param SchemaField  {object}  base component of row
 * @param arrProps     {array}   array with all props of all fields
 * @return {XML}
 * @constructor
 */
const InlineGroup = ({ arrProps, SchemaField, uiGroup }) => {
  const elemProps = getRenderFields(uiGroup.fields || [], arrProps);
  if (!SchemaField || !elemProps.length) {
    return null;
  }
  let classNames = '';
  if (elemProps.some(el => el.errorSchema)) {
    classNames += ' field-error has-error has-danger';
  }
  // cals grid class
  const gridSize = Math.floor(12 / elemProps.length);
  const formContext = get(arrProps, [0, 'registry', 'formContext'], {});
  const rawHelp = uiGroup.help;
  const required = elemProps.some(({ fieldRequired }) => fieldRequired);
  const FieldTemplate = get(elemProps, [0, 'registry', 'FieldTemplate'], null);
  return (
    <FieldTemplate
      displayLabel
      label={uiGroup.title || get(elemProps, [0, 'schema', 'title'], '')}
      classNames={classNames}
      formContext={formContext}
      rawHelp={rawHelp}
      required={required}
    >
      <div className="row">
        {elemProps.map((elem, ind) => (
          <div
            className={`col-lg-${gridSize} mb-2 mb-lg-0`}
            key={`InlineGroup${uiGroup.title}${ind + 1}`}
          >
            <SchemaField
              {...elem}
              uiSchema={{
                ...get(elem, 'uiSchema', {}),
                'ui:options': {
                  label: false,
                },
                classNames: `${get(elem, 'uiSchema.classNames', '')}`,
              }}
            />
          </div>
        ))}
      </div>
    </FieldTemplate>
  );
};

InlineGroup.defaultProps = {
  arrProps: [],
  SchemaField: null,
  uiGroup: {},
};

InlineGroup.propTypes = {
  arrProps: PropTypes.arrayOf(PropTypes.any),
  uiGroup: PropTypes.objectOf(PropTypes.any),
  SchemaField: PropTypes.func,
};

export default InlineGroup;

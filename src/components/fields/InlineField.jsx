import React from 'react';
import PropTypes from 'prop-types';
import ObjectField from './ObjectField';

/**
 * render inline object (all widget in inline row)
 * @param props {object} component props
 * @return {XML}
 * @constructor
 */
const InlineField = props => {
  const newUiSchema = {
    ...props.uiSchema,
    'ui:group': {
      name: 'inline',
      type: 'inline',
      fields: Object.keys(props.schema.properties),
      order: Object.keys(props.schema.properties),
      groups: [],
    },
  };
  return <ObjectField {...props} uiSchema={newUiSchema} />;
};

InlineField.propTypes = {
  uiSchema: PropTypes.objectOf(PropTypes.any).isRequired,
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default InlineField;

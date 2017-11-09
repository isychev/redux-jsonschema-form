import React from 'react';
import PropTypes from 'prop-types';

/**
 *  render fields as "widget" field
 * @param schema      {object} jsonschema
 * @param uiSchema    {object} uiSchema
 * @param idSchema    {object} object with map id of fields
 * @param formData    {object} form daa
 * @param required    {bool} flag required form
 * @param disabled    {bool} flag disabled form
 * @param readonly    {bool} flag readonly form
 * @param autofocus   {bool} flag autofocus form
 * @param onChange    {func} action change field
 * @param onBlur      {func} action blur field
 * @param registry    {object} object with widgets, fields, groups and etc
 * @return {XML}
 * @constructor
 */
const WidgetField = ({
  schema,
  uiSchema,
  idSchema,
  formData,
  required,
  disabled,
  readonly,
  autofocus,
  onChange,
  onBlur,
  registry,
}) => {
  const { getUiOptions, optionsList } = registry.utils;
  const { title } = schema;
  const { widgets, formContext } = registry;
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);
  const { placeholder = '', ...options } = getUiOptions(uiSchema);
  const Widget = widgets[uiSchema['ui:widget']];
  // if cant find widget throw exception
  if (!Widget) {
    throw new SyntaxError(`Incorect widget: ${uiSchema['ui:widget']}`);
  }
  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      id={idSchema && idSchema.$id}
      label={title}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      placeholder={placeholder}
    />
  );
};

WidgetField.defaultProps = {
  uiSchema: {},
  registry: {},
  idSchema: {},
  formData: undefined,
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
  onBlur: f => f,
};

WidgetField.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  uiSchema: PropTypes.objectOf(PropTypes.any),
  idSchema: PropTypes.objectOf(PropTypes.any),
  formData: PropTypes.oneOfType([PropTypes.any]),
  registry: PropTypes.objectOf(PropTypes.any),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

export default WidgetField;

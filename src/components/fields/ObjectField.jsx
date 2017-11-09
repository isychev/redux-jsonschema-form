import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import ObjectFieldFormSchema from 'react-jsonschema-form/lib/components/fields/ObjectField';
import get from 'lodash/get';

class ObjectField extends Component {
  static defaultProps = {
    uiSchema: {},
    formData: {},
    errorSchema: {},
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
  };

  isRequired(name) {
    const schema = this.props.schema;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  orderProperties(properties, order) {
    if (!Array.isArray(order)) {
      return properties;
    }

    const arrayToHash = arr =>
      arr.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
      }, {});
    const errorPropList = arr =>
      arr.length > 1
        ? `properties '${arr.join("', '")}'`
        : `property '${arr[0]}'`;
    const propertyHash = arrayToHash(properties);
    const orderHash = arrayToHash(order);
    const extraneous = order.filter(
      prop => prop !== '*' && !propertyHash[prop],
    );
    if (extraneous.length) {
      throw new Error(
        `uiSchema order list contains extraneous ${errorPropList(extraneous)}`,
      );
    }
    const rest = properties.filter(prop => !orderHash[prop]);
    const restIndex = order.indexOf('*');
    if (restIndex === -1) {
      if (rest.length) {
        throw new Error(
          `uiSchema order list does not contain ${errorPropList(rest)}`,
        );
      }
      return order;
    }
    if (restIndex !== order.lastIndexOf('*')) {
      throw new Error(
        'uiSchema order list contains more than one wildcard item',
      );
    }

    const complete = [...order];
    complete.splice(restIndex, 1, ...rest);
    return complete;
  }
  /**
   * render objet
   * @param SchemaField {object}  base component for rendering
   * @param arrProps    {array}   array with all properies object for rending
   * @param uiSchema    {object}  uiSchema
   * @return {Array}
   */
  renderSchema = (SchemaField, arrProps, uiSchema) => {
    const uiGroupKey = 'ui:group';
    // if has group recursive render groups
    if (uiSchema[uiGroupKey]) {
      const uiGroup = uiSchema[uiGroupKey];
      const { groups } = this.props.registry;
      // get correct group
      const GroupComponent = groups[uiGroup.type];
      if (!GroupComponent) {
        throw new SyntaxError(`Incorect group: ${uiGroup.type}`);
      }
      return (
        <GroupComponent
          groups={groups}
          uiGroup={uiGroup}
          SchemaField={SchemaField}
          arrProps={arrProps}
        />
      );
    }
    return arrProps.map(props => <SchemaField {...props} />);
  };
  /**
   * generate function event change By fieldName
   * @param name {string} field name
   * @return function
   */
  onPropertyChange = fieldName => (value, options = {}) => {
    const reload =
      get(this.props, ['uiSchema', fieldName, 'ui:options', 'reload'], false) ||
      options.reload;
    const newFieldName = [fieldName, ...(options.fieldName || '').split('.')]
      .filter(Boolean)
      .join('.');
    const newFormData = { ...this.props.formData, [fieldName]: value };
    this.props.onChange(newFormData, {
      ...options,
      fieldName: newFieldName,
      reload,
    });
  };
  filterIgnoreFields = (fields, ignoreList = []) => {
    if (!ignoreList.length) {
      return fields;
    }
    return fields.filter(fieldName => !ignoreList.includes(fieldName));
  };
  render() {
    const {
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      disabled,
      readonly,
      required,
      onBlur,
      registry,
    } = this.props;
    const { retrieveSchema } = registry.utils;
    const { definitions, fields, formContext } = this.props.registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);
    const title = schema.title === undefined ? name : schema.title;
    // order properies
    let orderedProperties;
    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = this.orderProperties(
        properties,
        uiSchema['ui:order'],
      );
      orderedProperties = this.filterIgnoreFields(
        orderedProperties,
        uiSchema['ui:ignoreFields'],
      );
    } catch (err) {
      return (
        <div>
          <p className="config-error" style={{ color: 'red' }}>
            Invalid {name || 'root'} object field configuration:
            <em>{err.message}</em>.
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }
    const hasGroup = uiSchema['ui:group'];
    return (
      <div>
        {!hasGroup &&
          (uiSchema['ui:title'] || title) && (
            <TitleField
              id={`${idSchema.$id}__title`}
              title={uiSchema['ui:title'] || title}
              required={required}
              formContext={formContext}
            />
          )}
        {!hasGroup &&
          (uiSchema['ui:description'] || schema.description) && (
            <DescriptionField
              id={`${idSchema.$id}__description`}
              description={uiSchema['ui:description'] || schema.description}
              formContext={formContext}
            />
          )}
        {this.renderSchema(
          SchemaField,
          orderedProperties.map((propName, index) => ({
            key: index,
            name: propName,
            required: this.isRequired(propName),
            schema: schema.properties[propName],
            uiSchema: uiSchema[propName],
            errorSchema: errorSchema[propName],
            idSchema: idSchema[propName],
            formData: formData[propName],
            onChange: this.onPropertyChange(propName),
            onBlur,
            registry: this.props.registry,
            disabled,
            readonly,
          })),
          uiSchema,
        )}
      </div>
    );
  }
}

ObjectField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};

export default ObjectField;

import React, { Component } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import PropTypes from 'prop-types';

export default class extends Component {
  static propTypes = {
    arrProps: PropTypes.arrayOf(PropTypes.any),
    groups: PropTypes.objectOf(PropTypes.any),
    uiGroup: PropTypes.objectOf(PropTypes.any),
    SchemaField: PropTypes.oneOfType([PropTypes.any]),
  };
  static defaultProps = {
    arrProps: [],
    groups: {},
    SchemaField: null,
    uiGroup: {},
  };
  state = {
    trigger: false,
  };
  getSchemaObj = () =>
    this.props.arrProps.reduce(
      (result, el) => ({ ...result, [el.name]: el }),
      {},
    );
  getSchemaField = (schemaObj, fieldPath) => {
    const fullPath = fieldPath.split('.').join('.schema.properties.');
    return get(schemaObj, fullPath, false);
  };
  getUiSchemaField = (schemaObj, fieldPath) => {
    const pathArr = fieldPath.split('.');
    const firstField = pathArr.shift();
    const uiSchemaPath = [firstField, 'uiSchema', ...pathArr];
    return get(schemaObj, uiSchemaPath);
  };
  getFormDataField = (schemaObj, fieldPath) => {
    const pathArr = fieldPath.split('.');
    const firstField = pathArr.shift();
    const formDataPath = [firstField, 'formData', ...pathArr];
    return get(schemaObj, formDataPath);
  };
  getErrorsField = (schemaObj, fieldPath) => {
    const pathArr = fieldPath.split('.');
    const firstField = pathArr.shift();
    const fieldProps = schemaObj[firstField];
    return get(fieldProps, ['errorSchema', ...pathArr]);
  };
  getOtherPropsField = (schemaObj, fieldPath) => {
    const pathArr = fieldPath.split('.');
    const firstField = pathArr.shift();
    const fieldProps = schemaObj[firstField];
    const { registry } = fieldProps;
    return { registry };
  };
  getRequiredField = (schemaObj, fieldPath) => {
    const pathArr = fieldPath.split('.');
    const lastField = pathArr.pop();
    const schema = this.getSchemaField(schemaObj, pathArr.join('.'));
    return get(schema, 'schema.required', []).includes(lastField);
  };
  handleChange = ({ value, options, schemaObj, fieldPath }) => {
    const pathArr = fieldPath.split('.');
    const firstField = pathArr.shift();
    const fieldProps = schemaObj[firstField];
    const { formData, onChange } = fieldProps;
    onChange(
      { ...set(formData, pathArr, value) },
      { ...options, fieldName: pathArr[pathArr.length - 1] },
    );
    this.setState({
      trigger: !this.state.trigger,
    });
  };
  renderField = fieldPath => {
    const { SchemaField } = this.props;
    const schemaObj = this.getSchemaObj();

    const fieldSchema = this.getSchemaField(schemaObj, fieldPath);
    if (!fieldSchema) {
      return null;
    }
    const fieldUiSchema = this.getUiSchemaField(schemaObj, fieldPath);
    const fieldFormData = this.getFormDataField(schemaObj, fieldPath);
    const fieldErrorSchema = this.getErrorsField(schemaObj, fieldPath);
    const fieldRequired = this.getRequiredField(schemaObj, fieldPath);
    const otherProps = this.getOtherPropsField(schemaObj, fieldPath);
    return (
      <SchemaField
        {...otherProps}
        key={`virtualFields${fieldPath}`}
        schema={fieldSchema}
        uiSchema={fieldUiSchema}
        errorSchema={fieldErrorSchema}
        formData={fieldFormData}
        required={fieldRequired}
        onChange={(value, options) =>
          this.handleChange({ value, options, schemaObj, fieldPath })}
      />
    );
  };
  render() {
    const { uiGroup } = this.props;
    const { fields } = uiGroup;
    return <div>{fields.map(this.renderField)}</div>;
  }
}

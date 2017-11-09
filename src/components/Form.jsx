import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  onChange as actionOnChange,
  onSubmit as actionOnSubmit,
  onInit as actionOnInit,
  onReset as actionOnReset,
} from '_actions/form';

import DefaultErrorList from './ErrorList';
import DefaultWidgets from './widgets';
import DefaultFields from './fields';
import DefaultGroups from './groups';
import * as utils from './utils/utils';
import DefaultFieldTemplate from './FieldTemplate';
import BaseInput from './widgets/BaseInput';

const widgetMap = {
  boolean: {
    checkbox: 'CheckboxWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    hidden: 'HiddenWidget',
  },
  string: {
    text: 'TextWidget',
    password: 'PasswordWidget',
    email: 'EmailWidget',
    hostname: 'TextWidget',
    ipv4: 'TextWidget',
    ipv6: 'TextWidget',
    uri: 'URLWidget',
    'data-url': 'FileWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    textarea: 'TextareaWidget',
    hidden: 'HiddenWidget',
    date: 'DateWidget',
    datetime: 'DateTimeWidget',
    'date-time': 'DateTimeWidget',
    'alt-date': 'AltDateWidget',
    'alt-datetime': 'AltDateTimeWidget',
    color: 'ColorWidget',
    file: 'FileWidget',
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget',
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget',
  },
  array: {
    select: 'SelectWidget',
    checkboxes: 'CheckboxesWidget',
    files: 'FileWidget',
  },
};

class Form extends Component {
  /**
   * onInit - event for init form (add additional field (pristine fields, flags  and etc ))
   */
  componentWillMount() {
    if (Object.keys(this.props.schema).length && this.props.onInit) {
      this.props.onInit({ formName: this.props.formName });
    }
  }

  /**
   * onInit event for init form (add additional field (pristine fields, flags  and etc ))
   * onAfterInit  event after init action
   * @param newProps {object} object with new props
   */
  componentWillReceiveProps(newProps) {
    if (
      Object.keys(newProps.schema).length &&
      !newProps.isReady &&
      this.props.onInit
    ) {
      this.props.onInit({ formName: this.props.formName });
    }
  }

  /**
   * action submit form (not used) ,set additional props for event
   * @param e {event} event object
   */
  onSubmit = e => {
    e.preventDefault();
    const { formName, onSubmit } = this.props;
    onSubmit({ formName });
  };
  /**
   * action change form, set additional props for event
   * @param data    {object} object with formData
   * @param options {object} object with options {fieldName}
   */
  onChange = (data, options) => {
    this.props.onChange({
      data,
      options,
      formName: this.props.formName,
    });
  };

  getRegistry() {
    return {
      fields: { ...DefaultFields, ...this.props.fields },
      groups: { ...DefaultGroups, ...this.props.groups },
      BaseInput: this.props.BaseInput,
      widgets: {
        ...DefaultWidgets,
        widgetMap: this.props.widgetMap,
        ...this.props.widgets,
      },
      ArrayFieldTemplate: this.props.ArrayFieldTemplate,
      FieldTemplate: this.props.FieldTemplate,
      definitions: this.props.schema.definitions || {},
      formContext: this.props.formContext || {},
      utils,
    };
  }

  render() {
    const {
      formProps,
      children,
      id,
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      onSubmit,
      paddingClassName,
      adaptiveClassName,
      formName,
    } = this.props;
    // get registry (object contains widgets, fields, groups and etc   )
    const registry = this.getRegistry();
    // get SchemaField -get component of single row of form
    const SchemaFieldCustom = registry.fields.SchemaField;
    let className = this.props.className || '';
    // if uiSchema['ui:disabled']  - disabled form
    if (uiSchema && uiSchema['ui:disabled']) {
      className += ' form-disabled';
    }
    const mergeFormProps = { ...formProps, onSubmit, className, id };
    return (
      <form {...mergeFormProps}>
        <SchemaFieldCustom
          schema={schema}
          uiSchema={uiSchema}
          errorSchema={errorSchema}
          idSchema={idSchema}
          formData={formData}
          onChange={this.onChange}
          onBlur={this.onBlur}
          registry={{
            ...registry,
            // groups: DefaultGroups,
            formContext: {
              formData,
              formName,
              paddingClassName,
              adaptiveClassName,
              ...registry.formContext,
            },
          }}
        />
        {children || null}
      </form>
    );
  }
}

Form.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  formName: PropTypes.string.isRequired,
  id: PropTypes.string,
  paddingClassName: PropTypes.string,
  adaptiveClassName: PropTypes.string,
  className: PropTypes.string,
  uiSchema: PropTypes.objectOf(PropTypes.any),
  formData: PropTypes.objectOf(PropTypes.any),
  widgetMap: PropTypes.objectOf(PropTypes.any),
  widgets: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  ),
  fields: PropTypes.objectOf(PropTypes.func),
  ArrayFieldTemplate: PropTypes.func,
  FieldTemplate: PropTypes.func,
  ErrorList: PropTypes.func,
  BaseInput: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  onInit: PropTypes.func,
  formProps: PropTypes.objectOf(PropTypes.any),
  errorSchema: PropTypes.objectOf(PropTypes.any),
  idSchema: PropTypes.objectOf(PropTypes.any),
  formContext: PropTypes.objectOf(PropTypes.any),
  isReady: PropTypes.bool,
  children: PropTypes.node,
};
Form.defaultProps = {
  id: '',
  paddingClassName: '',
  adaptiveClassName: '',
  className: '',
  uiSchema: {},
  formData: {},
  widgets: {},
  fields: {},
  formProps: {},
  formContext: {},
  errorSchema: {},
  idSchema: {},
  widgetMap,
  ArrayFieldTemplate: null,
  BaseInput,
  onChange: null,
  onSubmit: null,
  onReset: null,
  onInit: null,
  children: null,
  isReady: false,
  FieldTemplate: DefaultFieldTemplate,
  ErrorList: DefaultErrorList,
};

export { Form };

export default connect(
  (state, { formName }) => ({
    ...state.forms[formName],
  }),
  {
    onChange: actionOnChange,
    onInit: actionOnInit,
    onSubmit: actionOnSubmit,
    onReset: actionOnReset,
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onChange: ownProps.onCustomChange
      ? originParams =>
          ownProps.onCustomChange({
            stateProps,
            dispatchProps,
            ownProps,
            originParams,
          })
      : dispatchProps.onChange,
    onInit: ownProps.onCustomInit
      ? originParams =>
          ownProps.onCustomInit({
            stateProps,
            dispatchProps,
            ownProps,
            originParams,
          })
      : dispatchProps.onInit,

    onAfterInit: ownProps.onCustomAfterInit
      ? originParams =>
          ownProps.onCustomAfterInit({
            stateProps,
            dispatchProps,
            ownProps,
            originParams,
          })
      : f => f,
  }),
)(Form);

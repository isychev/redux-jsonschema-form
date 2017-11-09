import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const trans = f => f;

const REQUIRED_FIELD_SYMBOL = '*';

/**
 *  render field Label
 * @param label      {string}  field label
 * @param required   {bool}    flag of required
 * @param id         {string}  field id
 * @param help       {string}  field description (? icon)
 * @param formName   {string}  formName
 * @return {ReactComponent}
 * @constructor
 */
const Label = ({ label, required, id, help, formName, hasError }) => (
  <label
    className={cn({
      'col-md-4 col-form-label d-flex align-items-top pt-2 form-default-template-label': true,
      'text-danger': hasError,
    })}
    id={`label_${id}`}
    htmlFor={id}
    data-qa={`BaseLabel${id}`}
  >
    <span>
      {`${trans(label)} `}
      {required ? (
        <span
          className="text-danger font-weight-bold"
          data-qa={`BaseLabel${id}Required`}
        >
          {REQUIRED_FIELD_SYMBOL}
        </span>
      ) : (
        ''
      )}
    </span>
  </label>
);

Label.defaultProps = {
  label: '',
  formName: '',
  required: false,
  id: '',
  help: '',
  hasError: false,
};

Label.propTypes = {
  label: PropTypes.string,
  formName: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string,
  help: PropTypes.string,
  hasError: PropTypes.bool,
};
/**
 *
 * @param id           {string}          field id
 * @param classNames   {string}          additional className
 * @param label        {string}          field label
 * @param children     {ReactComponent}  children component
 * @param rawErrors    {array}           array with errors
 * @param rawHelp      {string}          field description
 * @param hidden       {bool}            flag of hidden
 * @param required     {bool}            flag of required
 * @param uiSchema     {object}          uiSchema
 * @param formContext  {object}          global object for form
 * @return {XML}
 * @constructor
 */
const FieldTemplate = ({
  id,
  classNames,
  label,
  children,
  rawErrors,
  rawHelp,
  hidden,
  required,
  displayLabel,
  formContext,
}) => {
  // markup errors (if exist)
  const errors = rawErrors.length ? (
    <div className="form-errors-list" data-qa={`ErrorsList${id}`}>
      <ul>
        {rawErrors.map(({ template, parameters = {} }, ind) => (
          <li key={`erritem${ind + 1}`} data-qa={`ErrorsList${id}Item`}>
            {trans(template, parameters)}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
  // render only widget if hidden or empty label
  if (hidden || !label || displayLabel === false) {
    return (
      <div
        className={cn({
          'form-default-template-widget form-default-widget-empty': true,
          'has-error': rawErrors.length,
        })}
        data-qa={`DefaultTemplate${id}`}
      >
        {children}
        {errors}
      </div>
    );
  }

  return (
    <div
      className={cn({
        'row no-gutters': formContext.adaptiveClassName,
      })}
    >
      <div
        className={cn([
          formContext.adaptiveClassName,
          formContext.paddingClassName,
        ])}
      >
        <div
          className={cn({
            'row form-group form-default-template': true,
            [classNames]: true,
          })}
        >
          <Label
            formName={formContext.formName}
            label={label}
            required={required}
            help={rawHelp}
            id={id}
            hasError={rawErrors.length > 0}
          />
          <div
            className={cn({
              'col-md-8 px-2 form-default-template-widget': true,
              'has-error': rawErrors.length,
            })}
            data-qa={`DefaultTemplate${id}`}
          >
            {children}
            {errors}
          </div>
        </div>
      </div>
    </div>
  );
};

FieldTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
  id: '',
  classNames: '',
  label: '',
  rawErrors: [],
  rawHelp: '',
  uiSchema: {},
  formContext: {},
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  rawErrors: PropTypes.arrayOf(PropTypes.any),
  rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  hidden: PropTypes.bool,
  required: PropTypes.bool,
  uiSchema: PropTypes.objectOf(PropTypes.any),
  formContext: PropTypes.objectOf(PropTypes.any),
};

export default FieldTemplate;

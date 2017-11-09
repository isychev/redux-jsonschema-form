import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * component for rendering textarea in form
 * @param id           {string}     field id
 * @param placeholder  {string}     input placeholder
 * @param value        {string}     input value
 * @param required     {bool}       flag required textarea
 * @param disabled     {bool}       flag disabled textarea
 * @param readonly     {bool}       flag readonly textarea
 * @param onChange     {func}       action change textarea
 * @param options      {object}     object with otions for textarea
 */

class TextareaWidget extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number,
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    placeholder: '',
    options: {},
    value: '',
    required: false,
    disabled: false,
    readonly: false,
  };
  /**
   * set default state
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }
  /**
   * copy value from props to state
   * @param nextProps
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  render() {
    const {
      id,
      options,
      placeholder,
      required,
      disabled,
      readonly,
      onChange,
    } = this.props;
    return (
      <textarea
        id={id}
        className="form-control"
        value={this.state.value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        rows={options.rows}
        onChange={e =>
          this.setState({
            value: e.target.value === '' ? options.emptyValue : e.target.value,
          })}
        onBlur={() => {
          onChange(this.state.value);
        }}
        data-qa={id}
      />
    );
  }
}

export default TextareaWidget;

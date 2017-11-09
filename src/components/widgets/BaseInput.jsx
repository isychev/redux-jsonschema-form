import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

const trans = f => f;

/**
 * component for rendering input in form
 * @param id           {string}     field id
 * @param placeholder  {string}     input placeholder
 * @param value        {string}     input value
 * @param required     {bool}       flag required input
 * @param disabled     {bool}       flag disabled input
 * @param readonly     {bool}       flag readonly input
 * @param onChange     {func}       action change input
 * @param options      {object}     object with otions for input
 */

class BaseInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.node,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.objectOf(PropTypes.any),
  };
  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
    readonly: false,
    id: '',
    placeholder: '',
    value: '',
    options: {},
    onChange: f => f,
  };

  /**
   * set default state
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
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
      readonly,
      options,
      onChange,
      placeholder,
      ...inputProps
    } = this.props;
    const styles = {};
    // small block in left part input (left placeholder)
    if (options.inputGroupAddon) {
      const inputGroupAddonText = trans(options.inputGroupAddon);
      const basePadding = inputGroupAddonText.length * 11;
      const additPadding = inputGroupAddonText.length < 4 ? 11 : 0;
      styles.paddingLeft = basePadding + additPadding;
      styles.paddingRight = 0;
      styles.minWidth = styles.paddingLeft + 50;
    }

    const inputComponent = (
      <input
        {...omit(inputProps, [
          'schema',
          'formContext',
          'registry',
          'autofocus',
        ])}
        style={styles}
        className="form-control"
        readOnly={readonly}
        placeholder={trans(placeholder)}
        value={this.state.value}
        onChange={e =>
          this.setState({
            value: e.target.value === '' ? options.emptyValue : e.target.value,
          })}
        onBlur={() => {
          onChange(this.state.value);
        }}
        data-qa={inputProps.id}
      />
    );

    if (options.inputGroupAddon) {
      return (
        <div style={{ position: 'relative' }}>
          <span
            className="input-group-addon-placeholder text-muted"
            style={{
              top: '10px',
              zIndex: 99,
              position: 'absolute',
              left: '10px',
            }}
          >
            {trans(options.inputGroupAddon)}
          </span>
          {inputComponent}
        </div>
      );
    }
    return inputComponent;
  }
}

export default BaseInput;

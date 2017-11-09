import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onSubmit as actionOnSubmit } from '_actions/form';

class SubmitButton extends Component {
  static propTypes = {
    title: PropTypes.node,
    formName: PropTypes.string.isRequired,
    status: PropTypes.string,
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    notification: PropTypes.objectOf(PropTypes.any),
    payload: PropTypes.objectOf(PropTypes.any),
  };
  static defaultProps = {
    title: 'site.save',
    status: '',
    notification: {
      success: {
        text: 'site.formSubmitSuccess',
        type: 'success',
      },
      error: {
        text: 'site.formSubmitError',
        type: 'danger',
      },
    },
    payload: {},
    className: 'btn btn-primary',
  };

  render() {
    const {
      onSubmit,
      formName,
      title,
      notification,
      className,
      payload,
    } = this.props;
    return (
      <button
        type="submit"
        className={className}
        onClick={e => {
          e.preventDefault();
          onSubmit({
            formName,
            payload: {
              notification,
              ...payload,
            },
          });
        }}
        data-qa="SubmitButton"
      >
        {title}
      </button>
    );
  }
}
export { SubmitButton };

export default connect(
  (state, { formName }) => ({
    ...state.forms[formName],
  }),
  {
    onSubmit: actionOnSubmit,
  },
)(SubmitButton);

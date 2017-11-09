import {
  RJSF_CHANGE_FORM_DATA,
  RJSF_SUBMIT,
  RJSF_VALIDATE,
  RJSF_SUBMIT_START,
  RJSF_SUBMIT_ERROR,
  RJSF_VALIDATE_ERROR,
  RJSF_VALIDATE_SUCCESS

} from '_constants/form';

const submitMiddleware = store => dispatch => action => {
  if (action.type === RJSF_SUBMIT && !action.isSuccessValidate) {
    dispatch({
      ...action,
      type: RJSF_SUBMIT_START,
    });
    store.dispatch({
      type: RJSF_VALIDATE,
      formName: action.formName,
      isSubmit: true,
    });
    const newState = store.getState();
    const formState = newState.forms[action.formName];
    if (formState && !Object.keys(formState.errorSchema).length) {
      store.dispatch({
        ...action,
        isSuccessValidate: true,
      });
    }
  } else {
    dispatch(action);
  }
  return null;
};
const changeMiddleware = store => dispatch => action => {
  dispatch(action);
  if (
    action.type === RJSF_CHANGE_FORM_DATA &&
    (action.options || {}).validate !== false
  ) {
    store.dispatch({
      type: RJSF_VALIDATE,
      formName: action.formName,
    });
  }
  return null;
};

const validateMIddleware = store => dispatch => action => {
  dispatch(action);
  if (action.type === RJSF_VALIDATE) {
    const newState = store.getState();
    const formState = newState.forms[action.formName];
    if (formState && !Object.keys(formState.errorSchema).length) {
      return store.dispatch({
        ...action,
        type: RJSF_VALIDATE_SUCCESS,
      });
    }
    return store.dispatch({
      ...action,
      type: RJSF_VALIDATE_ERROR,
    });
  }
  return null;
};

export { submitMiddleware, changeMiddleware, validateMIddleware };

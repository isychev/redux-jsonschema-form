import {
  RJSF_CHANGE_FORM_DATA,
  RJSF_SUBMIT,
  RJSF_SUBMIT_ERROR,
  RJSF_SUBMIT_REQUEST,
  RJSF_SUBMIT_START,
  RJSF_SUBMIT_SUCCESS,
  RJSF_INIT,
  RJSF_RESET,
  RJSF_UPDATE_FORM,
  RJSF_VALIDATE,
  RJSF_ADD_FORM,
} from '_constants/form';

import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

import {
  validate,
  getStateFromProps,
  getFilterError,
  removeEmptyValue,
  appendDirtyField,
} from '_services/form';

const initForm = (state, action) => {
  const { payload: { formName } } = action;
  if (!state[formName] || state[formName].isReady) {
    return state;
  }
  return {
    ...state,
    [formName]: getStateFromProps(state[formName]),
  };
};
const addForm = (state, action) => {
  const { payload: { formName, form } } = action;
  return {
    ...state,
    [formName]: form,
  };
};
const initReduxForm = state => {
  const initsForm = Object.keys(state).reduce((result, formName) => {
    const curForm = state[formName];
    if (!curForm.isReady) {
      return {
        ...result,
        [formName]: getStateFromProps(state[formName]),
      };
    }
    return result;
  }, {});

  return {
    ...state,
    ...initsForm,
  };
};

const validateForm = (state, action) => {
  const { payload: { formName, isSubmit } } = action;
  const formState = state[formName];
  if (!formState) {
    return state;
  }
  const { formData } = formState;
  const isSubmitForm = formState.isSubmit || isSubmit;

  const validateResult = validate(formData, formState.schema);
  const newClientErrorSchema = isSubmitForm
    ? validateResult
    : getFilterError(validateResult, formState.dirtyFields);

  const resultErrors = {
    ...newClientErrorSchema,
  };
  return {
    ...state,
    [formName]: {
      ...formState,
      isSubmit: isSubmitForm,
      errorSchema: resultErrors,
      status: Object.keys(resultErrors).length ? 'error' : formState.status,
    },
  };
};

const changeFormData = (state, action) => {
  const { payload: { formName, data, options } } = action;
  const formState = state[formName];
  const newState = {
    ...state,
    [formName]: {
      ...formState,
      status: 'edit',
      formData: getDefaultFormState(
        formState.schema,
        removeEmptyValue(data),
        formState.schema.definitions,
      ),

      dirtyFields: appendDirtyField(formState.dirtyFields, options.fieldName),
    },
  };

  return newState;
};

const startSubmit = (state, action) => {
  const { payload: { formName } } = action;
  const formState = state[formName];
  return {
    ...state,
    [formName]: {
      ...formState,
      successResponse: {},
      errorSchema: {},
      isSubmit: true,
      status: 'startSubmit',
    },
  };
};

const successSubmit = (state, action) => {
  const { payload: { formName, response } } = action;
  const formState = state[formName];
  return {
    ...state,
    [formName]: {
      ...formState,
      origin: {
        ...formState.origin,
        formData: formState.formData,
      },
      successResponse: response,
      errorSchema: {},
      status: 'successSubmit',
    },
  };
};
const failSubmit = (state, action) => {
  const { payload: { formName } } = action;
  const formState = state[formName];
  return {
    ...state,
    [formName]: {
      ...formState,
      successResponse: {},
      status: 'errorSubmit',
    },
  };
};
const resetForm = (state, action) => {
  const { payload: { formName } } = action;
  const formState = state[formName] || {};
  return {
    ...state,
    [formName]: {
      ...formState,
      ...(formState.origin || {}),
    },
  };
};
const updateForm = (state, action) => {
  const { payload: { formName, form = {} } } = action;
  const formState = state[formName] || {};
  return {
    ...state,
    [formName]: {
      ...formState,
      ...form,
    },
  };
};

const reducerMethods = {
  '@@INIT': initReduxForm,
  [RJSF_INIT]: initForm,
  [RJSF_ADD_FORM]: addForm,
  [RJSF_UPDATE_FORM]: updateForm,
  [RJSF_CHANGE_FORM_DATA]: changeFormData,
  [RJSF_VALIDATE]: validateForm,
  [RJSF_SUBMIT_START]: startSubmit,
  [RJSF_SUBMIT_SUCCESS]: successSubmit,
  [RJSF_SUBMIT_ERROR]: failSubmit,
  [RJSF_RESET]: resetForm,
};
export { reducerMethods };

export default (state = {}, action) => {
  if (reducerMethods[action.type]) {
    return reducerMethods[action.type](state, action);
  }
  return state;
};

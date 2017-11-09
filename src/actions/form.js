import {
  RJSF_CHANGE_FORM_DATA,
  RJSF_SUBMIT,
  RJSF_INIT,
  RJSF_RESET,
  RJSF_UPDATE_FORM,
} from '_constants/form';

export const onChange = ({ data, options, formName, ...payload }) => ({
  type: RJSF_CHANGE_FORM_DATA,
  payload: {
    data,
    formName,
    options,
    ...payload,
  },
});
export const onInit = ({ formName, ...payload }) => ({
  type: RJSF_INIT,
  payload: {
    formName,
    ...payload,
  },
});

export const onUpdate = ({ formName, form, ...payload }) => ({
  type: RJSF_UPDATE_FORM,
  payload: {
    formName,
    form,
    ...payload,
  },
});

export const onReset = ({ formName, ...payload }) => ({
  type: RJSF_RESET,
  payload: {
    formName,
    ...payload,
  },
});

export const onSubmit = ({ formName, ...payload }) => ({
  type: RJSF_SUBMIT,
  isSubmitForm: true,
  payload: {
    formName,
    ...payload,
  },
});

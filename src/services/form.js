import isEqual from 'lodash/isEqual';
import Ajv from 'ajv';
import {
  toIdSchema,
  getDefaultFormState,
} from 'react-jsonschema-form/lib/utils';

const DefaultFormState = {
  successResponse: {},
  errorSchema: {},
  dirtyFields: [],
  formData: {},
  schema: {},
  status: 'initial',
  isReady: true,
};

/**
 * remove empty value from formData
 * @param formData {object} form data
 */
export const removeEmptyValue = (formData = {}) =>
  Object.keys(formData).reduce((result, key) => {
    let value = formData[key];
    if (value === undefined || value === '' || value === null) {
      return result;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      value = removeEmptyValue(value);
      if (!Object.keys(value).length) {
        return result;
      }
    }
    return { ...result, [key]: value };
  }, {});

/**
 * merge original state for and redux state and additional property
 * @param formState {object} currect state for (from server)
 * @return {object} new state for form
 */
export const getStateFromProps = formState => {
  const schema = 'schema' in formState ? formState.schema : {};
  const uiSchema = 'uiSchema' in formState ? formState.uiSchema : {};
  const { definitions } = schema;

  const formData = removeEmptyValue(
    getDefaultFormState(schema, formState.formData, definitions),
  );
  const idSchema = toIdSchema(schema, uiSchema['ui:rootFieldId'], definitions);
  return {
    ...formState,
    ...DefaultFormState,
    schema,
    uiSchema,
    idSchema,
    formData,
    dirtyFields: [],
    isSubmit: false,
    origin: {
      formData: { ...formData },
      schema: { ...schema },
    },
  };
};

/**
 * gererate error path from object
 * @description get a.b.c.d  - return [ 'a', 'b', 'c', 'd' ],
 * @description get a[0].c.d - return  [ 'a', 0, 'c', 'd' ]
 *
 * @param property {object}
 */
export const errorPropertyToPath = (property = '') =>
  property.split('.').reduce((path, node) => {
    let newPath = path;
    const match = node.match(/\[\d+]/g);
    if (match) {
      const nodeName = node.slice(0, node.indexOf('['));
      const indices = match.map(str => parseInt(str.slice(1, -1), 10));
      newPath = path.concat(nodeName, indices);
    } else {
      newPath = path.concat([node]);
    }
    return newPath;
  }, []);

/**
 * convert error for rendering
 * @param errors
 * @return {{}}
 */
export const toClientErrorSchema = errors => {
  if (!errors || !errors.length) {
    return {};
  }
  return errors.reduce((errorSchema, error) => {
    const path = errorPropertyToPath(error.dataPath);
    let parent = errorSchema;
    const slicePath = path.slice(1);
    slicePath.forEach(segment => {
      if (!(segment in parent)) {
        parent[segment] = {};
      }
      parent = parent[segment];
    });

    if (Array.isArray(parent.errors)) {
      parent.errors.push({
        template: error.keyword,
        parameters: error.params,
      });
    } else {
      parent.errors = [
        {
          template: error.keyword,
          parameters: error.params,
        },
      ];
    }

    return errorSchema;
  }, {});
};

/**
 * validate form data
 * @param formData {object} form data
 * @param schema   {object} jsonSchema
 * @return {{}}
 */
export const validate = (formData, schema) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(formData);
  if (valid) {
    return {};
  }
  const { errors } = validate;
  const formatErrors = errors.map(error => {
    const newError = {
      ...error,
      dataPath: `instance${error.dataPath}`,
    };
    if (newError.params && newError.params.missingProperty) {
      return {
        ...newError,
        dataPath: [newError.dataPath, newError.params.missingProperty].join(
          '.',
        ),
        params: {},
      };
    }
    return newError;
  });
  return toClientErrorSchema(formatErrors);
};

/**
 * filter erros list by excludeFields
 * @param errorSchema  {object} object with all form errors
 * @param dirtyFields  {array} array dirty fields for filter errors
 * @param parentPath   {string} string woth parent path (for recursive)
 */

export const getFilterError = (errorSchema, dirtyFields, parentPath = '') =>
  Object.keys(errorSchema).reduce((result, errorKey) => {
    if (
      errorKey === 'errors' &&
      (dirtyFields.includes(parentPath) || !parentPath)
    ) {
      return {
        ...result,
        [errorKey]: errorSchema[errorKey],
      };
    } else if (errorKey === 'errors') {
      return result;
    }
    const tempResult = getFilterError(
      errorSchema[errorKey],
      dirtyFields,
      parentPath ? `${parentPath}.${errorKey}` : errorKey,
    );
    if (Object.keys(tempResult).length) {
      return {
        ...result,
        [errorKey]: tempResult,
      };
    }
    return result;
  }, {});

export const appendDirtyField = (
  allDirtyFields = [],
  currentFieldName = '',
) => {
  if (!currentFieldName || allDirtyFields.includes(currentFieldName)) {
    return allDirtyFields;
  }
  return [...allDirtyFields, currentFieldName];
};

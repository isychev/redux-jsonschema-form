import React from 'react';
import get from 'lodash/get';
import find from 'lodash/find';

const getRenderFields = (groupFields, arrProps) => {
  if (Array.isArray(groupFields) && Array.isArray(arrProps)) {
    return arrProps.filter(el => groupFields.includes(el.name));
  }
  return [];
};

const geTypeObjectsByName = ({ name, uiGroup }) =>
  find(uiGroup.groups, { name }) ? 'group' : 'field';

/**
 * return true if some field has error, used for paint field
 * @param elemProps
 */
const groupHasError = elemProps =>
  elemProps.some(el => !!Object.keys(el.errorSchema || {}).length);

const renderGroupChildren = ({ groups, uiGroup, SchemaField, arrProps }) => {
  const childrenGroup = get(uiGroup, 'groups', []).map(group => group.name);
  const childrenFields = get(uiGroup, 'fields', []);
  const order = uiGroup.order || [...childrenGroup, ...childrenFields];
  return order.map((name, index) => {
    const type = geTypeObjectsByName({ name, uiGroup });

    if (type === 'group') {
      const uiSchemaGroup = find(uiGroup.groups, { name });
      const elemProps = getRenderFields(uiSchemaGroup.fields || [], arrProps);
      if (!uiSchemaGroup) {
        throw new SyntaxError(`Incorect group: ${name}`);
      }
      const GroupComponent = groups[uiSchemaGroup.type];
      return (
        <GroupComponent
          key={`${index + 1}${name}`}
          isLastGroup={index === order.length - 1}
          elemProps={elemProps}
          groups={groups}
          uiGroup={uiSchemaGroup}
          SchemaField={SchemaField}
          arrProps={arrProps}
        />
      );
    }
    const elemProps = getRenderFields([name], arrProps)[0];
    if (!elemProps) {
      throw new SyntaxError(`Incorect field: ${name}`);
    }
    return <SchemaField key={`${index + 1}${name}`} {...elemProps} />;
  });
};

export { renderGroupChildren, getRenderFields, groupHasError };

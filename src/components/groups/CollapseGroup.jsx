import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Collapse from 'reactstrap/lib/Collapse';

const trans = f => f;
import {
  renderGroupChildren,
  getRenderFields,
  groupHasError,
} from './groupServices';

//import './collapse.scss';

/**
 * render collapse group
 * @param  groups       {object}        object with all groups components
 * @param  uiGroup      {object}        object of group
 * @param  SchemaField  {object}        base component of row
 * @param  arrProps     {array}         array with all props of allfields
 */
class CollapseGroup extends Component {
  static propTypes = {
    uiGroup: PropTypes.objectOf(PropTypes.any),
    SchemaField: PropTypes.func,
    arrProps: PropTypes.arrayOf(PropTypes.any),
    groups: PropTypes.objectOf(PropTypes.any),
  };
  static defaultProps = {
    uiGroup: {},
    SchemaField: null,
    arrProps: [],
    groups: {},
  };

  state = {
    collapse: false,
  };
  /**
   * event toggle collapse
   */
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { groups, arrProps, uiGroup, SchemaField } = this.props;
    const elemProps = getRenderFields(uiGroup.fields || [], arrProps);
    if (!elemProps.length) {
      return null;
    }
    const hasError = groupHasError(elemProps);
    const collapse = hasError || this.state.collapse;
    const formContext = get(elemProps, [0, 'registry', 'formContext'], false);
    return (
      <div className={'form-group'}>
        <div className={`row mt-4 mb-5 ${formContext.paddingClassName}`}>
          <div className="col">
            <i
              className={`icon-collapse icon-center align-middle d-inline-block pl-3 py-2 mr-1 ${collapse
                ? ' open'
                : ''}`}
            />
            <button
              type="button"
              className="btn btn-link collapse-group-link py-1 px-0"
              onClick={this.toggle}
            >
              {trans(uiGroup.title)}
            </button>
          </div>
        </div>
        <Collapse isOpen={collapse}>
          <div>
            {renderGroupChildren({
              groups,
              uiGroup,
              SchemaField,
              arrProps,
            })}
          </div>
        </Collapse>
      </div>
    );
  }
}

export default CollapseGroup;

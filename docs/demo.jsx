import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { HashRouter as Router, NavLink } from 'react-router-dom';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import beautifyJs from 'js-beautify';
import { Form, middlewares, reducer, SubmitButton, actions } from '../main';
import * as fixtures from './fixtures';
import '../src/components/form.scss';

const reduxDevTools = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const composeEnhancers = window[reduxDevTools] || compose;

const propsData = {
  forms: {
    ...fixtures,
  },
};

const enhancer = composeEnhancers(
  applyMiddleware(...Object.values(middlewares)),
);

const store = createStore(
  combineReducers({ forms: reducer }),
  propsData,
  enhancer,
);

class Page extends Component {
  static propTypes = {};
  static defaultProps = {
    forms: {},
  };
  state = {
    formName: {},
    schema: {},
    uiSchema: {},
    formData: {},
  };
  constructor(props) {
    super(props);
    this.formNames = {
      '#/': 'form1',
      '#/withArrays': 'form2',
      '#/withObject': 'form3',
    };
  }
  componentWillMount() {
    this.updateState(window.location.hash || '#/');
  }
  handleClickNavLink = hash => {
    this.updateState(hash);
  };
  handleChangeSchema = (str, type) => {
    let newSchema = null;
    try {
      newSchema = JSON.parse(str);
    } catch (e) {
      console.log('error');
    }
    if (newSchema) {
      this.props.onUpdate({
        formName:this.state.formName,
        form:{
          [type]: newSchema,
        },
      });
    }
  };
  updateState = hash => {
    const newFormName = this.formNames[hash || '#/'];
    const formObj = this.props.forms[newFormName];
    const { schema = {}, uiSchema = {}, formData = {} } = formObj;
    this.setState({
      loading: true,
      formName: this.formNames[hash || '#/'],
      schema: beautifyJs(JSON.stringify(schema)),
      uiSchema: beautifyJs(JSON.stringify(uiSchema)),
      formData: beautifyJs(JSON.stringify(formData)),
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 50);
  };
  render() {
    const { formName, schema, uiSchema, formData, loading } = this.state;

    const codeMirrorOptions = {
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: 'javascript',
    };
    return (
      <div>
        <Router>
          <div className={'container-fluid'}>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark row">
              <a className="navbar-brand" href="#">
                REDUX-JSONSCHEMA-FORM
              </a>
            </nav>
            <div>
              <div className="row">
                <nav className="col-12">
                  <ul className="nav nav-tabs mt-2">
                    <li className="nav-item">
                      <NavLink
                        exact
                        className={'nav-link rounded-0'}
                        activeClassName={'active'}
                        to={'/'}
                        onClick={() => this.handleClickNavLink('#/')}
                      >
                        SimpleForm
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        exact
                        className={'nav-link rounded-0'}
                        activeClassName={'active'}
                        to={{ pathname: '/withObject' }}
                        onClick={() => this.handleClickNavLink('#/withObject')}
                      >
                        Form with objects
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        exact
                        className={'nav-link rounded-0'}
                        activeClassName={'active'}
                        to={{ pathname: '/withArrays' }}
                        onClick={() => this.handleClickNavLink('#/withArrays')}
                      >
                        Form with arrays
                      </NavLink>
                    </li>
                  </ul>
                </nav>
                {!loading ? (
                  <main className="col-12 pt-3" role="main">
                    <div className="container-fluid">
                      <div className={'row'}>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-12 mb-2">
                              <div className={'card'}>
                                <div className="card-header">Schema</div>
                                <CodeMirror
                                  onBlur={()=>{
                                    console.log('asdasdasdas');}}
                                  onChange={str => {
                                    this.handleChangeSchema(str, 'schema');
                                  }}
                                  className={'border'}
                                  value={schema}
                                  options={codeMirrorOptions}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className={'card'}>
                                <div className="card-header">uiSchema</div>
                                <CodeMirror
                                  onChange={str => {
                                    this.handleChangeSchema(str, 'uiSchema');
                                  }}
                                  className={'border'}
                                  value={uiSchema}
                                  options={codeMirrorOptions}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="card">
                                <div className="card-header">FormData</div>
                                <CodeMirror
                                  onChange={str => {
                                    this.handleChangeSchema(str, 'formData');
                                  }}
                                  className={'border'}
                                  value={formData}
                                  options={codeMirrorOptions}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <Form formName={this.state.formName} />
                        </div>
                      </div>
                    </div>
                  </main>
                ) : null}
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

const ConApp = connect(store => ({ forms: store.forms }), {
  onUpdate: actions.onUpdate,
})(Page);

const App = () => (
  <Provider store={store}>
    <div>
      <ConApp />;
    </div>
  </Provider>
);

render(<App />, document.getElementById('app'));

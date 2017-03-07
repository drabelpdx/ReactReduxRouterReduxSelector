import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    }).isRequired,
  history: PropTypes.shape({}),
};

export default Root;

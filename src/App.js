import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializeApp, getCampaignDataThunk, appData, usState } from './state';

//import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.props.getCampaignData(this.props.params.usState);
  }
  componentDidMount() {
    this.props.initApp();
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>React-redux data viz</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default connect(
  state => ({
    inFlight: state.app.isFetching,
    data: appData(state),
    usState: usState(state),
  }),
  dispatch => ({
  initApp: () => dispatch(initializeApp()),
  getCampaignData: (usState) => dispatch(getCampaignDataThunk(usState))
})
)(App);

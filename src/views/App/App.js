import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializeApp, getSpendingByIdThunk, getTransactionsByIdThunk, getCampaignDataThunk, campaignDetail, campaignTransactions, campaignSpending, filerId } from '../../state';

import './App.css';

class App extends Component {

  componentWillMount() {
    this.props.getSpending(this.props.params.filerId);
    this.props.getTransactions(this.props.params.filerId);
  }

  componentDidMount() {
    this.props.initApp();
  }

  fetchData = () => this.props.getSpending(this.props.params.filerId);

  fetchCampaignDetail = () => this.props.getCampaignDetail(this.props.params.filerId);

  renderData = (data) => data.map(datum => <p key={datum.tran_id}>{datum.contributor_payee} recieved {datum.amount}</p>).slice(0, 10);

  getBook = (datum) => {
    if (datum) {
      const bookTypes =
        datum.filter(datum => datum.book_type!=null || datum.book_type!=undefined);
      const dataByBook = {};
      bookTypes.forEach((t) => {
        const book = t.book_type;
        const bookToUpdate = dataByBook[book];
          if (bookToUpdate) {
            dataByBook[book].push(t);
          } else {
            dataByBook[book] = [t];
          }
      });
      return dataByBook
    }
  }

  buildNodes = (transaction, spending) => {
    //first node is hard coded, need to grab this dynamicly later
    const nodes = [{name: "Friends of Ted Wheeler", node: 0}];
    const links = [];
    if (transaction && spending) {
      //for transactions
      Object.keys(transaction).forEach((key, i) => {
        //builds nodes
        nodes.push({name: key, node: i+1});
        //builds links
        transaction[key].forEach((item) => {
          links.push({source: i+1, target: 0, value: item.amount })
        })
      });
      //for spending
      Object.keys(spending).forEach((key, i) => {
        //adds nodes from spending not in transaction
        const pos = nodes.map(function(e) { return e.name; }).indexOf(key);
        if (pos === -1) {
          nodes.push({name: key, node: nodes.length+1});
        }
        //crosses references nodes for target
        const node = nodes[pos].node;
        spending[key].forEach((item) => {
          links.push({source: 0, target: node, value: item.amount })
        })
      });
    }
    const myNodes = {nodes: nodes, links: links};
    return myNodes
  }

  renderTransactions = () => (
    <div>
      <h4>Transactions</h4>
      {this.renderData(this.props.transactionData)}
    </div>
  );

  renderSpending = () => (
    <div>
      <h4>Spending</h4>
      {this.renderData(this.props.spendingData)}
    </div>
  );

  renderDetails = (data) => (
        <div>
          <h3>Details for {data.candidate_name}</h3>
          <h4>Committee: {data.committee_name}</h4>
        </div>
  );

  render() {
    const transactionDataBook = this.getBook(this.props.transactionData);
    const spendingDataBook = this.getBook(this.props.spendingData);
    const myNodes = this.buildNodes(transactionDataBook, spendingDataBook);
    console.log("tranasactionDataBook", transactionDataBook);
    console.log("spendingDataBook", spendingDataBook);
    console.log("myNodes", myNodes);

    return (
      <div className="App">
        <div className="App-header">
          <h2>React-redux data viz</h2>
        </div>
        {this.props.inFlight && <h4>Loading...</h4>}
        <p className="App-intro">
          Showing data for filer id: {this.props.filerId}
        </p>
        {this.props.detail && this.renderDetails(this.props.detail)}
        <button onClick={this.fetchCampaignDetail}>Get campaign detail</button>
        <button onClick={this.fetchData}>Refresh data</button>

        {this.props.spendingData && this.renderSpending()}
        {this.props.transactionData && this.renderTransactions()}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    inFlight: state.app.isFetching,
    spendingData: campaignSpending(state),
    transactionData: campaignTransactions(state),
    detail: campaignDetail(state),
    filerId: filerId(state),
  }),
  dispatch => ({
  initApp: () => dispatch(initializeApp()),
  getSpending: (filerId) => dispatch(getSpendingByIdThunk(filerId)),
  getTransactions: (filerId) => dispatch(getTransactionsByIdThunk(filerId)),
  getCampaignDetail: (filerId) => dispatch(getCampaignDataThunk(filerId))
})
)(App);

import React, { Component } from 'react';
import './styles/main.scss';
import Category from './components/Category.js';
import CoinDetails from './components/CoinDetails.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      data: [],
      sortType: "q",
      searchStr: "",
      displayData: [],
      websocket: "",
      websocketData: [],
      websocketState: ""
    }
  }

  // property of this class
  ws = new WebSocket('wss://stream.binance.com/stream?streams=!miniTicker@arr');

  componentDidMount() {
    this.connectWS(this.ws, "open");
    this.callAPI();
  }

  connectWS(control) {
    if(control==="open") {

    }

    if(control==="close") {
      console.log("Connection is closing");
      this.ws.close();  //close the connection
    }

    this.ws.onopen = (state) => {
      console.log("connected WebSocket");
      console.log(state);
      this.setState({websocketState: "open"});
    }

    // Need to setInterval, otherwise server keep send message for every second
    // this.ws.onmessage = (message) => {
    //   console.log("Message received from Server");
    //   console.log(message);
    //   // set data to state
    // }

    // Listeners
    this.ws.close = () => {
      console.log("Connection is closed");
      this.setState({websocketState: "closed"});
    };

    this.ws.onerror = (err) => {
      console.err("Socket encoutered error ", err.message, "Closing socket");
      this.ws.close();
    }
  }

  closeConnection = () => {
    console.log("Close button clicked");
    this.connectWS("close");
  }

  callAPI() {
    fetch(`/exchange-api/v1/public/asset-service/product/get-products`)
    .then(res => res.json())
    .then(res => this.setState({
          dataLoaded: true,
          data: res.data,
          displayData: res.data
    }))
  }

  querySelection = (symbol) => {
    this.updateList(symbol);
  }

  updateList(str) {
    if(str === "") {
      this.setState({
        displayData: this.state.data
      })
    } else {
      this.setState({
        displayData: this.state.data.filter((element) => element.q === str.toUpperCase() || element.b === str.toUpperCase())
      })
    }
  }

  async updateInput(e) {
    await this.setState({
      searchStr: e.target.value
    })
    this.updateList(this.state.searchStr);
  }

  render() {

    // if(this.state.dataLoaded === true) {console.log(this.state.data)} // debugger: the first render hasn't got the data yet

    return(
      <main className="App">
        <div className="container">
          <h1>Cryptocurrency Price</h1>
          <h2>Websocket status: {this.state.websocketState}</h2>
          <button onClick={this.closeConnection}>Close Connect</button>
          <div className="section category-wrapper col-sm-12">
            <Category data={this.state.data} querySelection={this.querySelection}/>
          </div>
          <div className="section selection-wrapper">
            <div className="search-wrapper col-sm-6">
              <input className="form-control" type="text" placeholder="Search" aria-label="Search" onChange={(e) => this.updateInput(e)} value={this.state.searchStr}/>
            </div>
            <div className="form-wrapper col-sm-6">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="radio" id="change" value="option1" checked/>
                <label className="form-check-label" htmlFor="change">
                  Change
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="radio" id="volume" value="option2" />
                <label className="form-check-label" htmlFor="volumn">
                  Volume
                </label>
              </div>
            </div>
          </div>

          <div className="section list-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Pair</th>
                  <th scope="col">Last Price</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                <CoinDetails data={this.state.displayData} dataLoaded={this.state.dataLoaded} sortType={this.state.sortType}/>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    )
  }

}

export default App;

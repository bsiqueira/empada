import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InsertForm from './InsertForm.js'
import TaskDashboard from './TaskDashboard'
// import { BrowserRouter, Route, Link } from 'react-router-dom'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleStartTask = (e) => {
    e.preventDefault();
    let message = {
      type: 'start-time', 
      start_time: Date.now(),
      project_id: 12,
      id: 1
    }
    console.log('it is activating the button')
    this.socket.send(JSON.stringify(message));
  }

  handleEndTask = (e) => {
    e.preventDefault(); 
  }

  componentDidMount = () => {
    // console.log("componentDidMount <App />");
    const mysocket = new WebSocket("ws://localhost:3001")
    this.socket = mysocket;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log('submitted')
    console.log(this.state.insert)
    this.socket.send(this.state.insert)
  }

  handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    this.setState({insert: e.target.value})
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to EMPADA</h2>
        </div>
        <br />
        <InsertForm handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        <TaskDashboard handleStartTask={this.handleStartTask} handleEndTask={this.handleEndTask}/>
      </div>
    );
  }
}

export default App;

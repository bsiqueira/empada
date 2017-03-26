import React, { Component } from 'react';
import './App.css';

class EventCreationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: {name: "", id: 0}
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    console.log(e.target.innerHTML);
    // "collection-item active" ? "collection-item" : "collection-item active";
    if (e.target.className === "collection-item active"){
      e.target.className = "collection-item";
    } else {
      e.target.className="collection-item active";
    }
    console.log(e.target.getAttribute('data-id'));
    this.setState({
      selected: {
        name: e.target.innerHTML,
        id: e.target.getAttribute('data-id')
      }
    }); 
  } 
  render() {
    return (
      <div>
        <div className="row">
          <div className="col s4">
            <div className="card-panel">
            <form onSubmit={this.props.handleSubmit}>
              <input type="text" onChange={this.props.handleNameChange} placeholder="THE MAIN EVENT!" ref="insert" />
              <input type="text" onChange={this.props.handleDescChange} placeholder="Descript your event here" />
              <input type="date" onChange={this.props.handleDateChange} placeholder="2017/01/01" />
              <input type="text" onChange={this.props.handleAssignedPerson} placeholder="Bob,Jim,Sally..." />
              <input type="submit"/>
            </form>
            </div>
            <div className="card-panel">
              <div className="collection">
                
                  {this.props.assigned_people.map( (p) => {
                    return (<a href="#!" data-id={p.id} className="collection-item" onClick={this.toggle}>{p.name}</a>);
                  })}
                
              </div>
            </div>
          </div>
          <div className="col s8">
            <div className="card-panel">
              {this.state.selected.name}
              <table>
                <thead>
                  <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><form><input type="text" placeholder="New task"/></form></td>
                    <td><form><input type="text" placeholder="Description of task"/></form></td>
                    <td><form><input type="text" placeholder="Start Task time"/></form></td>
                    <td><form><input type="text" placeholder="End Task Time"/></form></td>
                  </tr>
                
                  {this.props.tasks
                    .filter((t)=> {
                      console.log("Filtering...")
                      console.log(t.user_id)
                      console.log(this.state.selected.id)
                      console.log(t.user_id == this.state.selected.id);
                      return t.user_id == this.state.selected.id;
                    })
                    .map((t)=> {
                      console.log("map out table rows")
                      return (
                        <tr><td data-task-id={t.id}>{t.name}</td><td data-task-id={t.id}>{t.description}</td><td data-task-id={t.id}>{t.assined_end_time}</td></tr>
                      );
                    })}     
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default EventCreationForm;
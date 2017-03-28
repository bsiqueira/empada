import React, { Component } from 'react';
import './App.css';
import NewTaskFields from './NewTaskFields.jsx';
import AddNewPersonButton from './AddNewPersonButton.jsx'

class EventCreationForm extends Component {
  render() {
  // console.log(this.props)
    return (
      <div>
        <div className="row">
          <div className="col s4">
            <div className="card-panel">
              <input type="text" placeholder="THE MAIN EVENT!" value={this.props.eventCreation.name} onChange={this.props.newEventName} />
              <input type="text" placeholder="Describe your event here" value={this.props.eventCreation.description} onChange={this.props.newEventDescription}/>
              <input type="date" placeholder="2017/01/01" value={this.props.eventCreation.date} onChange={this.props.newEventDate}/>
            </div>
            <div className="card-panel">
              <AddNewPersonButton {...this.props} />
              <input type="text" value={this.props.eventCreation.newAssignedPerson} onChange={this.props.handleAssignedPerson} placeholder="Bob,Jim,Sally..." />
              <input type="email" value={this.props.eventCreation.newAssignedEmail} onChange={this.props.handleAssignedEmail} placeholder="Email@something.com..." />
              <div className="collection">
                  {this.props.eventCreation.assigned_people.map( (p, i) => {
                    return (
                      <a 
                        key={i}
                        href="#!" 
                        data-id={p.id} 
                        className={
                          parseInt(this.props.eventCreation.selected.id, 10) === parseInt(p.id,10) ? 
                          "collection-item active" : 
                          "collection-item" 
                        } 
                        onClick={this.props.eventCreationSelectToggle}>
                        {p.name}({p.email})
                      </a>);
                  })}
              </div>
            </div>
          </div>
          <div className="col s8">
            <div className="card-panel">
              <button className="waves-effect waves-light btn" onClick={this.props.addTask}>Add new task for {this.props.eventCreation.selected.name}</button>
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
                  <NewTaskFields {...this.props} functions={{
                    newTask: this.props.newTask,
                    newDescription: this.props.newDescription,
                    newStartTime: this.props.newStartTime,
                    newEndTime: this.props.newEndTime
                  }} />
                  {this.props.eventCreation.tasks
                    .filter((t)=> {
                      // console.log('filtering');
                      // console.log(t.user_id);
                      // console.log(this.props.eventCreation.selected.id);
                      return parseInt(t.user_id,10) === parseInt(this.props.eventCreation.selected.id,10);
                    })
                    .map((t)=> {
                      // console.log('mapping')
                      return (
                        <tr>
                          <td data-task-id={t.id}>{t.name}</td>
                          <td data-task-id={t.id}>{t.description}</td>
                          <td data-task-id={t.id}>{t.assigned_start_time}</td>
                          <td data-task-id={t.id}>{t.assigned_end_time}</td>
                        </tr>
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
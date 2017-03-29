import React, { Component } from 'react';
import '../styles/App.css';
import Auth0Lock from 'auth0-lock'
import { Timeline } from 'react-chartkick';
import ReactInterval from 'react-interval';
import TaskDashboard from './TaskDashboard.js'
import { Button, Modal } from 'react-materialize';
import ProgressBar from './ProgressBar.js';
import EventCreationForm from './EventCreationForm.jsx';
/*
Users:
- started a task
- completed a task
- user progress bar changes (combined with above)

task (without user action):
- task should have been started by now
- task should have been completed by now

project:
- big project milestones (eg 25%, 50%, 75%, 90%)
- comparing current progress to planned progress
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventCreation: {
        selected: {name: "", id: NaN},
        startDate: "",
        endDate: "",
        name: "",
        description: "",
        newTask: "",
        newDescription: "",
        newStartTime: "",
        newEndTime: "",
        newAssignedPerson: "",
        newAssignedEmail: "",
        assigned_people: [
          {
            name: 'Jimmy',
            id: 1,
            email: "jimmy@email.com"
          },
          {
            name: 'Johnny',
            id: 2,
            email: "Johnny@email.com"
          },
          {
            name: 'Sally',
            id: 3,
            email: "sally@email.com"
          }
        ],
        tasks: [
          // {id: 1, user_id: 1, name: 'buy beer', description: 'go to LBCO',assigned_start_time: '08:00:00',assigned_end_time: '10:00:00'},
          // {id: 2, user_id: 1, name: 'buy cups', description: 'go to dollar store',assigned_start_time: '15:00:00',assigned_end_time: '17:00:00'},
          // {id: 3, user_id: 2, name: 'bring music', description: 'check out spotify',assigned_start_time: '09:00:00',assigned_end_time: '11:00:00'},
          // {id: 4, user_id: 3, name: 'wash car', description: 'clean my car yo',assigned_start_time: '11:00:00',assigned_end_time: '18:00:00'}
        ],
        timelineData: [
          // ["Jimmy", new Date(2017, 3, 25, 17, 0), new Date(2017, 3, 25, 17, 30)],
          // ["Johnny", new Date(2017, 3, 25, 8, 0), new Date(2017, 3, 25, 10, 0)],
          // ["Sally",  new Date(2017, 3, 25, 1, 0), new Date(2017, 3, 25, 3, 0)]
        ]
      },
      tasks: [],
      modalIsOpen: false,
      grace_period: 300000,
      newsfeed: [],
      list_of_tasks : [
        {
          start_time: Date.now(),
          assigned_start_time: new Date().toLocaleTimeString(),
          description: 'description',
          assigned_end_time: new Date().toLocaleTimeString(),
          end_time: Date.now(),
          id: 1,
          user_id: 1
        },
        {
          start_time: Date.now(),
          assigned_start_time: new Date().toLocaleTimeString(),
          description: 'another description',
          assigned_end_time: new Date().toLocaleTimeString(),
          end_time: Date.now(),
          id: 2,
          user_id: 1
        },
        {
          start_time: Date.now(),
          assigned_start_time: new Date().toLocaleTimeString(),
          description: 'a third description',
          assigned_end_time: new Date().toLocaleTimeString(),
          end_time: Date.now(),
          id: 3,
          user_id: 2
        }
      ],
      progress_bar : [
        {
          user_id: 1,
          incomplete_tasks: 100,
          completed_tasks: 0,
          total_tasks: undefined,
        },
        {
          user_id: 2,
          incomplete_tasks: 100,
          completed_tasks: 0,
          total_tasks: undefined,
        }
      ],
    };

    // this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
  }

  showLock = () => {
    // Show the Auth0Lock widget
    this.lock.show();
  }

  logout = () => {
    this.setState({profile: undefined})
    localStorage.removeItem("profile")
    // this.showLock()
  }

  updateNewsFeed = () => {
    let fromDb = [
      {
        type:   'assigned_user_action',
        user:   'assigned_user',
        task:   'assigned_task',
        action: 'started_task', //'completed_task', 'progress_bar'
        action_time: new Date(2016, 11, 1, 9),
        assigned_time: new Date(2016, 11, 1, 9),
        notification_time: new Date(2016, 11, 1, 9)
      },
      {
        type:   'assigned_user_action',
        user:   'assigned_user',
        task:   'assigned_task',
        action: 'completed_task',
        action_time: new Date(2016, 11, 1, 9, 10),
        assigned_time: new Date(2016, 11, 1, 9, 0),
        notification_time: new Date(2016, 11, 1, 9, 10)
      },
      {
        type:   'assigned_user_action',
        user:   'assigned_user',
        task:   'assigned_task',
        action: 'started_task', //'completed_task', 'progress_bar'
        action_time: new Date(2016, 11, 1, 9, 1),
        assigned_time: new Date(2016, 11, 1, 9, 10),
        notification_time: new Date(2016, 11, 1, 9, 10)
      },
      {
        type:   'task_timing',
        user:   'assigned_user',
        task:   'assigned_task',
        action: 'task_not_started', //'task_not_completed'
        assigned_time: new Date(2016, 11, 1, 9, 10),
        notification_time: new Date(2016, 11, 1, 9, 15)
      },
      {
        type:   'task_timing',
        user:   'assigned_user',
        task:   'assigned_task',
        action: 'task_not_completed',
        assigned_time: new Date(2016, 11, 1, 9, 10),
        notification_time: new Date(2016, 11, 1, 9)
      },
      {
        type:   'project_progress',
        action: 'percent_completed', //'percent_expected' eg.Should be 50% at this point
        percantage: '50',
        notification_time: new Date(2016, 11, 1, 10)
      },
      {
        type:   'project_progress',
        action: 'percent_expected',
        percantage: '50',
        notification_time: new Date(2016, 11, 1, 10)
      }
    ]
    // this.state.newsfeed

    return this.setState({newsfeed: fromDb.map((item, index) => {
      let notif_type;
      switch(item.type) {
        case 'assigned_user_action':
          if (item.action === 'started_task') {
            notif_type = ['Started', 'start'];
          } else if (item.action === 'completed_task') {
            notif_type = ['Completed', 'completion'];
          }

          if (item.action_time > item.assigned_time
            && (item.action_time - item.assigned_time) > this.state.grace_period) { //difference of less than 5 minutes gets no notification
            notif_type.push('red','late', 'thumb_down');
          } else if (item.action_time < item.assigned_time
            && (item.assigned_time - item.action_time) > this.state.grace_period) {
            notif_type.push('green','early', 'thumb_up');
          } else {
            notif_type.push('blue','on time', 'alarm_on'); // alternative icon: 'schedule'
          }

          return (
            <li>
              <div className="collapsible-header">
                <span className={`new badge ${notif_type[2]}`} data-badge-caption={`${notif_type[3]}`}></span>
                <i className="material-icons">{`${notif_type[4]}`}</i>
                <p>{`${item.user} has ${item.action}`}</p>
              </div>
              <div className="collapsible-body left-align">
                <dl>
                  <dt><b>Task:</b> {item.task}</dt>
                  <dt><b>{`${notif_type[0]}`} at:</b> {`${item.action_time}`}</dt>
                  <dt><b>Expected {`${notif_type[1]}`} time:</b> {`${item.assigned_time}`}</dt>
                </dl>
              </div>
            </li>
          );

        case 'task_timing':
          if (item.action === 'task_not_started') {
            notif_type = ['Started', 'start'];
          } else if (item.action === 'task_not_completed') {
            notif_type = ['Completed', 'completion'];
          }
          notif_type.push('late', 'thumb_down');

          return (
            <li>
              <div className="collapsible-header">
                <span className="new badge red" data-badge-caption={`${notif_type[2]}`}></span>
                <i className="material-icons">{`${notif_type[3]}`}</i>
                <p>{`${item.user} has not ${notif_type[0].toLowerCase()} ${item.task}`}</p>
              </div>
              <div className="collapsible-body left-align">
                <dl>
                  <dt><b>Task:</b> {item.task}</dt>
                  <dt><b>Expected {`${notif_type[1]}`} time:</b> {`${item.assigned_time}`}</dt>
                </dl>
              </div>
            </li>
          );

        case 'project_progress':
          notif_type = [];
          if (item.action === 'percent_completed') {
            notif_type.push('', 'blue', 'on time', 'alarm_on');
          } else if (item.action === 'percent_expected') {
            notif_type.push('expected to be ', 'red', 'late', 'thumb_down');
          }

          return (
            <li>
              <div className="collapsible-header">
                <span className={`new badge ${notif_type[1]}`} data-badge-caption={`${notif_type[2]}`}></span>
                <i className="material-icons">{`${notif_type[3]}`}</i>
                <p>{`${item.percent} of project ${notif_type[0]}complete.`}</p>
              </div>
            </li>
          );

        default:
          throw new Error(`Unknown event type in newsfeed: ${item.type}`);
      }
    })})
  }

  updateCompletedAndIncompleteTasks = (e) => {
    e.preventDefault();

    const task = this.state.list_of_tasks.filter((t) => {
      return t.id === Number(e.target.value);
    })

    const userId = task[0].user_id
    let userProgressArr = this.state.progress_bar.filter((t) => {
      return t.user_id === userId;
    })

    const userTasks = this.state.list_of_tasks.filter((t) => {
      return t.user_id === userId;
    })

    let userProgress = userProgressArr[0];
    userProgress.total_tasks = userTasks.length;
    let percentOfTasksToChange = Math.round(100/userProgress.total_tasks);
    userProgress.completed_tasks += percentOfTasksToChange;
    userProgress.incomplete_tasks -= percentOfTasksToChange;
    const oldProgressBar = this.state.progress_bar;

    let newProgressBar = oldProgressBar.filter((t) => {
      return t.user_id !== userId
    })

    newProgressBar.push(userProgress);

    e.target.className += " disabled";

    let message = {
      type: 'end-time-for-contractor-tasks-and-updating-progress-bar',
      progress_bar: newProgressBar,
      end_time: Date.now(),
      project_id: 12,
      id: 2,
    }
    console.log('start task button pressed');
    this.socket.send(JSON.stringify(message));
  }

  handleStartTask = (e) => {
    e.preventDefault();

    e.target.className += " disabled";

    let message = {
      type: 'start-time-for-contractor-tasks',
      start_time: Date.now(),
      project_id: 12,
      id: 2
    }
    console.log('start task button pressed');
    this.socket.send(JSON.stringify(message));
  }

  componentWillMount = () => {
    console.log("componentWillMount <App />");
    this.lock = new Auth0Lock('TejTiGWUQtFqn8hCNABYJ1KREwuDwyat', 'bfcsiqueira.auth0.com', {
      theme: {
        primaryColor: '#26e'
      },
      languageDictionary: {
        title: 'Authenticate'
      },
      closable: false,
      additionalSignUpFields: [{
        name: "given_name",
        placeholder: "Enter your first name",
        // icon: "https://example.com/name_icon.png",
        validator: (value) => {
          return value.length > 1
        }
      },{
        name: "family_name",
        placeholder: "Enter your last name",
        // icon: "https://example.com/name_icon.png",
        validator: (value) => {
          return value.length > 1
        }
      }]
    });

    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem("accessToken", authResult.accessToken);
      this.lock.getProfile(authResult.idToken, (err, profile) => {
        if (err) {
          console.log("Error loading the Profile", err);
          return;
        }
        localStorage.setItem("profile", JSON.stringify(profile));
        this.setState({profile: profile});
        this.handleLogin()
      });
    });
  }
  componentDidUpdate(previousProps, previousState) {
    if(previousState.eventCreation.timelineData.length !== this.state.eventCreation.timelineData.length){
      console.log('detected timeline updated')
      this.clearTaskFields();
    }
  }

  componentDidMount() {
    // console.log("componentDidMount <App />");
    this.updateNewsFeed();
    this.updateTimeline();
    setTimeout(() => {
      if (!localStorage.profile) {
        this.showLock();
      } else {
        const storageProfile = JSON.parse(localStorage.profile)
        this.setState({profile: storageProfile})
      }
    }, 500)

    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onopen = () => {
      console.log('Connected to server!');
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);


      console.log('data.type.type');
      console.log(data.type.type);

      switch (data.type) {
        case 'update-progress-bar':
          let newstate = this.state;
          newstate.progress_bar = data.progress_bar;
          this.setState(newstate);
          break;

        case 'tasks':
          console.log('got inside tasks in the switch');
          const tasks = [];
          const timing = ['early start', 'late start', 'as scheduled', 'completed early', 'completed late'];
          for (let key of Object.keys(data.data)) {
            const task = data.data[key];
            // console.log(`creating task bars: ${task.task_name}`);

            if (task.start_date < task.assigned_start_date
              && task.end_date < task.assigned_end_date
              && task.assigned_start_date < task.end_date) {
              tasks.push([
                task.task_name,
                task.start_date,
                task.assigned_start_date,
                timing[0]
              ],
              [
                task.task_name,
                task.assigned_start_date,
                task.end_date,
                timing[2]

              ],
              [
                task.task_name,
                task.end_date,
                task.assigned_end_date,
                timing[3]
              ])
            } else if (task.start_date < task.assigned_start_date
              && task.end_date > task.assigned_end_date) {
              tasks.push([
                task.task_name,
                task.start_date,
                task.assigned_start_date,
                timing[0]
              ],
              [
                task.task_name,
                task.assigned_start_date,
                task.assigned_end_date,
                timing[2]
              ],
              [
                task.task_name,
                task.assigned_end_date,
                task.end_date,
                timing[4]
              ])
            } else if (task.start_date > task.assigned_start_date
              && task.end_date < task.assigned_end_date) {
              tasks.push([
                task.task_name,
                task.assigned_start_date,
                task.start_date,
                timing[1]
              ],
              [
                task.task_name,
                task.start_date,
                task.end_date,
                timing[2]
              ],
              [
                task.task_name,
                task.end_date,
                task.assigned_end_date,
                timing[3]
              ])
            } else if (task.start_date > task.assigned_start_date
              && task.end_date > task.assigned_end_date
              && task.start_date < task.assigned_end_date) {
              tasks.push([
                task.task_name,
                task.assigned_start_date,
                task.start_date,
                timing[1]
              ],
              [
                task.task_name,
                task.start_date,
                task.assigned_end_date,
                timing[2]
              ],
              [
                task.task_name,
                task.assigned_end_date,
                task.end_date,
                timing[4]
              ])
            } else if (task.end_date < task.assigned_start_date) {
              tasks.push([
                task.task_name,
                task.start_date,
                task.end_date,
                timing[3]
              ],
              [
                task.task_name,
                task.assigned_start_date,
                task.assigned_end_date,
                timing[3]
              ])
            } else if (task.start_date > task.assigned_end_date) {
              tasks.push([
                task.task_name,
                task.start_date,
                task.end_date,
                timing[1]
              ],
              [
                task.task_name,
                task.assigned_start_date,
                task.assigned_end_date,
                timing[1]
              ])
            }
          };

          console.log(tasks);

          const colorMap = {
            // should contain a map of category -> color for every category
            'early start'     : '#139A43',
            'late start'      : '#F26430',
            'as scheduled'    : '#279AF1',
            'completed early' : '#139A43',
            'completed late'  : '#F26430'
          };
          tasks.map((arr) => {
            arr.push(colorMap[arr[3]]);
            arr[3] = `${arr[0]} - ${arr[3]}`;
          });
          this.setState({'tasks': tasks});
          break;

        default:
          console.error('Failed to send back');
      }

    };
  }

  handleLogin = () => {
    console.log(this.state.profile.email)
    const loginObj = {type: 'auth0-login', email:this.state.profile.email, first_name: this.state.profile.given_name, last_name: this.state.profile.family_name}
    this.socket.send(JSON.stringify(loginObj))
  }


  submitEvent = () => {
    var payload = Object.assign({}, this.state);
    payload.type = 'eventCreation-newProject';
    this.socket.send(JSON.stringify(payload));
  }
  addNewAssignedUser = (event) => {
    var newUser = Object.assign({},this.state.eventCreation)
    newUser.assigned_people.push({
      name: this.state.eventCreation.newAssignedPerson,
      id: this.state.eventCreation.assigned_people.length+1,
      email: this.state.eventCreation.newAssignedEmail
    })
    newUser.newAssignedEmail = '';
    newUser.newAssignedPerson = '';
    this.setState({eventCreation: newUser});
  }
  handleAssignedEmail = (event) => {
    let newEmail = Object.assign({},this.state.eventCreation);
    newEmail.newAssignedEmail = event.target.value;
    this.setState({eventCreation: newEmail});
  }
  handleAssignedPerson = (event) => {
    let newPerson = Object.assign({},this.state.eventCreation);
    newPerson.newAssignedPerson = event.target.value;
    this.setState({eventCreation: newPerson});
  }
  updateTimeline = () => {
    const date = this.state.eventCreation.startDate;
    var timelineData = this.state.eventCreation.tasks.map( (t) => {
      // console.log([this.state.assigned_people.filter((p)=> p.id == t.user_id )[0].name, '2017-03-27T'+t.assigned_start_time+'.000Z', '2017-03-27T'+t.assigned_end_time+'.000Z' ]);
      return [this.state.eventCreation.assigned_people.filter((p)=> parseInt(p.id,10) === parseInt(t.user_id,10) )[0].name, new Date(date+' '+t.assigned_start_time), new Date(date+' '+t.assigned_end_time) ];
    });
    console.log(timelineData);
    var newTimelineData = Object.assign({},this.state.eventCreation)
    newTimelineData.timelineData = timelineData;
    this.setState({ eventCreation: newTimelineData });
    // this.clearTaskFields();
  }
  clearTaskFields = () => {
    const defaultValues = {
      newTask: '',
      newDescription: '',
      newStartTime: '',
      newEndTime: ''
    }
    var clearTasks = Object.assign({},this.state.eventCreation,defaultValues)
    this.setState({eventCreation: clearTasks});
  }
  addTask = () => {
    //add a new task to the task state, and add data to timeline.
    var newTasks = Object.assign({},this.state.eventCreation)
    if ( 
      newTasks.newTask !== '' && 
      newTasks.newDescription !== ''&& 
      newTasks.newStartTime !== ''&& 
      newTasks.newEndTime!== '' ) {
      const t_values = this.state.eventCreation;
      newTasks.tasks.push({
        id: this.state.eventCreation.tasks.length+1,
        user_id: t_values.selected.id,
        name: t_values.newTask,
        description: t_values.newDescription,
        assigned_start_time: t_values.newStartTime,
        assigned_end_time: t_values.newEndTime
      })
      newTasks.newTask = '';
      newTasks.newDescription = '';
      newTasks.newStartTime = '';
      newTasks.newEndTime= '';
      this.setState({eventCreation: newTasks });
      this.updateTimeline();    
    }
  }
  newEventName = (event) => {
    //watch for values added to new task name
    // console.log(event.target.value);
    let newName = Object.assign({},this.state.eventCreation);
    newName.name = event.target.value;
    this.setState({eventCreation: newName});
  }
  newEventDescription = (event) => {
    //watch for values added to new task description
    // console.log(event.target.value);
    let newEventDescription = Object.assign({},this.state.eventCreation);
    newEventDescription.description = event.target.value;
    this.setState({eventCreation: newEventDescription});
  }
  newEventEndDate = (event) => {
    //watch for values added to new task start time
    // console.log(event.target.value);
    let newEventDate = Object.assign({},this.state.eventCreation);
    newEventDate.endDate = event.target.value;
    this.setState({eventCreation: newEventDate});
  }
  newEventStartDate = (event) => {
    //watch for values added to new task start time
    // console.log(event.target.value);
    let newEventDate = Object.assign({},this.state.eventCreation);
    newEventDate.startDate = event.target.value;
    this.setState({eventCreation: newEventDate});
  }
  newTask = (event) => {
    //watch for values added to new task name
    // console.log(event.target.value);
    let newTask = Object.assign({},this.state.eventCreation);
    newTask.newTask = event.target.value;
    this.setState({eventCreation: newTask});
  }
  newDescription = (event) => {
    //watch for values added to new task description
    // console.log(event.target.value);
    let newDescription = Object.assign({},this.state.eventCreation);
    newDescription.newDescription = event.target.value;
    this.setState({eventCreation: newDescription});
  }
  newStartTime = (event) => {
    //watch for values added to new task start time
    // console.log(event.target.value);
    let newST = Object.assign({},this.state.eventCreation);
    newST.newStartTime = event.target.value;
    this.setState({eventCreation: newST});
  }
  newEndTime = (event) => {
    //watch for values added to new task end time
    // console.log(event.target.value);
    let newET = Object.assign({},this.state.eventCreation);
    newET.newEndTime = event.target.value;
    this.setState({eventCreation: newET});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.socket.send(this.state.insert)
  }
  handleChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value)
    this.setState({insert: e.target.value})
  }
  eventCreationSelectToggle = (e) => {
    let newSelected = Object.assign({},this.state.eventCreation);
    const newId =  e.target.getAttribute('data-id');
    if (newId === this.state.eventCreation.selected.id){
      newSelected.selected.name = "";
      newSelected.selected.id = NaN;
    } else {
      newSelected.selected.name = "";
      newSelected.selected.id = NaN;
      newSelected.selected.name = this.state.eventCreation.assigned_people.filter((p)=> parseInt(p.id,10) === parseInt(newId,10))[0].name;
      newSelected.selected.id = newId;
    }
    this.setState({
      eventCreation: newSelected
    }); 
  }

  render() {
    const timing = ['early start', 'late start', 'as scheduled', 'completed early', 'completed late'];
    let sample_data = [
      ["Ammar", new Date(2016, 11, 1, 8,  1), new Date(2016, 11, 1, 8, 30), timing[0], '#a23c7a'],
      ["Ammar", new Date(2016, 11, 1, 8, 30), new Date(2016, 11, 1, 9,  1), timing[2], '#40a67d'],
      ["Ammar", new Date(2016, 11, 1, 9,  1), new Date(2016, 11, 1, 9, 30), timing[3], '#5581b4']
    ];
    let libraryData = {timeline: {groupByRowLabel: true}};
    const { newsfeed } = this.state;


    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to EMPADA</h2>
          <div className="login-box">
            <button onClick={this.showLock}>Sign In</button>
            <button onClick={this.logout}>Log out</button>
            {this.state.profile && <p>Logged in as: {this.state.profile.email}</p>}
          </div>
          {/*<button onClick={this.openModal}>Login</button>*/}
        </div>

        <br />

        <Modal
          header='Modal Header'
          trigger={
            <Button waves='light'>MODAL</Button>
          }>
          
          <TaskDashboard
            handleStartTask={this.handleStartTask}
            listOfTasks={this.state.list_of_tasks}
            updateCompletedAndIncompleteTasks={this.updateCompletedAndIncompleteTasks}
          />
        </Modal>
        <ProgressBar
          taskName={this.state.name}
          completedTasks={this.state.completed_tasks}
          incompleteTasks={this.state.incomplete_tasks}
          progressBar={this.state.progress_bar}
        />
<div className='timeline'>
            <Timeline data={this.state.eventCreation.timelineData} />
          </div>
          <div className="event-creation-form">
            <EventCreationForm 
              {...this.state} 
              submitEvent={this.submitEvent}
              eventCreationSelectToggle={this.eventCreationSelectToggle} 
              addTask={this.addTask} 
              clearTaskFields={this.clearTaskFields}
              onNewTask={this.newTask}
              onNewDescription={this.newDescription}
              onNewStartTime={this.newStartTime}
              onNewEndTime={this.newEndTime}
              newEventStartDate={this.newEventStartDate}
              newEventEndDate={this.newEventEndDate}
              newEventDescription={this.newEventDescription}
              newEventName={this.newEventName}
              updateTimeline={this.updateTimeline}
              handleAssignedPerson={this.handleAssignedPerson}
              addNewAssignedUser={this.addNewAssignedUser}
              handleAssignedEmail={this.handleAssignedEmail}
              />
          </div>
        <div className="row">
          <div className="col s4 offset-s8">
            <ul className="collapsible popout" data-collapsible="accordion">
              {newsfeed}
              <ReactInterval timeout={30000} enabled={true} callback={this.updateNewsFeed} />
            </ul>
          </div>

          <div className='col s12 timeline-container'>
            <div className='timeline'>
              {/*<Timeline data={sample_data} library={libraryData} />*/}
              <Timeline data={this.state.tasks} library={libraryData} />
            </div>
          </div>
        </div>


        {/*<div className='timeline-container'>
          <div className='timeline'>
            <BarChart
            data={this.state.data}
            max={100}
            stacked={true}
          />
          </div>
        </div>*/}
      </div>
    );
  }
}

export default App;


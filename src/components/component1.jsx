import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MyComponent = () => {
  const [companyId, setCompanyId] = useState([]);
  const [authorization, setAuthorization] = useState([]);
  const [userId, setUserId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    assigned_user: '',
    task_date: '',
    task_time: 0,
    is_completed: 0,
    time_zone: 0,
    task_msg: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://stage.api.sloovi.com/login?product=outreach';
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        const body = {
          email: 'smithwills1989@gmail.com',
          password: '12345678',
        };

        const response = await axios.post(url, body, { headers });
        const data = response.data;
        console.log(data);
        console.log(data.results);
        setAuthorization(data.results.token);
        setCompanyId(data.results.company_id);
        setUserId(data.results.user_id);
        console.log(data.results.user_id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [taskData, setTaskData] = useState({
    assigned_user: userId,
    task_date: '',
    task_time: 0,
    is_completed: 0,
    time_zone: 0,
    task_msg: '',
  });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === 'task_time') {
  //     const [hours, minutes] = value.split(':');
  //     const timeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
  //     setTaskData({ ...taskData, task_time: timeInSeconds });
  //   } else if (name === 'assigned_user') {
  //     setTaskData({ ...taskData, assigned_user: value });
  //   } else {
  //     setTaskData({ ...taskData, [name]: value });
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'task_time') {
      const [hours, minutes] = value.split(':');
      const timeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
      setTaskData({ ...taskData, task_time: timeInSeconds });
    } else if (name === 'assigned_user') {
      setTaskData({ ...taskData, assigned_user: value });
    } else {
      setTaskData({ ...taskData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      const url = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${editTaskId}?company_id=${companyId}`;
      const headers = {
        'Authorization': `Bearer ${authorization}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios.put(url, editTaskData, { headers });
        const data = response.data;
        console.log(data);
        // Handle any further actions after successful editing

        // Clear edit mode and reset form values
        setEditMode(false);
        setEditTaskId(null);
        setEditTaskData({
          assigned_user: '',
          task_date: '',
          task_time: 0,
          is_completed: 0,
          time_zone: 0,
          task_msg: '',
        });
      } catch (error) {
        console.error(error);
        // Handle error scenarios
      }
    } else {
      const url = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${companyId}`;
      const headers = {
        'Authorization': `Bearer ${authorization}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios.post(url, taskData, { headers });
        const data = response.data;
        console.log(data);
        console.log(taskData.task_time);
        console.log(taskData.assigned_user);
        console.log(data.results.id)
        setTaskId(data.results.id);

        // Add submitted task to the list
        const submittedTask = {
          date: taskData.task_date,
          description: taskData.task_msg
        };
        setSubmittedTasks([...submittedTasks, submittedTask]);

        // Reset form values
        setTaskData({
          assigned_user: userId,
          task_date: '',
          task_time: 0,
          is_completed: 0,
          time_zone: 0,
          task_msg: '',
        });

        // Close the form toggle
        setShowForm(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleDelete = async () => {
    const url = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${taskId}?company_id=${companyId}`;
    const headers = {
      'Authorization': `Bearer ${authorization}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.delete(url, { headers });
      const data = response.data;
      console.log(data);
      // Handle any further actions after successful deletion
    } catch (error) {
      console.error(error);
      // Handle error scenarios
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskData({
      assigned_user: task.assigned_user,
      task_date: task.date,
      task_time: task.time,
      is_completed: task.is_completed,
      time_zone: task.time_zone,
      task_msg: task.description,
    });
    setEditMode(true);
    setShowForm(true);
  };
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return formattedTime;
  };
  

  return (
    <div>
      <h2>Add Task</h2>
      <div style={{ position: 'relative' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '500px',
            cursor: 'pointer',
            marginBottom: '10px',
            width: '330px',
            height: '40px'
          }}
          onClick={toggleFormVisibility}
        >
          <span style={{ marginRight: '10px' }}>
            <strong>Task</strong>
          </span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '260px' }}>
            {showForm ? '-' : '+'}
          </span>
        </button>
        {showForm && (
          <Container
            style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px', width: '330px', marginLeft: '500px', marginTop: '-10px', background: '#e6fff7', height: '330px' }}
          >
            <form onSubmit={handleSubmit}>
              <Row>
                <Row style={{ marginLeft: '10px', padding:'8px' }}>Task Description</Row>
                <Row style={{ marginLeft: '10px', padding:'8px' }}>
                  <input type="text" name="task_msg" value={editMode ? editTaskData.task_msg : taskData.task_msg} onChange={handleInputChange} style={{ width: '260px',}} />
                </Row>
              </Row>
              <Row>
                <Col style={{padding:'8px'}}>Date</Col>
                <Col style={{padding:'8px'}}>Time</Col>
                <Row>
                <Col><input type="date" name="task_date" value={editMode ? editTaskData.task_date : taskData.task_date} onChange={handleInputChange} /></Col>
                <Col><input type="time" name="task_time" value={editMode ? editTaskData.task_time : formatTime(taskData.task_time)} onChange={handleInputChange}/>
               </Col></Row>
              </Row>
              <Row>
                <Row style={{ marginLeft: '10px', padding:'8px' }}>Username</Row>
                <Row style={{ marginLeft: '10px', padding:'2px' }}><input type="text" name="assigned_user" value={editMode ? editTaskData.assigned_user : taskData.assigned_user} onChange={handleInputChange} style={{ width: '260px' }}/></Row>
              </Row>
              <Row style={{padding:'20px'}}>
              <Col><button type="button" onClick={handleDelete}>Delete</button></Col>
              <Col><button type="submit" style={{backgroundColor:'#18a12a', color:'#f7fcf8',width:'80px',height:'30px', marginLeft:'20px',}}>{editMode ? 'Save' : 'Save'}</button></Col>
              {/* {editMode && (<button type="button" onClick={() => setEditMode(false)}>Cancel</button>)} */}
              
              </Row>
            </form>
          </Container>
        )}
      </div>

      {submittedTasks.length > 0 && (
        <div style={{  padding: '10px', marginTop: '20px' }}>
          <ul style={{ listStyleType: 'none', padding: 0, width:'330px',marginLeft:'490px',marginTop: '-29px' }}>
            {submittedTasks.map((task, index) => (
              <li key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
                <div>{task.description}</div>
                <div>{task.date}</div>
                <button onClick={() => handleEdit(task)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
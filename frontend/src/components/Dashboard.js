import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../Dashboard.css';
import { Link, useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalViewOpen, setViewModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState({ title: '', description: '', _id: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const { title, description, _id } = currentTask;

        try {
            if (_id) {
                await axios.put(`http://localhost:4000/api/tasks/${_id}`, { title, description });
            } else {
                await axios.post('http://localhost:4000/api/tasks', { title, description });
            }
            setModalOpen(false);
            setCurrentTask({ title: '', description: '', _id: null });
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = async (data) => {
     //   e.preventDefault();
        const { title, description, _id } = data;

        try {
           
                await axios.put(`http://localhost:4000/api/tasks/${_id}`, { title, description });
            
            setModalOpen(false);
            setCurrentTask({ title: '', description: '', _id: null });
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEdit = (task) => {
        setCurrentTask(task);
        setModalOpen(true);
    };
    const handleView=(task)=>{
        setCurrentTask(task);
        setViewModalOpen(true);
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login',  { replace: true });
        }, 1000)
    }

    const handleDrop = async (result) => {
        console.log(result);
        debugger;
        if (!result.destination) return;
    
        const { source, destination } = result;
        const currentTask = tasks.filter(task => task.status === source.droppableId);
        const movedTask = currentTask[source.index];
    
        // Update task status based on the destination droppableId
        const updatedTask = { ...movedTask, status: destination.droppableId };
    
        try {
            // Update the task on the server
            await axios.put(`http://localhost:4000/api/tasks/${movedTask._id}`, updatedTask);
      fetchTasks()
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedTasks = filteredTasks.reduce((acc, task) => {
        if (!acc[task.status]) acc[task.status] = [];
        acc[task.status].push(task);
        return acc;
    }, { TODO: [], IN_PROGRESS: [], DONE: [] });

    return (
        <div>
            <Header onLogout={handleLogout} />
            <div className="dashboard">
                <form className="task-form" onSubmit={handleAddTask}>
                    <input
                        type="text"
                        className="task-input"
                        placeholder="Task Title"
                        value={currentTask.title}
                        onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                        required
                    />
                    <textarea
                        className="task-textarea"
                        placeholder="Task Description"
                        value={currentTask.description}
                        onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                        required
                    />
                    <div style={{  marginTop: '20px' }}>
                        <button type="submit" className="submit-button">Add Task</button>
                    </div>
                </form>
                <div className="controls">
                    <input
                        type="text"
                        className="search"
                        placeholder="Search Tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="sort" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="asc">Sort by Title Ascending</option>
                        <option value="desc">Sort by Title Descending</option>
                    </select>
                </div>
                <h2>Task List</h2>
                <DragDropContext onDragEnd={handleDrop}>
                    <div className="task-columns">
                        {Object.keys(groupedTasks).map((status) => (
                            <Droppable key={status} droppableId={status}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="task-column">
                                        <h3>{status}</h3>
                                        <ul className="task-list">
                                        {groupedTasks[status].map((task, index) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
        {(provided) => (
            <li 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="task-item bgclr"
            >
                <div>
                <strong>{task.title}</strong> <p>{task.description}</p> 
                </div>
                <div className="task-buttons">
                    <button onClick={() => handleEdit(task)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="delete-button">Delete</button>
                    <button onClick={() => handleView(task)} className="view-button">View</button>
                </div>
            </li>
        )}
    </Draggable>
))}

                                            {provided.placeholder}
                                        </ul>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={currentTask}
                    onSave={(data)=>{handleEditTask(data)}}
                />

             <ViewModal
                    isViewOpen={modalViewOpen}
                    onClose={() => setViewModalOpen(false)}
                    task={currentTask}
                  
                />
            </div>
        </div>
    );
};

const Header = ({ onLogout }) => (
    <header className="header">
        <h3>Task Dashboard</h3>
        <button className="logout-button" onClick={onLogout}>Logout</button>
    </header>
);

const Modal = ({ isOpen, onClose, task, onSave }) => {
    const [modalTask, setModalTask] = useState(task);

    useEffect(() => {
        setModalTask(task);
    }, [task]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(modalTask);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{modalTask._id ? 'Edit Task' : 'Add Task'}</h2>
                <input
                    type="text"
                    className="modal-input"
                    placeholder="Task Title"
                    value={modalTask.title}
                    onChange={(e) => setModalTask({ ...modalTask, title: e.target.value })}
                    required
                />
                <textarea
                    className="modal-textarea"
                    placeholder="Task Description"
                    value={modalTask.description}
                    onChange={(e) => setModalTask({ ...modalTask, description: e.target.value })}
                    required
                />
                <div className="modal-buttons">
                    <button onClick={onClose} className="modal-close-button">Close</button>
                    <button onClick={handleSave} className="modal-save-button">Save</button>
                </div>
            </div>
        </div>
    );
};


const ViewModal = ({ isViewOpen, onClose, task }) => {
    const [modalTask, setModalTask] = useState(task);

    useEffect(() => {
        setModalTask(task);
    }, [task]);

    if (!isViewOpen) return null;

    const handleSave = () => {

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>View Task Detail</h2>
                <hr></hr>
                <h3>    {modalTask.title}</h3>
               
                <p>    {modalTask.description}</p>
                <p>    {modalTask.createdAt}</p>
               
                  <div className="modal-buttons">
                    <button onClick={onClose} className="modal-close-button">Close</button>
                
                </div>
               
            </div>
            <ToastContainer/>
        </div>
    );
};
export default Dashboard;

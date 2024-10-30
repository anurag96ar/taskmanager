
const Task = require('../models/Task'); 

const createTask = async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
};

const getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
};


const updateTask =  async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}


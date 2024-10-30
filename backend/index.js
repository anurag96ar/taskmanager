const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());
connectDB()


app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
const Task = require('./models/Task'); 
// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));

app.post('/api/tasks', async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
});

app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// app.put('/api/tasks/:id', async (req, res) => {
//     const { title, description } = req.body;
//     const task = await Task.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
//     res.json(task);
// });
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
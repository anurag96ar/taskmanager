import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RefreshHandler from './RefreshHandler';

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const PrivateRoute = ({ element }) => {
      return isAuthenticated ? element : <Navigate to="/login" replace/>
    }
    return (
        <div>
            
        <Router>
       
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
              
                <Routes>
                    <Route path="/" element={<Navigate to='/login'/>} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
                    <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
                </Routes>
           
        </Router>
        </div>
    );
};

export default App;

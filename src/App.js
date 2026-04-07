import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import ManagerDashboard from './pages/managerpages/ManagerDashboard';
import WokerDashboard from './pages/workerPages/WokerDashboard';

function App() {
  return (
    <div className="App">
     
     
      
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/manager-dashboard' element={<ManagerDashboard />} />
          <Route path='/worker-dashboard' element={<WokerDashboard />} />
        </Routes>
        
      
   
      
    </div>
  );
}

export default App;

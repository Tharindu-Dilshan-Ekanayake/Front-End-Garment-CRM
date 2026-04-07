import { Route, Routes } from 'react-router-dom';
import './App.css';
import  { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import ManagerDashboard from './pages/managerpages/ManagerDashboard';
import WokerDashboard from './pages/workerPages/WokerDashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />
     
      
        <Routes>
          <Route path='/' element={<Login />} />

          <Route
            path='/admin-dashboard'
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='/manager-dashboard'
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path='/worker-dashboard'
            element={
              <ProtectedRoute allowedRoles={['WORKER']}>
                <WokerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        
      
   
      
    </div>
  );
}

export default App;

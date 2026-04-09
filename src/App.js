import { Route, Routes } from 'react-router-dom';
import './App.css';
import  { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import AdminUserManagement from './pages/adminPages/AdminUserManagement';
import AdminProductionManagement from './pages/adminPages/AdminProductionManagement';
import AdminInventoryManagement from './pages/adminPages/AdminInventoryManagement';
import ManagerDashboard from './pages/managerpages/ManagerDashboard';
import ManagerProduction from './pages/managerpages/ManagerProduction';
import ManagerInventory from './pages/managerpages/ManagerInventory';
import WokerDashboard from './pages/workerPages/WokerDashboard';
import WorkerProduction from './pages/workerPages/WorkerProduction';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/adminCompo/AdminLayout';
import ManagerLayout from './components/managerCompo/ManagerLayout';
import WorkerLayout from './components/workerCompo/WorkerLayout';


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
            path='/admin'
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='users' element={<AdminUserManagement />} />
            <Route path='production' element={<AdminProductionManagement />} />
            <Route path='inventory' element={<AdminInventoryManagement />} />
          </Route>

          <Route
            path='/manager'
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path='production' element={<ManagerProduction />} />
            <Route path='inventory' element={<ManagerInventory />} />
          </Route>

          <Route
            path='/worker'
            element={
              <ProtectedRoute allowedRoles={['WORKER']}>
                <WorkerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<WokerDashboard />} />
            <Route path='production/lead' element={<WorkerProduction />} />
            <Route path='production/member' element={<WorkerProduction />} />
          </Route>
        </Routes>
        
      
   
      
    </div>
  );
}

export default App;

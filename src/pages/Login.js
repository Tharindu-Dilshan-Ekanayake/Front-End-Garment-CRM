import React, { useState } from 'react'
import BoxComponent from '../components/BoxComponent';
import InputComponent from '../components/InputComponent';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {

    const navigate = useNavigate();
    const { login, loading, error } = useAuthStore();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    
    const handleSubmit = async () => {
        const role = await login(form);

        // navigate based on role
        if (role === 'ADMIN') {
            navigate('/admin');
        } else if (role === 'MANAGER') {
            navigate('/manager');
        } else if (role === 'WORKER') {
            navigate('/worker');
        }
    }
    return (
    <div className='flex items-center justify-center h-screen'>
      <BoxComponent title="Login">

        <InputComponent 
          label="Email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        <InputComponent 
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          onChange={handleChange}
        />

        <PrimaryButton 
          label={loading ? "Loading..." : "Login"}
          color="blue"
          onClick={handleSubmit}
        />

        {error && <p className="mt-2 text-red-500">{error}</p>}

      </BoxComponent>
    </div>
  )
}
import React, { useState } from 'react';
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
  };

  const handleSubmit = async () => {
    const role = await login(form);

    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'MANAGER') {
      navigate('/manager');
    } else if (role === 'WORKER') {
      navigate('/worker/production/lead');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] bg-opacity-80">
      <BoxComponent title="Sign in">
        <div className="space-y-4">
          <InputComponent
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />

          <InputComponent
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <PrimaryButton
            label={loading ? 'Signing in...' : 'Sign in'}
            color="blue"
            onClick={handleSubmit}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </BoxComponent>
    </div>
  );
}
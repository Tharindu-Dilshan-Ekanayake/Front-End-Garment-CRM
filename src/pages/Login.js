import React from 'react'
import BoxComponent from '../components/BoxComponent';
import InputComponent from '../components/InputComponent';
import PrimaryButton from '../components/PrimaryButton';

export default function Login() {
  return (
    <div>
       <div className='flex items-center justify-center h-screen'>
        
        <BoxComponent title="Login">
          <InputComponent 
          label="Email"
          name="email"
          placeholder="Enter your email"
        />
          <InputComponent 
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
          <PrimaryButton 
            label="Login"
            color="blue"
          />
        
        </BoxComponent>
      </div>  
    </div>
  )
}

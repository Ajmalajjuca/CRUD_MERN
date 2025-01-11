import { useEffect, useState } from 'react';
import { User, Mail, Phone, Lock, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFail, signInSuccess, signInStart, clearError } from '../redux/user/userSlice';
import axios from 'axios';
import Cookie from "js-cookie";
import React from 'react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [initialState, setInitialState] = useState("Log In");
  const { loading, error } = useSelector(state => state.user);
  const [formInput, setFormInput] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const toggleHandler = () => {
    setIsChecked(!isChecked);
    { isChecked ? setInitialState('Admin Login') : setInitialState('Log In') }
  }

    useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            dispatch(clearError());
        }, 3000); 

        return () => clearTimeout(timer);
    }
}, [error, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      let res;
      if (initialState === 'Sign Up') {
        res = await axios.post('http://localhost:3000/register', formInput);
      }
      else if (initialState === 'Admin Login') {
        res = await axios.post('http://localhost:3000/admin/adminlogin', formInput,{ withCredentials: true });
      }
      else {
        res = await axios.post('http://localhost:3000/login', formInput); 
      }
      console.log('Login successful:', res.data);

      dispatch(signInSuccess(res.data));
    

      {initialState === 'Admin Login' ? navigate('/admin/dashboard') :navigate('/dashboard');}
      
    } catch (error) {
      if (error.response) {
        dispatch(signInFail(error.response.data.message));
      } else if (error.request) {
        dispatch(signInFail('No response from server'));
      } else {
        dispatch(signInFail(error.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl p-8 border border-[#2c2c2c] shadow-lg">
        <div className='flex items-center justify-between '>

          <h2 className="text-2xl font-semibold text-white mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-[#ffd700] after:to-[#ffa500] after:rounded-lg">
            {initialState}
          </h2>{initialState === 'Admin Login' ? <input type="checkbox" className="toggle" checked={true} onChange={toggleHandler} /> : <input type="checkbox" className="toggle" checked={false} onChange={toggleHandler} />}

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {initialState === 'Sign Up' && (
            <div className="relative">
              <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                <User size={16} className="text-[#ffd700]" />
                Username
              </label>
              <input
                type="text"
                value={formInput.username}
                onChange={(e) => setFormInput({ ...formInput, username: e.target.value })}
                className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
                placeholder="Enter username"
              />
            </div>
          )}

          <div className="relative">
            <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
              <Mail size={16} className="text-[#ffd700]" />
              Email
            </label>
            <input
              type="email"
              value={formInput.email}
              onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
              className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
              placeholder="Enter email"
            />
          </div>

          {initialState === 'Sign Up' && (
            <div className="relative">
              <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                <Phone size={16} className="text-[#ffd700]" />
                Phone
              </label>
              <input
                type="tel"
                value={formInput.phone}
                onChange={(e) => setFormInput({ ...formInput, phone: e.target.value })}
                className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
                placeholder="Enter phone number"
              />
            </div>
          )}

          <div className="relative">
            <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
              <Lock size={16} className="text-[#ffd700]" />
              Password
            </label>
            <input
              type="password"
              value={formInput.password}
              onChange={(e) => setFormInput({ ...formInput, password: e.target.value })}
              className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#252525] to-[#1e1e1e] hover:from-[#ffd700] hover:to-[#ffa500] text-[#ffd700] hover:text-black font-medium py-3 px-6 rounded-xl border border-[#2c2c2c] transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              initialState
            )}
          </button>

            {initialState === 'Admin Login' ? (<></>):(
<div className="mt-4 text-center">
            {initialState === 'Sign Up' ? (
              <p className="text-sm text-[#d4d4d4]">
                Already have an account?
                <button
                  type="button"
                  onClick={() => setInitialState('Log In')}
                  className="ml-1 text-[#ffd700] hover:text-[#ffa500] transition-colors"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-sm text-[#d4d4d4]">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => setInitialState('Sign Up')}
                  className="ml-1 text-[#ffd700] hover:text-[#ffa500] transition-colors"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
            )}
          

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
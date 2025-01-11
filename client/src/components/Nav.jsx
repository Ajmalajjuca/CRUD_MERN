import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch,  } from 'react-redux';
import { logOut } from '../redux/user/userSlice';
import axios from 'axios';

const Nav = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user.user);
  const profileImagePath =`http://localhost:3000/${data.profileImage}`
  
  const LogOut = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      dispatch(logOut());
    } catch (error) {
      console.error('Error logging out', error);
      
    }
  }
  
  
  
  return (
    <div className="bg-[#161616]">
      <div className="navbar bg-[#1e1e1e] border-b border-[#2c2c2c] shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-[#ffd700]">
            daisyUI
          </a>
        </div>
        <div className="flex-none gap-4">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto bg-[#252525] border border-[#2c2c2c] rounded-lg px-4 py-2 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
            />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-[#252525]"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src={data.profileImage?profileImagePath:'https://i.postimg.cc/JzBWVhW4/my-avatar.png'}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg z-[1] mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link
                  to="/profile"
                  className="flex items-center justify-between text-[#d4d4d4] hover:bg-[#252525] hover:text-[#ffd700] transition-colors rounded-lg p-2"
                >
                  Profile
                  <span className="badge bg-gradient-to-r from-[#ffd700] to-[#ffa500] text-black rounded-lg">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <a className="text-[#d4d4d4] hover:bg-[#252525] hover:text-[#ffd700] transition-colors rounded-lg p-2">
                  Settings
                </a>
              </li>
              <li>
                <a className="text-[#d4d4d4] hover:bg-[#252525] hover:text-[#ffd700] transition-colors rounded-lg p-2" onClick={LogOut}> 
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;

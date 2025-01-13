import React, { useEffect, useMemo, useState } from 'react';
import { User, Search, Plus, Edit2, Trash2, Lock, Mail, Phone, Loader, X, Check, UserPlus, LoaderCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

import { useToast } from "@/hooks/use-toast"


import { useDispatch, useSelector } from 'react-redux';
import { clearError, fetchUsers, logOut } from '../redux/user/userSlice';
import { createUserStart, createUserSuccess, createUserFail, updateUserStart, updateUserSuccess, updateUserFail } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUsersLock, setLoadingUsersLock] = useState({});
  const [loadingUsersTrash, setLoadingUsersTrash] = useState({});
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState()
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);



  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    isAdmin: false
  });




  const dispatch = useDispatch()
  const { users, error, user, token } = useSelector((state) => state.user);
  const profileImagePath = `http://localhost:3000/${user?.profileImage}`

  const LogOut = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      dispatch(logOut());
    } catch (error) {
      console.error('Error logging out', error);

    }
  }

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  console.log("users>>", users);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handelStatus = async (id, status) => {
    try {
      setLoadingUsersLock((prevState) => ({
        ...prevState,
        [id]: true,
      }));
      const response = await axios.put(
        `http://localhost:3000/admin/updateUserStatus/${id}`,
        { status: status === 'active' ? 'blocked' : 'active' }, // Pass body data here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token sent in headers
          },
        }
      );
      console.log('User status updated successfully', response.data);
      dispatch(fetchUsers());

    } catch (error) {
      console.error('Error updating user status', error);

    } finally {
      setLoadingUsersLock((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    }
  };

  const handelDelete = async (id) => {
    try {
      setLoadingUsersTrash((prevState) => ({
        ...prevState,
        [id]: true,
      }));
      await axios.delete(`http://localhost:3000/admin/deleteUser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      dispatch(fetchUsers());

    } catch (error) {
      console.error('Error deleting user', error);
    }
    finally {
      setLoadingUsersTrash((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: '',
      isAdmin: user.isAdmin,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(createUserStart());
    try {
      const url = isEditMode
        ? `http://localhost:3000/admin/updateUser/${currentUser._id}`
        : 'http://localhost:3000/admin/addUser';
      const method = isEditMode ? 'PUT' : 'POST';

      const { data } = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });


      console.log('User updated successfully', data);
      setIsModalOpen(false);
      setCurrentUser(null);
      setIsEditMode(false);

      dispatch(fetchUsers());
      dispatch(createUserSuccess(data));
    } catch (error) {
      console.error('Error updating/creating user:', error);
      if (error.response) {
        dispatch(createUserFail(error.response.data.message || 'Something went wrong.'));
      } else if (error.request) {
        dispatch(createUserFail('No response from server'));
      } else {
        dispatch(createUserFail(error.message));
      }
    } finally {
      setLoading(false);
    }
  };








  const filteredUsers = useMemo(() => {
    return users?.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6">
      {/* Header */}

      <div className="max-w-7xl mx-auto bg-[#161616] rounded-2xl p-6 border border-[#2c2c2c] shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-[#FCBF5E] after:to-[#ffa500] after:rounded-lg">
            User Management
          </h1>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full md:w-64 bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-2 text-white focus:border-[#FCBF5E] focus:outline-none transition-colors pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-[#FCBF5E]" size={20} />
            </div>

            <button
              onClick={() => {
                setCurrentUser(null);
                setFormData({ username: '', email: '', phone: '', password: '', })
                setNewUser({ username: '', email: '', phone: '', password: '', });
                setIsModalOpen(true);
                setIsEditMode(false);
              }}
              className="bg-gradient-to-r from-[#252525] to-[#1e1e1e] hover:from-[#FCBF5E] hover:to-[#ffa500] text-[#FCBF5E] hover:text-black font-medium px-4 py-2 rounded-xl border border-[#2c2c2c] transition-all duration-300 flex items-center gap-2"
            >
              <UserPlus size={20} />
              Add User
            </button>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:bg-[#252525]"
              >
                <div className="w-10 rounded-full">

                  <img
                    alt="Profile"
                    src={user?.profileImage ? profileImagePath : 'https://i.postimg.cc/JzBWVhW4/my-avatar.png'}



                  />

                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg z-[1] mt-3 w-52 p-2 shadow-lg"
              >
                <li>

                  <Link
                    to="/admin/profile"
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

      {/* Users Table */}
      <div className="max-w-7xl mx-auto bg-[#161616] rounded-2xl border border-[#2c2c2c] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252525] border-b border-[#2c2c2c]">
              <tr>
                <th className="text-left text-[#d4d4d4] p-4">User</th>
                <th className="text-left text-[#d4d4d4] p-4">Contact</th>
                <th className="text-left text-[#d4d4d4] p-4">Status</th>
                <th className="text-left text-[#d4d4d4] p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c2c2c]">
              {filteredUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#383838] to-[#252525] flex items-center justify-center border border-[#2c2c2c]">
                        <div className="w-10 rounded-full">
                          <img
                            alt="Profile"
                            src={user?.profileImage ? `http://localhost:3000/${user.profileImage}` : 'https://i.postimg.cc/JzBWVhW4/my-avatar.png'}
                            className=" w-10 h-10 rounded-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user?.username}</div>
                        <div className="text-[#d4d4d4] text-sm">{user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#d4d4d4]">{user?.phone}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${user.status === 'active'
                      ? 'bg-[#252525] text-[#FCBF5E]'
                      : 'bg-[#ff000020] text-red-400'
                      } border border-[#2c2c2c]`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {

                          setNewUser(null);
                          setCurrentUser(user);
                          handleUpdate(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-[#252525] rounded-lg transition-colors text-[#FCBF5E]"
                      >
                        
                        <Edit2 size={18}/>
                      </button>

                      <AlertDialog>

                        <AlertDialogTrigger asChild>
                          <button
                            className="p-2 hover:bg-[#252525] rounded-lg transition-colors text-[#FCBF5E]"
                          >
                            {loadingUsersTrash[user._id]?(<LoaderCircle className="animate-spin text-[#FCBF5E]" size={24} />):<Trash2 size={18} /> }
                            
                          </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className='bg-gray-300, text-white bg-black border-[#FCBF5E]' >
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            {/* Cancel Button */}
                            <AlertDialogCancel asChild>
                              <button className="px-4 py-2 rounded-lg bg-gray-300 text-black">
                                Cancel
                              </button>
                            </AlertDialogCancel>
                            {/* Confirm Button */}
                            <AlertDialogAction asChild>
                              <button
                                onClick={() => handelDelete(user._id)}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white"
                              >
                                Confirm
                              </button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <button
                        onClick={() => {
                          handelStatus(user._id, user.status);

                        }}
                        className="p-2 hover:bg-[#252525] rounded-lg transition-colors text-[#FCBF5E]"
                      >
                        {loadingUsersLock[user._id] ? (<LoaderCircle className="animate-spin text-[#FCBF5E]" size={24} />
                        ) : (user.status === 'active' ? <Lock size={18} /> : <Check size={18} />)}
                      </button>


                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] rounded-2xl p-6 w-full max-w-md border border-[#2c2c2c]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {currentUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#d4d4d4] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                  <User size={16} className="text-[#FCBF5E]" />
                  Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-2 text-white focus:border-[#FCBF5E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                  <Mail size={16} className="text-[#FCBF5E]" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-2 text-white focus:border-[#FCBF5E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                  <Phone size={16} className="text-[#FCBF5E]" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-2 text-white focus:border-[#FCBF5E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2 mb-2">
                  <Lock size={16} className="text-[#FCBF5E]" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-2 text-white focus:border-[#FCBF5E] focus:outline-none"

                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#252525] to-[#1e1e1e] hover:from-[#FCBF5E] hover:to-[#ffa500] text-[#FCBF5E] hover:text-black font-medium py-2 px-4 rounded-xl border border-[#2c2c2c] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                {currentUser ? 'Save Changes' : 'Add User'}
              </button>
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
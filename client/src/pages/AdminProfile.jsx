import { useState } from 'react';
import { Camera, User, Lock, Save, Loader, LogOutIcon, Delete, DeleteIcon, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStart, updateSuccess, updateFail, deleteStart, deleteSuccess, deleteFail, logOut } from '../redux/user/userSlice';
import Cookie from "js-cookie";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const navigate = useNavigate();

  const data = useSelector((state) => state.user.user);


  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.user);


  const [formData, setFormData] = useState({
    userId: user?._id || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    profileImage: user?.profileImage

  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file,
      profileImage: URL.createObjectURL(file)
    }));
  };

  const handelDelete = async () => {
    try {
      dispatch(deleteStart());
      const res = await axios.post('http://localhost:3000/deleteProfile', { userId: formData.userId });
      console.log('Profile deleted successfully', res.data);
      dispatch(deleteSuccess(res.data));
      console.log("res>>", res.data);

      navigate('/login');

    } catch (error) {
      console.error('Error deleting profile', error);
      dispatch(deleteFail(error.message));


    }
  }

  const LogOut = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      dispatch(logOut());
    } catch (error) {
      console.error('Error logging out', error);

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const data = new FormData();
      data.append('userId', formData.userId); // Assuming user._id contains the user ID
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      if (formData.image) {
        data.append('image', formData.image);
      }


      const token = Cookie.get("access_token"); // Assuming 'userToken' is your cookie name
      console.log("token:", token);
      const res = await axios.post('http://localhost:3000/updateProfile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Profile updated successfully', res.data);
      const {isAdmin,user,tokens} = res.data;
      dispatch(updateSuccess(user, isAdmin, tokens));
      navigate('/admin/dashboard');
      
      

      // Handle success (e.g., show a success message, update the user state, etc.)
    } catch (error) {
      if (error.response) {
        dispatch(updateFail(error.response.data.message));
      } else if (error.request) {
        dispatch(updateFail('No response from server'));
      } else {
        dispatch(updateFail(error.message));
      }
    }
  };

  return (
    <div className="bg-[#1e1e1e] min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-[#161616] rounded-2xl p-8 border border-[#2c2c2c] shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-1 after:bg-gradient-to-r after:from-[#FCBF5E] after:to-[#ffa500] after:rounded-lg">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#383838] to-[#252525] flex items-center justify-center overflow-hidden border-2 border-[#2c2c2c]">
                <img src={data.profileImage ? `http://localhost:3000/${data.profileImage}` : 'https://i.postimg.cc/JzBWVhW4/my-avatar.png'}
                  alt="Profile" className="mt-4 w-32 h-32 rounded-full object-cover" />

              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-[#252525] rounded-full cursor-pointer border border-[#2c2c2c] hover:bg-[#303030] transition-colors">
                <Camera size={20} className="text-[#FCBF5E]" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Username Section */}
          <div className="space-y-2">
            <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2">
              <User size={16} className="text-[#FCBF5E]" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#FCBF5E] focus:outline-none transition-colors"
              placeholder="Enter new username"
            />
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2">
                <Lock size={16} className="text-[#FCBF5E]" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#FCBF5E] focus:outline-none transition-colors"
                placeholder="Your Email"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2">
                <Lock size={16} className="text-[#FCBF5E]" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#FCBF5E] focus:outline-none transition-colors"
                placeholder="Your Phone Number"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-[#d4d4d4] text-sm font-medium gap-2">
                <Lock size={16} className="text-[#FCBF5E]" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#252525] border border-[#2c2c2c] rounded-xl px-4 py-3 text-white focus:border-[#FCBF5E] focus:outline-none transition-colors"
                placeholder="Your Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#252525] to-[#1e1e1e] hover:from-[#FCBF5E] hover:to-[#ffa500] text-[#FCBF5E] hover:text-black font-medium py-3 px-6 rounded-xl border border-[#2c2c2c] transition-all duration-300 flex items-center justify-center gap-2"
          >{loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />} Save Changes


          </button>
          <div className='flex flex-row justify-between'>
            <p className='text-[#FCBF5E] hover:text-[#ffa500] items-center justify-center flex  gap-2' onClick={handelDelete}> <Trash size={20} /> Delete User</p>
            <p className='text-[#FCBF5E] hover:text-[#ffa500] flex items-center justify-center gap-2 ' onClick={LogOut}>  Log Out <  LogOutIcon size={18} /></p>

          </div>
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

export default AdminProfile;
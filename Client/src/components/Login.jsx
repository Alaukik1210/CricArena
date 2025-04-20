import axios from 'axios';
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import store from '@/redux/store';
import { Button } from 'react-scroll';
import { Loader2 } from 'lucide-react';
import { setUser } from '@/redux/userSlice';

const Login = () => {
   const [role, setRole] = useState("PLAYER");
   const [email,setEmail] = useState("");
   const [password,setPassword] = useState("");
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const {loading} = useSelector(store=>store.auth)
  // const {user} = useSelector(store=>auth.user);

   const changeEventHandler = (e) => {
    const { name, value } = e.target;
    switch(name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  }

   const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`,{email,password,role})

      console.log(res);
      if(res.data.success){
       dispatch(setUser(res.data.user))
        navigate('/')
      }
         
    } catch (error) {
      console.log(error)
    }finally{
     dispatch(setLoading(false));
    }
   }
  return (
    <div className="h-screen  bg-black flex items-center justify-center ">
      <div className="max-w-md w-full font-cabinet-extrabold p-6 bg-[#3d3d3d] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#FFD070] text-center mb-6">Login to CricArena</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email</label>
            <input
            name='email'
            value={email}
            onChange={changeEventHandler}
              type="email"
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none "
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={changeEventHandler}
              name='password'
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none "
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none"
            >
              <option value="PLAYER">Player</option>
              <option value="OWNER">Ground Owner</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            {
              loading?<Button className='w-full bg-[#FFD070] text-black font-bold py-2 px-4 rounded h-10 flex items-center justify-center gap-2'> <Loader2 className='text-center   animate-spin'/> Please wait</Button> : <button
            
              type="submit"
              className="w-full bg-[#FFD070]  text-black font-bold py-2 px-4 rounded group relative h-10  overflow-hidden  text-md  border-gold  text-center"
            >
              Login
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
            }
           
          </div>
        </form>
        <p className="text-center text-white mt-4">
          Don’t have an account?{' '}
          <button  onClick={() => navigate(`/signup`)} className="text-[#FFD070] hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

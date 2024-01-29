import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerApi } from '../../api/auth.service';

const SignUp = () => {
   const navigate = useNavigate();

   const [name, setName] = useState('');
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState(''); 
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');


   const signUpClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const id = toast.loading('Signing up...');
      registerApi(
         {
            name,
            username,
            email,
            password,
            confirmPassword
         },
         (isOk, result) => {
            if (isOk) {
               toast.update(id, {
                  render: 'Sign Up was successful',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
               });
               navigate('/sign-in');
            } else {
               toast.update(id, {
                  render: result.response.data.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
               });
               // toast.error(result.response.data.message);
               // console.log(result);
            }
         },
      );
   };

   return (
      <div className="container">
         <form className="pt-3 col-sm-8 col-md-6 col-lg-4">
            <div className="mb-3">
               <label className="form-label">Name</label>
               <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => {
                     setName(e.target.value);
                  }}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Username</label>
               <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={e => {
                     setUsername(e.target.value);
                  }}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Email</label>
               <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={e => {
                     setEmail(e.target.value);
                  }}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Password</label>
               <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={password}
                  onChange={e => {
                     setPassword(e.target.value);
                  }}
               />
            </div>
            <div className="mb-3">
               <label className="form-label">Confirm Password</label>
               <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={confirmPassword}
                  onChange={e => {
                     setConfirmPassword(e.target.value);
                  }}
               />
            </div>
            <button
               type="submit"
               className="btn btn-primary w-100"
               onClick={e => {
                  signUpClick(e);
               }}
            >
               Sign Up
            </button>
         </form>
      </div>
   );
};

export default SignUp;

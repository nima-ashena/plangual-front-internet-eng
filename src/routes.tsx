import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { getUserApi } from './api/auth.service';
// import VocabDict from './pages/vocabs/VocabDict-old';
import Home from './pages/Home';
import Header from './components/Header';
import SignIn from './pages/auth/SignIn';
import Test from './pages/test/Test';
import Setting from './pages/auth/Setting';
import Days from './pages/days/Days';
import Tasks from './pages/tasks/Tasks';
import { UserContext } from './context/common';
import SignUp from './pages/auth/SignUp';
import Tickets from './pages/tickets/Tickets';

const RoutesHandle = () => {
   useEffect(() => {}, []);

   return (
      <>
         <Header />
         <PublicRoute>
            <Routes>
               <Route path="/sign-in" element={<SignIn />} />
               <Route path="/sign-up" element={<SignUp />} />
            </Routes>
         </PublicRoute>
         <PrivateRoute>
            <Routes>
               <Route path="/days/:dayBarcode" element={<Days />} />
               <Route path="/tasks" element={<Tasks />} />
               <Route path="/" element={<Home />} />
               <Route path="/user/setting" element={<Setting />} />
               <Route path="/pulses" element={<Tickets />} />
               <Route path="/test" element={<Test />} />
            </Routes>
         </PrivateRoute>
      </>
   );
};

const PrivateRoute = (props: any) => {
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem('AuthToken')) {
         navigate('/sign-in');
      } else {
         getUserApi((isOk: boolean, result) => {
            if (isOk) {
               // navigate('/');
            } else {
               navigate('/sign-in');
            }
         });
      }
   }, []);

   return <>{props.children}</>;
};
const PublicRoute = (props: any) => {
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem('AuthToken')) {
         navigate('/sign-in');
      } else {
         getUserApi((isOk: boolean) => {
            if (isOk) {
               // navigate('/');
            } else {
               navigate('/sign-in');
            }
         });
      }
   }, []);

   return <>{props.children}</>;
};

export default RoutesHandle;

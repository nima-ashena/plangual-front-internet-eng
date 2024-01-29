import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';
import Header from './components/Header';
import RoutesHandle from './routes';
import { UserContext } from './context/common';
import { useEffect, useState } from 'react';
import { getUserApi, getUsersApi } from './api/auth.service';
import { getToday, shamsiToGregorianN } from './utils/convertor';
import { DateObject } from 'react-multi-date-picker';

function App() {
   // console.log(process.env.REACT_APP_API_BASE_URL);
   const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
   const [query, setQuery] = useState<string>('');
   const [paginationPage, setPaginationPage] = useState<number>(1);
   const [sort, setSort] = useState<string>('-created_at');
   const [type, setType] = useState<string>('');
   const [users, setUsers] = useState([]);
   const [userC, setUserC] = useState<number>(0);

   // const todayDate = getToday(new DateObject(new Date()));
   const todayDate = getToday(new DateObject());

   useEffect(() => {
      getUserApi((isOk: boolean, result) => {
         if (isOk) {
            setIsUserLogin(true);
         } else {
            setIsUserLogin(false);
         }
      });
      getUsersApi((isOk, result) => {
         if (isOk) {
            setUsers(result.users);
         }
      });
   }, []);

   return (
      <>
         <UserContext.Provider
            value={{
               users,
               userC,
               setUserC,
               setUsers,
               isUserLogin,
               setIsUserLogin,
               query,
               setQuery,
               paginationPage,
               setPaginationPage,
               sort,
               setSort,
               type,
               setType,
               todayDate,
            }}
         >
            <RoutesHandle />
            <ToastContainer />
         </UserContext.Provider>
      </>
   );
}

export default App;


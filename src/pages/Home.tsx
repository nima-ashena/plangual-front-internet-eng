import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/common';
import { useNavigate } from 'react-router-dom';

const Home = () => {

   const {todayDate} = useContext(UserContext);

   const navigate = useNavigate();

   useEffect(() => {
      navigate(`/days/${todayDate.shamsiDBBarcode}`)
   }, [])

   return (
      <div className="container py-3">
         <div className="alert alert-primary" role="alert">
            Welcome to Plangual!
         </div>
         <div className="alert alert-info" role="alert">
            Use sidebar and explore application :-))))
         </div>
      </div>
   );
};

export default Home;

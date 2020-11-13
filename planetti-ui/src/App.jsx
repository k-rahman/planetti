/* Packages
------------*/
import React, { Component, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

/* Components
--------------*/
import NotLogged from './components/NotLogged';
import Signin from './components/Signin';
import Footer from './components/common/Footer';
import UserPage from './components/Userpage';

/* Styles
----------*/
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [ loggedIn, setLoggedIn ] = useState(null);

  useEffect(() => {
      const user = localStorage.getItem('userId');

      setLoggedIn(user);

  }, [setLoggedIn]);
  
  const handleSignin = () => {
      const user = localStorage.getItem('userId');

      setLoggedIn(user);
  };

  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover={false}
        pauseOnFocusLose={false}
        closeButton={false}
        limit={1}
      />
      <Switch>
        <Route path='/login' render={routeProps =>
          <Signin signin={handleSignin} {...routeProps} />} />
        <Route path='/' render={() => {
          if (!loggedIn) return <NotLogged />
          return <UserPage/>
        }} />
      </Switch>
      <Route path='*' render={routerProps =>
        <Footer {...routerProps} />} />
    </>
  )
}

export default App;

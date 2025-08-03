import { Route, Routes, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from "./pages/OnboardingPage.jsx";

import useAuth from './hooks/useAuth.js';
import  Layout  from './components/Layout.jsx';
import PageLoader from './components/PageLoader.jsx';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { authUser, isInitialized, checkAuthUser } = useAuth();
  const { theme,setTheme } = useThemeStore();
  
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (!isInitialized) {
    return <div className='min-h-screen' data-theme={theme}>
      <PageLoader/>
    </div>;
  }

  return (
    <div className='min-h-screen' data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><HomePage/></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding" }/>)}/>
        <Route path='/signup' element={!isAuthenticated ? <SignupPage onSignupSuccess={checkAuthUser} /> : <Navigate to="/" />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage onLoginSuccess={checkAuthUser} /> : <Navigate to="/" />} />
        <Route path='/notifications' element={isAuthenticated && isOnboarded?(<Layout showSidebar={true}><NotificationsPage /></Layout> ) :(<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/> )}/>
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (<CallPage />) :( <Navigate to={!isAuthenticated ? '/login' : "/onboarding" }/> )} />
        <Route path='/chat/:id' element={isAuthenticated && isOnboarded? (<Layout showSidebar={false}><ChatPage /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/> )} />
        <Route path='/onboarding' element={isAuthenticated ?(!isOnboarded ?(<OnboardingPage checkAuthUser={checkAuthUser} /> ) : (<Navigate to="/"/>)) : (<Navigate to="/login"/>)} />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios.js';

const useAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuthUser = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      console.log("/me response",res)
      setAuthUser(res.data.user);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  return {
    authUser,
    setAuthUser,
    isInitialized,
    checkAuthUser
  };
};

export default useAuth;
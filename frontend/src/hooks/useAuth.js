import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { setAuth } from 'utils/setAuth';
import instance from 'utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const {
        data: { token },
      } = await instance.post('/auth/login', data);
      setUser(token);
      setAuth(token);
      navigate('/home', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUser(null);
    setAuth();
    navigate('/', { replace: true });
  };

  const register = async (data) => {
    try {
      const {
        data: { token },
      } = await instance.post('/auth/register', data);
      setUser(token);
      navigate('/home', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

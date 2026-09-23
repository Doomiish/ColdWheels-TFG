import { useEffect, useState } from 'react';
import * as authService from '../services/authService.js';
import AuthContext from './AuthContextValue.js';

const TOKEN_KEY = 'coldwheels.accessToken';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    sessionStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(sessionStorage.getItem(TOKEN_KEY)),
  );

  useEffect(() => {
    let active = true;
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    if (!storedToken)
      return () => {
        active = false;
      };

    authService
      .getCurrentUser(storedToken)
      .then((currentUser) => active && setUser(currentUser))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        if (active) setAccessToken(null);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  async function signIn(credentials) {
    const result = await authService.login(credentials);
    sessionStorage.setItem(TOKEN_KEY, result.access_token);
    setAccessToken(result.access_token);
    setUser(result.user);
    return result.user;
  }

  async function signUp(userData) {
    return authService.register(userData);
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }

  async function changeEmail(values) {
    const updatedUser = await authService.updateEmail(accessToken, values);
    setUser(updatedUser);
    return updatedUser;
  }

  async function changePassword(values) {
    const updatedUser = await authService.updatePassword(accessToken, values);
    setUser(updatedUser);
    return updatedUser;
  }

  const value = {
    accessToken,
    user,
    loading,
    isAuthenticated: Boolean(user && accessToken),
    signIn,
    signUp,
    signOut,
    changeEmail,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

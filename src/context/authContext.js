// Auth Context for react

import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider ({ children }) {
  const accessToken = localStorage.getItem('accessToken');
  const [access, setAccess] = useState(JSON.parse(accessToken) || {});

  const memo = useMemo(() => ({ access, setAccess: setAccessToken(setAccess), logOut: removeAccessToken(setAccess) }), [access]);
  return <AuthContext.Provider value={memo}>{
    children
  }</AuthContext.Provider>;
};

function setAccessToken (setter) {
  return (accesData) => {
    localStorage.setItem('accessToken', JSON.stringify(accesData));
    setter(accesData);
  }
}

function removeAccessToken (setter) {
  return () => {
    localStorage.removeItem('accessToken');
    setter({});
  }
}
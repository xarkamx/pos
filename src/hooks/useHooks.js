import { useReducer } from "react";

export function useCState (initState = {}) {
  return useReducer((prev, next) => ({ ...prev, ...next }), initState);
}

// Hook made with the help of copilot
export function useArray (initArr = []) {
  return useReducer((prev, next) => {
    const arr = [...prev, next];
    return arr.filter(item => item !== undefined);
  }, initArr);
}


export function useHistory () {
  return (path, content = {}) =>
    redirect(path, content);
}
export function useTimeOutHistory () {
  const history = useHistory();
  return (path, time) => {
    setTimeout(() => {
      history(path);
    }, time);
  };
}

export function redirect (path, query = {}) {
  window.location.href = `${path}?${new URLSearchParams(query).toString()}`;
}
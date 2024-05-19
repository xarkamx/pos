import { useEffect, useReducer, useRef } from "react";

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

export function useQueryString () {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(searchParams.entries());
}


// Hook made with the help of copilot use with caution
export function useMountEffect (callback) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      callback();
    }
  }, [callback]);
}
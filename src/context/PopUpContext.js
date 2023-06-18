import { createContext, useContext, useMemo, useState } from 'react';

const PopUp = createContext({});

export function PopUpContextProvider ({ children }) {
  const [popUp, setPopUp] = useState({});
  const [open, setOpen] = useState(false);
  const val = useMemo(() => ({
    popUp,
    popUpAlert (status, message, onAccept) {
      console.log(status, message, onAccept);
      setPopUp({ status, message, onAccept });
      setOpen(true);
    },
    open,
    toggle () {
      setOpen(!open);
    }
  }), [popUp, setPopUp, open, setOpen]);
  return <PopUp.Provider value={val}>{children}</PopUp.Provider>;
}

export function usePopUp () {
  return useContext(PopUp);
}
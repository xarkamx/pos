// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4GjDQL5H1D3atELRTRRIYKi6VQTUFajo",
  authDomain: "hgpos-f097c.firebaseapp.com",
  projectId: "hgpos-f097c",
  storageBucket: "hgpos-f097c.appspot.com",
  messagingSenderId: "194976031038",
  appId: "1:194976031038:web:e30b2d32600509257c4c6f",
  measurementId: "G-RX3YDWT02S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});
export function requestForToken () {
  const vapidKey = "BDjG9xKmUINlWV_A4xqKPq1YEqez8V6wyZeePK_eDgoMLXLfnrR_jYAPldJsq5RoKi7FkdCFLWeApxYGhOHmbsI"
  return getToken(messaging, {
    vapidKey
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log("No registration token available. Request permission to generate one.");
        // shows on the UI that permission is required 
      }
    })
}

export function requestNotificationPermissions () {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      console.log(permission)
      // TODO(developer): Retrieve a registration token for use with FCM.
      // ...
      // requestForToken()
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}

export const onMessageListener = () => {
  console.log('onMessageListener')
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
  });
}
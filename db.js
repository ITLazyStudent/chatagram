// we import this to be able to use the firebase database
import firebase from 'firebase'
import 'firebase/firestore'


  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyB_O1VJGjU3P-e2GAeUVwmYj2RI8LMmfYA",
    authDomain: "chatapp-9b3de.firebaseapp.com",
    databaseURL: "https://chatapp-9b3de.firebaseio.com",
    projectId: "chatapp-9b3de",
    storageBucket: "chatapp-9b3de.appspot.com",
    messagingSenderId: "1034015552235"
  };
  // const config = {
  //   apiKey: "AIzaSyC7kIJ7T1sLRWYT8yhirrLOuEw-5MSEVg4",
  //   authDomain: "cp3700-f5264.firebaseapp.com",
  //   databaseURL: "https://cp3700-f5264.firebaseio.com",
  //   projectId: "cp3700-f5264",
  //   storageBucket: "cp3700-f5264.appspot.com",
  //   messagingSenderId: "143283342395"
  //   };
  firebase.initializeApp(config);

  // to initialize the db
  // Initialize Cloud Firestore through Firebase
  const db = firebase.firestore();

  // i need to add this line to prevent the app from breaking
  // Disable deprecated features
  db.settings({
    timestampsInSnapshots: true
  });

  export default db
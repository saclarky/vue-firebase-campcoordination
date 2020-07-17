import firebase from 'firebase'

// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyCbbI_OqyjwkXt42BGNtgia_BgccqTSJiQ",
    authDomain: "camp-pack-list.firebaseapp.com",
    databaseURL: "https://camp-pack-list.firebaseio.com",
    projectId: "camp-pack-list",
    storageBucket: "camp-pack-list.appspot.com",
    messagingSenderId: "778501407382",
    appId: "1:778501407382:web:10954e1d4b955f1293b8b7",
    measurementId: "G-FG1NJ5MLZ7"
  };
  console.log('initialize firebase from config file')
  firebase.initializeApp(config)
  
  // export const db = firebase.firestore()
  
  // Export types that exists in Firestore
  // This is not always necessary, but it's used in other examples
  const { TimeStamp, GeoPoint } = firebase.firestore
  export { TimeStamp, GeoPoint }
  
  // firebase utils
  const db = firebase.firestore()
  const auth = firebase.auth()
  const currentUser = auth.currentUser
  
  // firebase collections
  // const usersCollection = db.collection('users')
  // const items = db.collection('items')
  
  export {
    db,
    auth,
    currentUser
    // usersCollection
  }
  
  // if using Firebase JS SDK < 5.8.0
  // db.settings({ timestampsInSnapshots: true })
  
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'


const firebaseConfig = {
    apiKey: "AIzaSyCXQqP5l57-mgVfAIJe64q0slN1-08QTfs",
    authDomain: "clevereats-985b8.firebaseapp.com",
    databaseURL: "https://clevereats-985b8-default-rtdb.firebaseio.com",
    projectId: "clevereats-985b8",
    storageBucket: "clevereats-985b8.appspot.com",
    messagingSenderId: "1029962582312",
    appId: "1:1029962582312:web:191953e9cd93d6d9b0a81d",
    measurementId: "G-4FLC6VXTJ1"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export {firebase};
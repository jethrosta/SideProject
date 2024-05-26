import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAowfeCOQKFwPQy_6SRwYmgJhUSqmcrHSw",
    authDomain: "smartaquarium-dda03.firebaseapp.com",
    databaseURL: "https://smartaquarium-dda03-default-rtdb.firebaseio.com",
    projectId: "smartaquarium-dda03",
    storageBucket: "smartaquarium-dda03.appspot.com",
    messagingSenderId: "356903020158",
    appId: "1:356903020158:web:444bb39ec3aaee1f60da2f",
    measurementId: "G-L1CSQ8XCJ4"
};

const app = initializeApp(firebaseConfig);

let auth;
let attempts = 0;
(async () => {
  auth = await getAuth(app);

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (attempts >= 3) {
      alert("Too many failed attempts. Please wait 30 seconds before trying again.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user.email);

        // Reset attempts counter
        attempts = 0;

        // Redirect to SmartAqv1.html
        window.location.href = 'SmartAqv1.html';

      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error('Login error:', errorMessage);
        alert("Wrong Password or Email");

        // Increment attempts counter
        attempts++;

        // Lock out user for 30 seconds
        setTimeout(() => {
          attempts = 0;
        }, 30000);
      });
  });
})();
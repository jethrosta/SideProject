// Initialize Firebase with your config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyDfwPxwqS1jpxERlxMU8CV_3YD14A3uDeE",
    authDomain: "smartaquariumv1.firebaseapp.com",
    databaseURL: "https://smartaquariumv1-default-rtdb.firebaseio.com",
    projectId: "smartaquariumv1",
    storageBucket: "smartaquariumv1.appspot.com",
    messagingSenderId: "279298265608",
    appId: "1:279298265608:web:0b26e4205e7bf391d237bd",
    measurementId: "G-CSEG4CLTE2"
  };

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database(); // Initialize the database variable

  const datetimepicker = document.querySelector('.datetimepicker');
  const timeList = document.getElementById('time-list');
  const submitButton = document.querySelector('.submit-button');
  const turnOnServo = document.getElementById('turnOnServo');
  const turnOffServo = document.getElementById('turnOffServo');
  let timeCount = 1;
  
  datetimepicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-time')) {
      addTimeInput();
    } else if (e.target.classList.contains('remove-time')) {
      removeTimeInput(e.target);
    }
  });
  
  submitButton.addEventListener('click', () => {
    const times = [];
    const timeInputs = datetimepicker.querySelectorAll('input[type="time"]');
    timeInputs.forEach((input) => {
      times.push(input.value);
    });
    console.log('New schedule:', times);
    updateServoSchedule(times); // Update Servo schedule in Firebase
    updateTimeList(times); // Update time list
  });
  
  turnOnServo.addEventListener('click', () => {
    // Turn on the Servo
    database.ref('Servo/state').set(1);
    console.log("Servo turn on");
  });
  
  turnOffServo.addEventListener('click', () => {
    // Turn off the Servo
    database.ref('Servo/state').set(0);
    console.log("Servo turn off");
  });
  
  function addTimeInput() {
    timeCount++;
    const timePicker = document.createElement('div');
    timePicker.className = 'time-picker';
    timePicker.innerHTML = `
      <input type="time" id="time${timeCount}" value="08:00">
      <label for="time${timeCount}">Time ${timeCount}</label>
      <button class="remove-time" aria-label="Remove time">-</button>
    `;
    datetimepicker.insertBefore(timePicker, datetimepicker.querySelector('.add-time'));
  }
  
  function removeTimeInput(removeButton) {
    const timePicker = removeButton.parentNode;
    const timeInputs = datetimepicker.querySelectorAll('input[type="time"]');
    timeInputs.forEach((input, index) => {
      if (input.id === timePicker.querySelector('input').id) {
        datetimepicker.removeChild(timePicker);
        timeCount--;
      } else {
        timePicker.querySelector('label').textContent = `Time ${index + 1}`;
        input.id = `time${index + 1}`;
      }
    });
  }
  
  function updateTimeList(times) {
    timeList.innerHTML = '';
    times.forEach((time, index) => {
      const timeListItem = document.createElement('li');
      timeListItem.textContent = `Time ${index + 1}: ${time}`;
      timeList.appendChild(timeListItem);
    });
  }
  
  function updateServoSchedule(times) {
    // Update Servo schedule in Firebase
    database.ref('Servo/schedule').set(times)
      .then(() => {
        console.log('Servo schedule updated:', times);
      })
      .catch((error) => {
        console.error("Error updating Servo schedule:", error);
      });
  }
  
  function checkAndUpdateServoStatus() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours().toString().padStart(2, '0');
    const currentMinute = currentDate.getMinutes().toString().padStart(2, '0');
    const currentTime = currentHour + ':' + currentMinute;
    console.log('Current Time:', currentTime);
  
    database.ref('Servo/schedule').once('value', (snapshot) => {
      const schedule = snapshot.val();
      if (schedule && schedule.includes(currentTime)) {
        database.ref('Servo/state').set(1); // Turn on Servo if current time matches schedule
        console.log('Servo state changed to 1');
        // After a delay, set Servo state back to 0
        setTimeout(() => {
          database.ref('Servo/state').set(0);
          console.log('Servo state changed to 0 after delay');
        }, 5000); // Change 5000 to the desired delay in milliseconds
      } else {
        database.ref('Servo/state').set(0); // Turn off Servo otherwise
      }
    });
  }
  
  function startRTC() {
    // Set up a reference to store the current time in Firebase
    const rtcRef = database.ref('rtc/currentTime');
  
    // Update the current time value in Firebase when it matches user input time
    setInterval(() => {
      const currentDate = new Date();
      const currentHour = currentDate.getHours().toString().padStart(2, '0');
      const currentMinute = currentDate.getMinutes().toString().padStart(2, '0');
      const currentTime = currentHour + ':' + currentMinute;
  
      // Get the user input times
      const times = [];
      const timeInputs = datetimepicker.querySelectorAll('input[type="time"]');
      timeInputs.forEach((input) => {
        times.push(input.value);
      });
  
      // Check if the current time matches any of the user input times
      if (times.includes(currentTime)) {
        rtcRef.set(currentTime); // Update RTC time in Firebase
      }
    }, 1000); // Update every second
  
    // Listen for changes to the current time value in Firebase
    rtcRef.on('value', () => {
      checkAndUpdateServoStatus(); // Check and update Servo status whenever RTC clock value changes
    });
  }
  
  
  // Start the Real-Time Clock
  startRTC();



#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Servo.h>

const char* ssid =  "JOY HOME";
const char* password = "sudahganti";

// Define the Firebase API key
#define API_KEY "AIzaSyDfwPxwqS1jpxERlxMU8CV_3YD14A3uDeE"

// Define the RTDB URL -> 
#define DATABASE_URL "https://smartaquariumv1-default-rtdb.firebaseio.com/"

// User email and password
#define USER_EMAIL "feiveljethroezhekiel@gmail.com"
#define USER_PASSWORD "Jethro30_123"


// Define Firebase Data Object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMills = 0;
Servo servo;

void setup() {
  servo.attach(D4);
  
  Serial.begin(115200);
  // Connect to access point
  Serial.println("Connecting");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED){
    delay(1000);
    Serial.print(".");
  }
  // Print our local IP 
  Serial.print("Connected!\n");
  Serial.print("My IP Address: ");
  Serial.print(WiFi.localIP());

  // Assign the API Key (required)
  config.api_key = API_KEY;

  // Assign the user sign in credentials
  //Serial.println("Masuk autentifikasi");
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  
  // Assign the RTDB URL (required)
  //Serial.println("Masuk database");
  config.database_url = DATABASE_URL;

  // Comment or pass false value when wifi reconnection will control by your code or third party
  Firebase.reconnectWiFi(true);
  fbdo.setBSSLBufferSize(4096,1024);
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);
  config.timeout.serverResponse = 10 * 1000;
  //Serial.println("Selesai setup");
  
}

void loop() {
  // Put your main code here, to run repeatedly:
  //  Serial.print("Masuk loop\n");
  if(Firebase.ready() && (millis() - sendDataPrevMills > 1000 || sendDataPrevMills == 0)){
    sendDataPrevMills = millis();
     //Serial.print("masuk ready\n");

    int servoPosition;
    // RTDB = Real Time Database
    if(Firebase.RTDB.getInt(&fbdo, "/Servo/state", &servoPosition)){
      if (servoPosition == 1){
        servo.write(180);
      }else{
        servo.write(90);
      }
      
      //Serial.print("success\n");
    } else {
      Serial.println(fbdo.errorReason().c_str());
    }
  }
}

// import firebase from 'firebase/app';
import 'firebase/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

export class NotificationPushService {
    // private messaging = getMessaging();

    
    

    constructor() {        
        
    }

    async getNotificationSubscription(){

        const firebaseConfig = {
            apiKey: "AIzaSyBUEd-cLbx9kCIs9sPoIo5r7uYis5q8xkQ",
            authDomain: "push-papaya-com-pe.firebaseapp.com",
            projectId: "push-papaya-com-pe",
            storageBucket: "push-papaya-com-pe.appspot.com",
            messagingSenderId: "1022258914393",
            appId: "1:1022258914393:web:38adedcf593752c5943d48"
        };

        

        
        // this.messaging = getMessaging(app);
        


        


        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                
                const app = initializeApp(firebaseConfig);
                const messaging = getMessaging(app);
                getToken(messaging, { vapidKey: 'BJMAry6ULaqwXQGfKBUcvMeeyfy9wbHFPq37-0GpFmS8Tn22r6XfFWbxOGXqQ3NnX8QX6UuzKB08lk9739fYUHo' }).then((currentToken) => {
                    if (currentToken) {
                        console.log('¿currentToken', currentToken);
                        return currentToken;
                    } else {
                        // Show permission request UI
                        console.log('No registration token available. Request permission to generate one.');
                        return null;
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    return null;
                });

            }
            else {
                console.log('Unable to get permission to notify.');
            }})
    }
}
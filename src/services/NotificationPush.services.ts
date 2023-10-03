// import firebase from 'firebase/app';
import 'firebase/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';

import { registerSW } from 'virtual:pwa-register'


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
        


        


        Notification.requestPermission().then(async(permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // const { registerSW } = await import('virtual:pwa-register')
                const dataPushSuscription = {
                    userVisibleOnly: true,
                    applicationServerKey: this.urlB64ToUint8Array(PUBLIC_VAPID_PUBLIC_KEY),                   
                }
                registerSW({
                    async onRegistered(r) {                        
                        let sub = await r.pushManager.getSubscription();
                        if (!sub) {
                            sub = await r.pushManager.subscribe(dataPushSuscription);
                        }
                        console.log(sub);

                    },
                })            

            }
            else {
                console.log('Unable to get permission to notify.');
            }})
    }

    urlB64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}
// import firebase from 'firebase/app';
// import 'firebase/messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

export class NotificationPushService {
    private messaging: any;

    constructor() {
        // Inicializa Firebase con tu configuración
        const firebaseConfig = {
            apiKey: "AIzaSyBUEd-cLbx9kCIs9sPoIo5r7uYis5q8xkQ",
            authDomain: "push-papaya-com-pe.firebaseapp.com",
            projectId: "push-papaya-com-pe",
            storageBucket: "push-papaya-com-pe.appspot.com",
            messagingSenderId: "1022258914393",
            appId: "1:1022258914393:web:38adedcf593752c5943d48"
        };

        const app = initializeApp(firebaseConfig);
        this.messaging = getMessaging(app);
    }

    async getNotificationSubscription(): Promise<string | null> {
        try {
            // const currentToken = await this.messaging.getToken();
            const currentToken = await getToken(this.messaging);
            if (currentToken) {
                return currentToken;
            } else {
                console.warn('No se encontró un token de notificación.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener la suscripción de notificaciones:', error);
            return null;
        }
    }
}
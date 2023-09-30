import io from 'socket.io-client';
import { PUBLIC_URL_SERVER_SOCKET } from "$env/static/public";

const PUBLIC_SOCKET_SERVER_URL = PUBLIC_URL_SERVER_SOCKET

type EventCallback = (...args: any[]) => void;

export class SocketClient {
    private static instance: SocketClient | null = null;
    // private socket: SocketIOClient.Socket;
    private socket: any;
    private eventListeners: Map<string, EventCallback[]> = new Map<string, EventCallback[]>();

    constructor(url: string, query: any) {
        this.socket = io(url, {            
            query
        });

        this.socket.on("connect", () => this.connect);
        this.socket.on("disconnect", this.onDisconnect);
    }

    public static initSocket(idrepartidor: number = 0): SocketClient {
        // idrepartidor = idrepartidor != 0 ? idrepartidor : getValueToken('usuario').idrepartidor 
        const query = {
            idrepartidor: idrepartidor,
            isFromApp: 1,
            isRepartidor: true,
            firts_socketid: ''
        }
         
        const socketServerUrl = PUBLIC_SOCKET_SERVER_URL
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient(socketServerUrl, query);
        }        

        return SocketClient.instance;
    }

    public static getInstance(): any {        
        return SocketClient.instance ;
    }

    private onConnect = () => {        
        console.log("Connected to Socket");
    };

    private onDisconnect = () => {        
        console.log("Disconnected from Socket");
    };

    public sendMessage(message: string, payload: any) {
        this.socket.emit(message, payload);
    }

    public disconnect() {
        this.socket.disconnect();
        SocketClient.instance = null;
    }

    // function verifica si esta conectado
    public isConnected(): boolean {
        return this.socket.connected;
    }

    // conecta al socket
    public connect() {
        this.socket.connect();
    }

    public on(event: string, callback: EventCallback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
        this.socket.on(event, callback);
    }

    public off(event: string, callback: EventCallback) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
                this.socket.off(event, callback);
            }
        }
    }
}

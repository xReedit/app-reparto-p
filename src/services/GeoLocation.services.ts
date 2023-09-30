import DeliveryDriver from "./DeliveryDriver.services";
import { PedidosServices } from "./pedidos.services";
import { SocketClient } from "./socket.services";
import {    
    distanceTo
} from 'geolocation-utils';

class GeoLocationServices {
    private socketService: any = null
    private watchId: number | null = null;
    private pedidosServices = PedidosServices.getInstance()

    constructor() {
    }

    async requestGeolocationPermission(): Promise<boolean> {
        let rpt = false;
        if ('geolocation' in navigator) {            
            navigator.geolocation.getCurrentPosition(                
                (position) => {                    
                    this.startGeolocationTracking()
                }
            ,(error) => {
                // El usuario denegó el permiso de geolocalización o hubo un error
                console.error("Error al obtener la ubicación:", error);                
                    // Aquí puedes mostrar un mensaje al usuario para que intente habilitar la geolocalización
                })

            
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });                
                if (permissionStatus.state === 'granted') {
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error al solicitar permiso de geolocalización:', error);
            }
        }
        return false;
    }


    startGeolocationTracking(): void {
        if ('geolocation' in navigator) {            
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {  
                    try {
                        const { latitude, longitude } = position.coords;
                        this.sendLocationToServer(latitude, longitude);
                        // this.pedidosServices.getPedidosAcceptados()
                        this.pedidosServices.actualizarEstadoPedidos({ latitude, longitude })                           
                    } catch (error) {
                        // console.log('Error al obtener la ubicación:', error);                        
                    }                  
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                },
                { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
            );
        } else {
            console.error('El navegador no admite la geolocalización.');
        }
    }

    stopGeolocationTracking(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    private sendLocationToServer(latitude: number, longitude: number): void {
        this.socketService = SocketClient.getInstance()
        const repartidorData = DeliveryDriver.getInstance().getUserData();
        
        if (this.socketService) {
            const _dataSend = {
                latitude,
                longitude,
                idrepartidor: repartidorData.idrepartidor
            }
            // falta implementar que envie las coordenadas al backend
            // this.socketService.emit('sendLocation', _dataSend);
            
        }
    }

    // Función para calcular el umbral de 50 metros a la redonda
    estaDentroDelUmbral(coordOrigen: { latitude: number; longitude: number }, coordDestino: { latitude: number; longitude: number }): boolean {
        const distanciaMetros = distanceTo(coordOrigen, coordDestino); // Calcula la distancia en metros

        // Compara la distancia con el umbral de 70 metros
        return distanciaMetros <= 70;
    }
}

export default GeoLocationServices;
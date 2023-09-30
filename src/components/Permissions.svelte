<script lang="ts">
	import { goto } from "$app/navigation";
	import GeoLocationServices from "$root/services/GeoLocation.services";
	import { NotificationPushService } from "$root/services/NotificationPush.services";

    import imgLogoPermisos from '$root/static/permisos.png'

    let geoLocationServices = new GeoLocationServices();
    let numPermisos = 0;

    async function requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();            
            if (permission === 'granted') {
                numPermisos++;
                

                const notificationPushService = new NotificationPushService();
                notificationPushService.getNotificationSubscription()

                // if (notificationSubscription) {
                //     console.log('Token de suscripción a notificaciones:', notificationSubscription);
                //     // Puedes enviar este token al servidor para enviar notificaciones al usuario.
                // } else {
                //     console.log('El usuario no ha concedido permisos de notificación o ha ocurrido un error.');
                // }
                // Permiso concedido, puedes enviar notificaciones push.
            } else {
            // Permiso denegado, maneja la situación según sea necesario.
            }
        } catch (error) {
            console.error('Error al solicitar permiso de notificación:', error);
        }
    }

    async function requestPermissionGeolocation() {
        const rptGPS = await geoLocationServices.requestGeolocationPermission();
        console.log('¿rptGPS', rptGPS);
        rptGPS ? numPermisos++ : false;
        console.log('numPermisos', numPermisos);
    }

    function listoIniciar() {
        if ( numPermisos > 0 ) {
            goto('/main/pedidos')
        } else {
            alert('Debe aceptar los permisos para iniciar');
        }
    }

</script>

<style>
    .div-content {                
        /* width: 100%; */                
        margin: 20px;
        text-align: center;
    }
</style>

<div class="div-content card-1">
    
    <div>
        <img src={imgLogoPermisos}  class="h-auto max-w-lg mx-auto" alt="imagen permisos">
    </div>

    <i class="fa fa-unlock"></i>
    <p class="text-xl">Es necesario que otorgue los siguentes permisos.</p>

    <br>
    <div>
        <p>Permiso para recibir notificaciones de pedidos.</p>
        <button class="btn-primary" on:click={requestNotificationPermission}>Aceptar Notificación</button>
    </div>
    <br>
    <div>
        <p>Active su GPS o Ubicación.</p>
        <button class="btn-primary" on:click={requestPermissionGeolocation}>Aceptar Geolocalización</button>
    </div>
    <br>
    <div>
        <button class="btn-success" on:click={listoIniciar} hidden={numPermisos === 0}>Listo Inciar</button> 
    </div>
</div>
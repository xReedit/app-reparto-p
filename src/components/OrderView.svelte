<!-- src/routes/OrderView.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';    
  import OrderList from './OrderList.svelte';
	import { SocketClient } from '$root/services/socket.services';
	import OrderPendingAcept from './OrderPendingAcept.svelte';
	import { getValueToken } from '$root/services/login.services';
	import { PedidosServices } from '$root/services/pedidos.services';
	import { listPedidosAceptadosStorage } from '$root/stores/Store';	
	import GeoLocationServices from '$root/services/GeoLocation.services';
	import { NotificationSocketsService } from '$root/services/NotificationSockets.services';
  import imgWaiting2 from '$root/static/svg/happy_music.svg';
	import AsignarsePedido from './AsignarsePedido.svelte';
  import AsignarsePedidoComercioList from './AsignarsePedidoComercioList.svelte';
	import DeliveryDriver from '$root/services/DeliveryDriver.services';
  // import imgLogoPermisos from '$root/static/permisos.png'

  let listOrdersAcepts: any[] = [];
  let isShowCatWaiting = false;  
  let isShowOrderPending = false;
  let orderPending: any;
  let orderPendingVisible: boolean = false;
  let socketService:SocketClient;
  let idrepartidor;
  let geoLocationServices = new GeoLocationServices();
  let notificationSocketsService: NotificationSocketsService;
  let pedidoService = PedidosServices.getInstance();
  let isShowBtnCancelAsignacion = false
  let isRespartidorPropio = false
  
  $: isShowCatWaiting = listOrdersAcepts.length == 0 && !orderPendingVisible ? true : false; 
  $: isShowOrderPending = orderPendingVisible;

  onMount(() => {

    // verificamos si el repartidor es propio del comercio identificando si idsede_suscrito es diferente null
    isRespartidorPropio = DeliveryDriver.getInstance().isRepartidorPropio()

    geoLocationServices.startGeolocationTracking()

    // chequeamos si hay pedidos aceptados
    pedidoService.loadPedidosAceptadosStorage()

    listPedidosAceptadosStorage.subscribe((value: any) => {      
      if ( value ) {
        listOrdersAcepts = value
        // isShowCatWaiting = listOrdersAcepts.length == 0 || !orderPendingVisible ? true : false; 
      }
    })

    idrepartidor = getValueToken('usuario').idrepartidor    
    socketService = SocketClient.initSocket(idrepartidor);  
    notificationSocketsService = new NotificationSocketsService(socketService)        

    // nuevo pedido
    notificationSocketsService.onPedidosPorAceptar((newOrder: any) => {      
      orderPending = newOrder
      orderPendingVisible = true
    })  

    // pedidos pendientes por aceptar
    notificationSocketsService.onPedidosPendientesPorAceptar((newOrder: any) => {            
      orderPending = newOrder
      if ( orderPending.pedido_por_aceptar ) {
        orderPendingVisible = true
      }
      else {
        orderPendingVisible = false
        orderPending = null
      }      
    })

    // pedido removido por el backend
    notificationSocketsService.onPedidoRemovidoByBackEnd((orderId: any) => {      
      orderPending = null
      orderPendingVisible = false
    })

    // pedido asignado desde comercio o restobar
    notificationSocketsService.onPedidoAsignadoComercio((order: any) => {           
      pedidoService.pedidoAsignadoComercioOrPacman(order) 
    })

    
    
  });

  function cerrarAsignacionPedido(isHayPedidoAsigando: boolean): void {    
    isShowCatWaiting = !isHayPedidoAsigando        
  }


  function showAsignacionPedido() {
    isShowCatWaiting = true;
    isShowBtnCancelAsignacion = true
  }

</script>




{#if isShowCatWaiting}  
  <div>
    <img class="img-waiting" src={imgWaiting2} alt="">
  </div>
  <div class="div-waiting">    
    <hr>
    <br>    
    <AsignarsePedido {isRespartidorPropio} isShowCancel={isShowBtnCancelAsignacion} on:close={cerrarAsignacionPedido}/>    
    <!-- <button class="btn btn-secondary">Asignarse Pedido</button> -->
  </div>
{:else}
  {#if isShowOrderPending }
    <div class="m-3">
      <OrderPendingAcept bind:order={orderPending} bind:visible={orderPendingVisible} />
    </div>
  {:else}
    <div class="card-1 m-3">
      <div class="border-b border-gray-300 flex justify-between items-center pb-2">
        <p class="fs-15 font-normal">Lista de Pedidos</p>
        <button class="btn btn-sm btn-secondary" on:click={showAsignacionPedido}>Asignarse Pedido</button>
      </div>        
      <OrderList bind:orders={listOrdersAcepts} />
    </div>
  {/if}
{/if}

<style>
  /* Estilos de la página de visualización de pedidos */
  .div-waiting {
    display: flex;
    flex-direction: column;
    align-items: center;

  }
  .img-waiting {
    opacity: 0.9;
    width: 100%;
    max-width: 250px;
    margin: auto;
    text-align: center;
  }
</style>

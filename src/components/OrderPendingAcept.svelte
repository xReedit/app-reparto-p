<script lang="ts">
	import { postData } from "$root/services/httpClient.services";
	import { PedidosServices } from "$root/services/pedidos.services";
	import { onDestroy, onMount } from "svelte";
	import audioNotification from '$root/static/sounds/Alarm04.wav';
  
  export let order: any = {}
  export let visible: boolean = false;
  let pedidosServices = PedidosServices.getInstance();

  let progreso = 0;
  let intervalo: any = null;

  onMount(() => {    
    if ( order ) {
      visible = order.pedido_por_aceptar?.pedidos.length > 0;
      pedidosServices.emitSoundNotification(audioNotification)
      iniciarProgressBar()
            
    }
  })

  onDestroy(() => {
    try {    
      clearInterval(intervalo);
    } catch (error) {      
      console.log(error);
    }

  })

  async function acceptOrder() {
    const _ids = pedidosServices.getIdsPedidosNoLocalStorage(order.pedido_por_aceptar.pedidos)
    // const ids = order.pedido_por_aceptar.pedidos.join(',');
    if ( _ids.length == 0 ) {
      visible = false
      order = null    
      pedidosServices.setNullPedidosPorAceptar()
      return
    };

    const ids = _ids.join(',');    

    await pedidosServices.aceptarPedido(ids)

    visible = false
    order = null    
  }

  function iniciarProgressBar() {
    progreso = 0;
    clearInterval(intervalo); // Asegúrate de detener cualquier progreso anterior
    intervalo = setInterval(() => {
      progreso += 1; // Aumenta el progreso cada segundo
      if (progreso >= 60) {
        clearInterval(intervalo); // Detiene el progreso cuando se alcanza 1 minuto
      }
    }, 1000); // Avanza cada segundo
  }

</script>

{#if visible}
<div class="order-item card-1 text-center">
  <p class="fs-15 font-semibold mb-2">Pedido por Aceptar 🎉</p>
  <hr>    
  <div class="flex gap-10 mb-2 mt-2 justify-center">    
    <div class="text-center">
      <p class="fs-20 font-semibold">🎁 {order.pedido_por_aceptar?.pedidos.length}</p>
      <p class="fs-14 text-secondary">Pedidos</p>
    </div>
    <div>
      <p class="fs-20 font-semibold">💵 {order.pedido_por_aceptar?.importe_pagar}</p>
      <p class="fs-14 text-secondary">Importe</p>      
    </div>
  </div>  
  <hr>
  <div class="mt-3">
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: {progreso * 100 / 60}%;"></div>
    </div>
    <p class="fs-11 mb-2 text-secondary">Tiene un minuto para aceptar</p>
    <button class="btn btn-primary" on:click={acceptOrder}>Aceptar</button>
  </div>    
  
</div>
{/if}

<style>

  .progress-bar {
    /* Estilos anteriores del progressBar */
    transition: width 0.5s ease; /* Define la duración y la función de temporización */
  }
  /* Estilos para el elemento de pedido */
</style>
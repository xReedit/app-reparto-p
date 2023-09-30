<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- src/components/OrderItem.svelte -->
<script lang="ts">
	import { calculateTimePedido, xGetClassTpDelivery } from "$root/services/utils";
	import { createEventDispatcher, onDestroy, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  export let order: any;

  let interval = 60000; // Intervalo de tiempo en milisegundos
  let timepoTranscurrido:any = {};
  let stringTiempoTranscurrido = '0min';
  let classTiempoTranscurrido = 'text-success fs-10 font-bold'
  let metodoPago: any = {};  
  let order_p_header: any = {};
  let classMetodoPago = '';
  let intervalId: any
  let totalPagaRepartidor = 0;  
  let llegoComercio = false
  let estaEnCamino = false
  
  $: stringTiempoTranscurrido = timepoTranscurrido.horaString;
  $: classTiempoTranscurrido = timepoTranscurrido.minutos < 20 ? 'text-success font-bold fs-10' : 'text-danger font-bold fs-10';
  $: totalPagaRepartidor = order.total_paga_repartidor ? order.total_paga_repartidor.toFixed(2) : 0;
  $: llegoComercio = order.time_line ? order.time_line.llego_al_comercio : false;
  $: estaEnCamino = order.time_line ? order.time_line.en_camino_al_cliente : false;
  
  onMount(() => {    

    order_p_header = order.json_datos_delivery.p_header;
    metodoPago = order_p_header.arrDatosDelivery.metodoPago;    

    timepoTranscurrido = calculateTimePedido(order.fecha_hora);    

    classMetodoPago = 'badge-2 ' + xGetClassTpDelivery(metodoPago.idtipo_pago) + ' fs-9'; 

    intervalId = setInterval(() => {      
      timepoTranscurrido = calculateTimePedido(order.fecha_hora);
    }, interval);
    
  })

  onDestroy(() => {
    try {      
      intervalId.clearInterval();
    } catch (error) {
      
    }
	});


  function handleClick() {    
    dispatch('click', order);
  }
</script>

<style>  
  .item-entregado {
    background: #f5fff5;
  }
</style>


            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li class="py-3 sm:py-4 {order.pwa_estado === 'E' ? 'item-entregado' : ''}" on:click={ handleClick }>
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0 fs-10">
                        {#if order.flag_is_cliente == 1}
                        <p class="badge-2 badge-success text-center">APP</p>
                        {:else}
                        <p class="badge-2 badge-danger text-center">No App</p>    
                        {/if}

                         {#if order.pwa_estado === 'E'}
                          <div>
                            <p class="badge-2 badge-success mt-1 text-center">Entregado</p>
                          </div>
                          {/if}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="fs-10 font-medium text-gray-900 truncate dark:text-white">
                            {order_p_header?.arrDatosDelivery?.nombres}
                        </p>
                        <p class="fs-10 text-gray-500 truncate dark:text-gray-400">
                            {order_p_header?.arrDatosDelivery?.establecimiento?.nombre}
                        </p>
                        <div class="flex gap-2">
                          <p class={classTiempoTranscurrido}>{stringTiempoTranscurrido}</p>
                          {#if llegoComercio && !estaEnCamino}
                            <p class="fs-10 text-success">✅LLego</p>
                          {/if}
                          {#if estaEnCamino}
                            <p class="fs-10 text-success">🛵 En Camino</p>
                          {/if}

                        </div>
                    </div>
                    <div class="inline-flex items-center text-center font-semibold text-gray-900 dark:text-white">                      
                      <p>
                            <span class={classMetodoPago}>{metodoPago?.descripcion}</span><br>
                            <span>{totalPagaRepartidor}</span>
                        </p>                        
                    </div>
                </div>
            </li>                                                
   



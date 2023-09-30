<script lang="ts">
	import DeliveryDriver from "$root/services/DeliveryDriver.services";
	import { PedidosServices } from "$root/services/pedidos.services";
	import { calculateTimePedido, xGetClassTpDelivery } from "$root/services/utils";
	import { createEventDispatcher, onMount } from "svelte";

    export let order: any;
    let pedidosServices = PedidosServices.getInstance();
    let isHayPedidoAsigando: boolean = false
    const dispatch = createEventDispatcher();


    let timepoTranscurrido:any = {};
    let stringTiempoTranscurrido = '0min';
    let classTiempoTranscurrido = 'text-success fs-10 font-bold'
    let classMetodoPago = '';
    let order_p_header: any = {};
    let metodoPago: any = {};   
    let isPedidoAsignado = false;   

    $: stringTiempoTranscurrido = timepoTranscurrido.horaString;
    $: classTiempoTranscurrido = timepoTranscurrido.minutos < 20 ? 'text-success font-bold fs-10' : 'text-danger font-bold fs-10';    
    
    onMount(() => {
        try {                            
            order_p_header = order.json_datos_delivery.p_header;
            metodoPago = order_p_header.arrDatosDelivery.metodoPago; 
            isPedidoAsignado = order.idrepartidor === null ? false : true

            timepoTranscurrido = calculateTimePedido(order.fecha_hora);
            classMetodoPago = 'badge-2 ' + xGetClassTpDelivery(metodoPago.idtipo_pago); 
        } catch (error) {
            
        }
    })

    async function aceptarPedido() {
        // dispatch('aceptar_pedido', order);
        const _ids = order.idpedido.toString()
        // await pedidosServices.aceptarPedido(_ids);

        const dataDriver = DeliveryDriver.getInstance();
        order.idrepartidor = dataDriver.getUserData().idrepartidor;
        isPedidoAsignado = true;
        isHayPedidoAsigando = true

        dispatch('pedido_asignado', _ids)
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li class="py-3 sm:py-4">
    <div class="flex items-center space-x-4">
        <!-- Datos del cliente -->
        <div class="flex-1 min-w-0 fs-10">
            <p class="font-medium text-gray-900">
                {order.json_datos_delivery.p_header.arrDatosDelivery.nombres}
            </p>
            <p class="text-gray-500">
                {order.json_datos_delivery.p_header.arrDatosDelivery.direccion}
            </p>
            <p class="text-gray-900 truncate">
                {order.json_datos_delivery.p_header.arrDatosDelivery.referencia}
            </p>
            <div class="flex mt-1">
                <p class="fs-11 font-semibold mr-2">
                    <span class={classMetodoPago}>{metodoPago?.descripcion} {order.total_r}</span><br>                
                </p>
                <p class={classTiempoTranscurrido}>{stringTiempoTranscurrido}</p>         
            </div>   
        </div>
        <!-- total y costo de entrega -->
        <div class="inline-flex items-center text-center">       
            {#if !isPedidoAsignado}               
                <button class="btn btn-sm btn-primary" on:click={aceptarPedido}>Lo llevo</button>                            
            {:else}
                ✅
            {/if}
        </div>
    </div>
</li>


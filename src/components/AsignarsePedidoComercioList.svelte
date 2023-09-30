<!-- componente que solo tiene acceso el repartidor propio del comercio
donde estan los pedidos pendientes de entrega -->

<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
    import { PedidosServices } from "$root/services/pedidos.services";
	import AsignarsePedidoComercioItem from "./AsignarsePedidoComercioItem.svelte";

    const dispatch = createEventDispatcher();
    
    let orders: any = [];  
    let countPedidosPendientes = 0
    let pedidoService = PedidosServices.getInstance();
    let ids_pedidos_asignados: any[] = []
    onMount(async () => {

        // traer los pedidos pendientes de entrega
        orders = []
        const rpt = await pedidoService.listOrderComercioPendientes()
        countPedidosPendientes = rpt.data.length
        if ( countPedidosPendientes > 0 ) {
            orders = rpt.data.map((x: any) => {
                x.json_datos_delivery = JSON.parse(x.json_datos_delivery)
                return x
            })
        }


    })

    function handleClickClose() {
        dispatch('close', true)
    }

    function pedidoAsignado(obj: any) {        
        ids_pedidos_asignados.push(obj.detail)        
    }

    function asignarPedidosSeleccionados() {
        const _ids_pedidos_asignados = ids_pedidos_asignados.join(',')
        pedidoService.aceptarPedido(_ids_pedidos_asignados)
        handleClickClose()
    }

</script>

<style>

</style>

<p class="fs-15 font-semibold text-center">Pedidos pedientes de entrega ({countPedidosPendientes})</p>
<div class="flow-root order-list card-1 m-3">
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each orders as order (order.idpedido)}      
            <AsignarsePedidoComercioItem order={order} on:pedido_asignado={pedidoAsignado}/>
        {/each}
    </ul>

    <br>
    <hr>
    <br>
    <div class="text-center mt-2">
        <button class="btn btn-success" hidden = {countPedidosPendientes===0} on:click={asignarPedidosSeleccionados}>Listo!</button>
        <button class="btn btn-secondary" on:click={handleClickClose}>Atras</button>
    </div>
</div>


    
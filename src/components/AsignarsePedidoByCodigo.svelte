<!-- repartidor de la red papaya -->
<script lang="ts">
    import { PedidosServices } from "$root/services/pedidos.services";
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let codigoPedido = ''
    let buttonAsignarDisabled = true
    let pedidosServices = PedidosServices.getInstance()
    let rptMessage = ''
    let rptMessageClass = ''
    let isHayPedidoAsigando = false

    $: buttonAsignarDisabled = codigoPedido ? codigoPedido.length < 4 ? true : false : true;

    async function asignarsePedido() {        
        buttonAsignarDisabled=true        
        // isShowButon = false
        const rpt = await pedidosServices.asignarsePedido(codigoPedido)
        if ( rpt.success ) {
            isHayPedidoAsigando = false
            rptMessage = rpt.message
            rptMessageClass = 'text-green-500 font-bold'
            codigoPedido = ''
        } else {
            rptMessage = rpt.message
            rptMessageClass = 'text-red-500 font-bold'            
        }
    }

    function handleClickClose() {          
        dispatch('close', isHayPedidoAsigando);
    }
</script>

<style>
    .content-input-pedido {
        max-width: 200px;
    }
</style>


<div class="text-center">
            <label for="cod-pedido">Escribe el código del pedido</label>
            <div style="content-input-pedido">
                <input id="cod-pedido" type="number" bind:value={codigoPedido} placeholder="Código" class="text-center">
            </div>
            <div>
                <button class="btn btn-primary" disabled= { buttonAsignarDisabled } on:click={asignarsePedido}>Asignarse</button>
                <button class="btn btn-secondary" on:click={handleClickClose}>Cerrar</button>

                <!-- mensaje -->
                <div class="mt-2">
                    <p class={rptMessageClass}>{ rptMessage }</p>
                </div>
            </div>
</div>
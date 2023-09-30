<script lang="ts">
	import { PedidosServices } from "$root/services/pedidos.services";
	import { createEventDispatcher } from "svelte";
	import AsignarsePedidoByCodigo from "./AsignarsePedidoByCodigo.svelte";
	import AsignarsePedidoComercioList from "./AsignarsePedidoComercioList.svelte";

    const dispatch = createEventDispatcher();
    export let isShowCancel = false
    export let isRespartidorPropio = false

    let isShowButon = true 

    function handleClickClose(isHayPedidoAsigando: boolean) {  
        isShowButon = true  
        dispatch('close', isHayPedidoAsigando);
    }
    

</script>


<div>
    {#if isShowButon}
    <div class="text-center">
        <button class="btn btn-primary" on:click={() => isShowButon = false}>Asignarse Pedido</button>
        <button class="btn btn-secondary" hidden={!isShowCancel} on:click={handleClickClose}>Cancelar</button>
    </div>
    {:else}       
        {#if !isRespartidorPropio}
            <AsignarsePedidoByCodigo on:close={handleClickClose}/>
        {:else}
            <AsignarsePedidoComercioList on:close={handleClickClose}/>
        {/if}
    {/if}
</div>
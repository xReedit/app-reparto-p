<script lang="ts">	
	import DeliveryDriver from "$root/services/DeliveryDriver.services";	
	import { createEventDispatcher, onMount } from "svelte";

    export let order: any = {}
    let isShowCaminoComercio = false    
    let isDireccionGeoreferenciada = false;
    let isRespartidorPropio = false
    const dispatch = createEventDispatcher();

    onMount(() => {            
        isRespartidorPropio = DeliveryDriver.getInstance().isRepartidorPropio()
        isDireccionGeoreferenciada = order.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.latitude ? true : false;
    })  

    function llamarPhone(phone: string) {
        window.open(`tel:${phone}`, '_blank');
    }

    function whatsapp(phone: string) {
        window.open(`https://wa.me/${phone}`, '_blank');        
    }

    // muestra el camino
    // abre el google maps con la ruta segun las coordenadas
    // desde de mi posicion hasta el destino    
    function showCamino(isCliente = true) {
        // mi posicion
                
        const latitude = isCliente ? order.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.latitude :
            order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.latitud || 0;
        const longitude = isCliente ? order.json_datos_delivery.p_header.arrDatosDelivery.direccionEnvioSelected.longitude :
            order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.longitud || 0;

        isShowCaminoComercio = latitude !== 0 && longitude !== 0;

        if ( !isShowCaminoComercio ) return
        
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`, '_blank');
    }

    // marca la order como entregada
    // function pedidoEntregado() {
    //     order.pwa_estado = 'E'
    //     order.estado = 2
    //     pedidosServices.pedidoEntregado(order)        
    // }

    function handleClickEntregado() {    
        dispatch('click_entregado');
    }

    function handelClose() {
        dispatch('close');
    }

</script>


<style>
    .info-repartidor-btns {
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        gap: 10px;
        flex-direction: row;
    }

    .info-repartidor-total {
        display: flex;
        align-items: center;
        justify-content: space-between;        
        flex-direction: row;
    }

    .tr-subtotal {
        background: whitesmoke;
    }
</style>

<div class="p-5 fs-13">

     <!-- comercio -->
     {#if !isRespartidorPropio}
    <div class="pb-5">
        <p class="font-bold">Comercio</p>
        <p>{order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.nombre}</p>
        <p class="text-secondary fs-11">{order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.direccion}</p>
        <p class="text-info fs-11">{order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.telefono}</p>
        <!-- botones -->
        <div class="info-repartidor-btns mt-2">
            <button class="btn btn-sm btn-primary" on:click={() => showCamino(false)}>Muestrame Camino</button>
            <button class="btn btn-sm btn-secondary" on:click={() => llamarPhone(order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.telefono)}>LLamar</button>
            <!-- <button class="btn btn-sm btn-success" on:click={() => whatsapp(order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.telefono)}>Whatsapp</button> -->
        </div>
    </div>
    <hr>
    <br>
    {/if}

    <!-- cliente -->
    <div class="pb-5">
        <p class="font-bold">Cliente</p>
        <p>{order.json_datos_delivery.p_header.arrDatosDelivery.nombres}</p>
        <p class="text-secondary fs-11">{order.json_datos_delivery.p_header.arrDatosDelivery.direccion}</p>
        <p class="fs-12">{order.json_datos_delivery.p_header.arrDatosDelivery.referencia}</p>
        {#if !isDireccionGeoreferenciada}
            <p class="text-danger fs-11">Direccion no Georeferenciada</p>
        {/if}
        <p class="text-info font-medium">{order.json_datos_delivery.p_header.arrDatosDelivery.telefono}</p>

        <!-- botones -->
        <div class="info-repartidor-btns mt-2">
            {#if isDireccionGeoreferenciada}
                <button class="btn btn-sm btn-primary" on:click={() => showCamino(true)}>
                    Muestrame Camino
                </button>
            {/if}
            <button class="btn btn-sm btn-secondary" on:click={() => llamarPhone(order.json_datos_delivery.p_header.arrDatosDelivery.telefono)}>                
                LLamar
            </button>
            <button class="btn btn-sm btn-success" on:click={() => whatsapp(order.json_datos_delivery.p_header.arrDatosDelivery.telefono)}>
                WhatsApp
            </button>
        </div>
    </div>    
    <hr>    


    <!-- detalle de pedido -->
    <div>
        <br>
        <p class="font-bold">El Pedido</p>
        <table style="width: 100%;" class="fs-12">            
            <tbody>
                {#each order.json_datos_delivery.p_body.tipoconsumo[0].secciones as seccion}
                    <tr class="bg-gray-600 text-white">
                        <td colspan="3">{seccion.des}</td>                    
                    </tr>
                    {#each seccion.items as item}
                    <tr>
                        <td>{item.cantidad_seleccionada}</td>
                        <td>{item.des}</td>
                        <td align="right">{item.precio_print}</td>
                    </tr>
                    {/each}                
                {/each}

                <!-- totales -->
                <tr class="bg-gray-600 text-white">
                    <td colspan="3">TOTALES</td>
                </tr>
                {#each order.json_datos_delivery.p_subtotales as subtotal}
                    {#if subtotal.visible}
                    <tr class="tr-subtotal">
                        <td colspan="2">{subtotal.descripcion}</td>
                        <td align="right">{subtotal.importe}</td>
                    </tr>
                    {/if}
                {/each}
                

                <!-- total costo productos -->
                <tr class="bg-blue-500 text-white">
                    <td colspan="2"><span >COSTO DE PRODUCTOS</span></td>
                    <td align="right"><span class="font-bold fs-15">{order.total_paga_repartidor.toFixed(2)}</span></td>
                </tr>
            </tbody>
        </table>
        <br>

        <div class="info-repartidor-total font-normal">
            <div>
                <p>Costo de Entrega</p>
                <p class="text-success text-center font-bold">{order.costo_delivery.toFixed(2)}</p>
            </div>
            
            <div>
                <p>Propina</p>
                <p class="text-info text-center font-bold">{order.propina_repartidor.toFixed(2)}</p>
            </div>

            <div>
                <p>Cliente Paga</p>
                <p class="text-info text-center font-bold">{order.total_r || order.total}</p>
            </div>
        </div>
    </div>
    <br>
    <hr> 
    <br>

    <!-- botones -->
    <div class="text-center">
        {#if order.pwa_estado === 'E'}
            <p class="text-success fs-15 font-semibold">Pedido Entregado!</p>
        {:else}            
            <button class="btn btn-success" on:click={handleClickEntregado}>Listo Entregado!</button>
        {/if}
        <button class="btn btn-secondary" on:click={handelClose}>Cerrar</button>
    </div>
    <br>
</div>
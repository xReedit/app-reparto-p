<script lang="ts">
	import { onMount } from "svelte";
    import DeliveryDriver from "../services/DeliveryDriver.services";
	import { capitalizeFirstLetter } from "$root/services/utils";

  let isRespartidorPropio = false
  let repartidorNombre = 'Nombre del Repartidor';
  let isConnected = false;
  let stringConectado = 'Conectado';
  let repartidorData: any = {};

  onMount(() => {
    repartidorData = DeliveryDriver.getInstance().getUserData()
    isRespartidorPropio = DeliveryDriver.getInstance().isRepartidorPropio()
    repartidorNombre = repartidorData.nombre
    
    if ( repartidorData.online ) {
        isConnected = repartidorData.online
    } else {
        // isConnected = false
        repartidorData.online = isConnected
    }    
    DeliveryDriver.getInstance().setUserData(repartidorData)
  });

  // Función para cambiar el estado de conexión
  function toggleConnection() {
    isConnected = !isConnected;
    repartidorData.online = isConnected
    DeliveryDriver.getInstance().setUserData(repartidorData)

  }

  
  $: stringConectado = isConnected ? 'En Linea' : 'Offline';  
</script>

<style>
  /* Estilos CSS para la barra de herramientas */
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px 5px 10px;
    background-color: #00b14f;
    color: white;
    height: 60px;
  }

  .repartidor-info {
    display: flex;
    align-items: center;
  }

  .toggle-label {
    margin-left: 8px;
    margin-top: 10px;
  }
  
</style>

<!-- Contenido de la barra de herramientas -->
<div class="toolbar">
  <div class="repartidor-info">
    <span class="fs-14 font-bold">{repartidorNombre}</span>
  </div>
  {#if !isRespartidorPropio}
    <div class="toggle-label">
      <label class="relative cursor-pointer text-center">
          <input type="checkbox" value="" class="sr-only peer" on:change={toggleConnection} bind:checked={isConnected}>
          <div class="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-yellow-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>                
          <p class="text-white fs-10">{stringConectado}</p>
      </label>
    </div>
  {/if}
</div>

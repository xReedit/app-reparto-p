<!-- src/components/OrderList.svelte -->
<script lang="ts">
	import OrderItem from "./OrderItem.svelte";
  import OrderDetails from "./OrderDetails.svelte";
  import Modal from "./Modal.svelte";
	import { onMount } from "svelte";
	import { PedidosServices } from "$root/services/pedidos.services";

  export let orders: any = [];  

  let isOpenDetallePedido = false;
  let orderSeleted: any = {};
  let pedidosServices = PedidosServices.getInstance();
  let isShowBtnPedidosEntregados = false;
  let totales = {
    total_producto: 0,
    costo_delivery: 0
  }

  $: totales.total_producto = orders.reduce((acc: any, order: any) => acc + order.total_paga_repartidor, 0); 
  $: totales.costo_delivery = orders.reduce((acc: any, order: any) => acc + order.costo_delivery, 0);  

  function openDetallePedido(order: any) {
    orderSeleted = order.detail;    
    isOpenDetallePedido = false;
    isOpenDetallePedido = true;
  }

  onMount(() => {
    // revisamos si hay pedidos en localstorage
    // si hay pedidos los cargamos          
    pedidosServices.loadPedidosAceptadosStorage();    

    orders.map((order: any) => {
      totales.total_producto += order.total_paga_repartidor;
      totales.costo_delivery += order.costo_delivery;      
    })
    
  })

  $: isShowBtnPedidosEntregados = orders.length == 0 ? false : orders.filter((order: any) => order.pwa_estado !== 'E').length === 0; 

  function pedidoEntregado() {
        orderSeleted.pwa_estado = 'E'
        orderSeleted.estado = 2
        pedidosServices.pedidoEntregado(orderSeleted)        
  }

  function todosPedidosEntregados() {
    orders = []
    isShowBtnPedidosEntregados = false;
    pedidosServices.listaPedidosEntregados();    
  }

  

</script>

<div class="flow-root order-list">
  <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
    {#each orders as order (order.idpedido)}      
        <OrderItem order={order} on:click={openDetallePedido}/>
    {/each}
  </ul>
  <div class="flex justify-end flex-col items-end pr-1 border-t border-gray-300">
    <p class="fs-12 font-bold mt-2"><span class="text-gray-600">Total Productos:</span> <span class="fs-15">{totales.total_producto.toFixed(2)}</span></p>
    <p class="fs-12 font-bold"><span class="text-gray-600">Costo Delivery:</span> <span class="text-info fs-13">{totales.costo_delivery.toFixed(2)}</span></p>
  </div>

  <br>
  <div class="text-center">
    <button class="text-center btn btn-success" hidden={!isShowBtnPedidosEntregados} on:click={todosPedidosEntregados}>Listo Pedidos Entregados!</button>
  </div>
</div>


<Modal isOpen={isOpenDetallePedido} titulo={`Pedido #${orderSeleted.idpedido}`}>
  <OrderDetails order={orderSeleted} on:click_entregado = {pedidoEntregado} on:close={() => isOpenDetallePedido = false}/>
</Modal>

<style>
  /* Estilos para la lista de pedidos */
  .order-list {
    padding: 5px;
    margin-bottom: 100px;
  }
</style>

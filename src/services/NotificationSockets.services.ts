import type { SocketClient } from "./socket.services";

export class NotificationSocketsService {
    private socket: SocketClient;

    constructor(socket: SocketClient) {
        this.socket = socket;
    }

    // pedidos por aceptar
    public onPedidosPorAceptar = (callback: (data: any) => any) => {
        this.socket.on('repartidor-nuevo-pedido', (newOrder) => {
            // le damos el formato
            const orderPending = {
                pedido_por_aceptar: newOrder[1]
            }
            callback(orderPending)
        })
    }

    // pedidos pendientes por aceptar
    public onPedidosPendientesPorAceptar = (callback: (data: any) => any) => {
        this.socket.on('repartidor-get-pedido-pendiente-aceptar', (newOrder) => {
            // le damos el formato
            const orderPending = newOrder[0]
            callback(orderPending)
        })
    }

    // pedido removido por el backend
    public onPedidoRemovidoByBackEnd = (callback: (data: any) => any) => {
        this.socket.on('repartidor-notifica-server-quita-pedido', callback)
    }

    // recibe los pedidos asignados desde comercio o restobar
    public onPedidoAsignadoComercio = (callback: (data: any) => any) => {
        this.socket.on('set-repartidor-pedido-asigna-comercio', callback)
    }

    // notificamos que aceptamos el pedido
    public emitPedidoAceptado = (listPedidos: []) => {
        this.socket.sendMessage('repartidor-notifica-cliente-acepto-pedido', listPedidos)    
    }

    // notificamos al cliente el time_line de su pedido
    public emitTimeLinePedido = (listClienteNotificar: any[]) => {
        this.socket.sendMessage('repartidor-notifica-cliente-time-line', listClienteNotificar)    
    }

    // notificamos que terminamos de entregar todos los pedidos
    public emitTerminoEntregarPedidos = (idrepartidor: number) => {
        this.socket.sendMessage('repartidor-grupo-pedido-finalizado', idrepartidor)        
    }

    

}
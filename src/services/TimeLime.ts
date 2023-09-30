export class TimeLinePedido {
    hora_acepta_pedido: number;
    hora_pedido_entregado: number;
    llego_al_comercio: boolean;
    en_camino_al_cliente: boolean;
    mensaje_enviado: {
        llego_al_comercio: boolean;
        en_camino_al_cliente: boolean;
    };
    paso: number; // 1 llego al comercio // 2 en camino // 3 entregado        
    msj_log: string;
    distanciaMtr: string;
    // msj_llego_enviado: boolean;

    constructor() {
        this.hora_acepta_pedido = 0;
        this.hora_pedido_entregado = 0;
        this.llego_al_comercio = false;
        this.en_camino_al_cliente = false;
        this.mensaje_enviado = {
            llego_al_comercio: false,
            en_camino_al_cliente: false
        };
        this.paso = 0;
        this.msj_log = '';
        this.distanciaMtr = '';
        // this.msj_llego_enviado = false;
    }

    setData(data: any) {
        this.hora_acepta_pedido = data.hora_acepta_pedido;
        this.hora_pedido_entregado = data.hora_pedido_entregado;
        this.llego_al_comercio = data.llego_al_comercio;
        this.en_camino_al_cliente = data.en_camino_al_cliente;
        this.mensaje_enviado = data.mensaje_enviado;
        this.paso = data.paso;
        this.msj_log = data.msj_log;
        this.distanciaMtr = data.distanciaMtr;
        // this.msj_llego_enviado = data.msj_llego_enviado;
    }

    getData() {
        return {
            hora_acepta_pedido: this.hora_acepta_pedido,
            hora_pedido_entregado: this.hora_pedido_entregado,
            llego_al_comercio: this.llego_al_comercio,
            en_camino_al_cliente: this.en_camino_al_cliente,
            mensaje_enviado: this.mensaje_enviado,
            paso: this.paso,
            msj_log: this.msj_log,
            distanciaMtr: this.distanciaMtr,
            // msj_llego_enviado: this.msj_llego_enviado
        }
    }

    // Método para marcar que el pedido fue aceptado
    marcarPedidoAceptado() {
        this.hora_acepta_pedido = Date.now();
        this.paso = 1;
        this.msj_log = 'Pedido aceptado';
    }

    // Método para marcar que llegó al comercio o restaurante
    marcarLlegadaAlComercio() {
        this.llego_al_comercio = true;
        this.mensaje_enviado.llego_al_comercio = true;
        this.paso = 2;
        this.msj_log = 'Llegó al comercio';
    }

    // Método para marcar que está en camino hacia el cliente
    marcarEnCaminoAlCliente() {
        this.en_camino_al_cliente = true;
        this.mensaje_enviado.en_camino_al_cliente = true;
        this.paso = 3;
        this.msj_log = 'En camino al cliente';
    }

    // Método para marcar que el pedido fue entregado
    marcarPedidoEntregado() {
        this.hora_pedido_entregado = Date.now();
        this.paso = 4;
        this.msj_log = 'Pedido entregado';
    }
}
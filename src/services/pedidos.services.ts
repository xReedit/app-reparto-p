import { getData, postData, postDataJSON } from "./httpClient.services"
import { listPedidosAceptadosStorage } from '$root/stores/Store';
import { SocketClient } from "./socket.services";
import { getValueToken } from "./login.services";
import { TimeLinePedido } from "./TimeLime";
import DeliveryDriver from "./DeliveryDriver.services";
import { NotificationSocketsService } from "./NotificationSockets.services";
import GeoLocationServices from "./GeoLocation.services";




export class PedidosServices {
    private static instance: PedidosServices | null = null;
    listPedidoAceptados: any[] = []
    // socketService: any = null    
    
    
    constructor() {
       
    }

    public static getInstance(): any {
        if (!PedidosServices.instance) {
            PedidosServices.instance = new PedidosServices();
        }

        return PedidosServices.instance;        
    }

    // repartidor acepta pedido por ids pedidos
    aceptarPedido = async (ids: string): Promise<any> => {
        // const ids = order.pedido_por_aceptar.pedidos.join(',');
        const _data = {
            idpedido: ids,
            repartidor: null
        };

        await postData('repartidor', 'set-asignar-pedido2', _data)        
        this.loadPedidosAceptados(ids)
    }

    // colocar null en pedidos_por_aceptar al repartidor
    // caso cuando asignan pedido
    setNullPedidosPorAceptar = async () => {        
        await postData('repartidor', 'set-pedidos-por-aceptar-from-app', [])
    }


    //funcion que retorna el pedidos del repartidor
    loadPedidosAceptados = async (idpedidos: string) => {
        const rpt = await postDataJSON('repartidor', 'get-pedidos-recibidos-group', { ids: idpedidos })
        const repartidorData = DeliveryDriver.getInstance().getUserData()
        const dataPedido = rpt.success ? rpt.data : null        

        if ( !dataPedido ) return false

        this.listPedidoAceptados.push(...dataPedido)

        
        this.listPedidoAceptados.map(x => {

            return this.cocinarDataPedido(x, repartidorData)

            // const timeLineServices = new TimeLinePedido()
            // x.time_line ? timeLineServices.setData(x.time_line) : new TimeLinePedido() 
            // timeLineServices.marcarPedidoAceptado()
            // x.time_line = timeLineServices.getData()

            // try {
            //     if (typeof x.json_datos_delivery !== 'object' ) { // nuevo asignado
            //         x.json_datos_delivery = JSON.parse(x.json_datos_delivery)
            //         const importeTotal = x.json_datos_delivery.p_header.arrDatosDelivery.importeTotal
            //         let costoEntrega = x.json_datos_delivery.p_header.arrDatosDelivery.costoTotalDelivery || 0

            //         // sino tiene costodelivery entonces el costo del delivery esta el p_sutotales                    
            //         // puede estar con la descripcion de: costo de delivery, costo de envio, costo delivery, costo envio, costo de entrega, costo entrega, o simplemente delivery
            //         if (costoEntrega === 0) {
            //             const _costoDelivery = x.json_datos_delivery.p_subtotales.find((x: any) => x.descripcion.toLowerCase().includes('delivery') || x.descripcion.toLowerCase().includes('envio') || x.descripcion.toLowerCase().includes('entrega'))
            //             costoEntrega = _costoDelivery ? _costoDelivery : 0                        
            //         }

            //         // acaso tampoco esta en los p_subtotales entonces se encuetra en el p_body > tipoconsumo > secciones > items
            //         if (costoEntrega === 0) {
            //             x.json_datos_delivery.p_body.tipoconsumo.map((c: any) => {
            //                 c.secciones.map((s: any) => {
            //                     s.items.map((i: any) => {
            //                         const _desItem = i.des.toLowerCase()
            //                         if (_desItem.includes('delivery') || _desItem.includes('envio') || _desItem.includes('entrega')) {
            //                             costoEntrega += parseFloat(i.precio_print)
            //                         }
            //                     })
            //                 })
            //             })                        
            //         }

            //         const propina = x.json_datos_delivery.p_header.arrDatosDelivery.propina.importe || 0
            //         x.total_paga_repartidor = parseFloat(importeTotal) - (parseFloat(costoEntrega) + parseFloat(propina))
            //         x.propina_repartidor = propina
            //         x.costo_delivery = costoEntrega
            //         x.idrepartidor = repartidorData.idrepartidor
            //     }
            // } catch (error) {
            //     x.json_datos_delivery = null
            //     x.total_paga_repartidor = 0
            // }


            // return x
        })
        
        this.savePedidoAceptadosLocalStorage()

        this.cocinarLisPedidosNotificar(this.listPedidoAceptados)

        listPedidosAceptadosStorage.update(() => {
            return this.listPedidoAceptados
        })

        this.actualizarVistas(this.listPedidoAceptados)
            
    }

    private actualizarVistas = (listPedidoAceptados: any) => {
        listPedidosAceptadosStorage.update(() => {
            return listPedidoAceptados
        })
    }

    // x=order
    private cocinarDataPedido = (x: any, repartidorData:any) => {
       
        const timeLineServices = new TimeLinePedido()
        x.time_line ? timeLineServices.setData(x.time_line) : new TimeLinePedido()
        timeLineServices.marcarPedidoAceptado()
        x.time_line = timeLineServices.getData()

        try {
            x.json_datos_delivery = typeof x.json_datos_delivery !== 'object' ? JSON.parse(x.json_datos_delivery) : x.json_datos_delivery;  
            // if (typeof x.json_datos_delivery !== 'object') { // nuevo asignado
                // x.json_datos_delivery = JSON.parse(x.json_datos_delivery)
                const importeTotal = x.json_datos_delivery.p_header.arrDatosDelivery.importeTotal
                let costoEntrega = x.json_datos_delivery.p_header.arrDatosDelivery.costoTotalDelivery || 0

                // sino tiene costodelivery entonces el costo del delivery esta el p_sutotales                    
                // puede estar con la descripcion de: costo de delivery, costo de envio, costo delivery, costo envio, costo de entrega, costo entrega, o simplemente delivery
                if (costoEntrega === 0) {
                    const _costoDelivery = x.json_datos_delivery.p_subtotales.find((x: any) => x.descripcion.toLowerCase().includes('delivery') || x.descripcion.toLowerCase().includes('envio') || x.descripcion.toLowerCase().includes('entrega'))
                    costoEntrega = _costoDelivery ? _costoDelivery : 0
                }

                // acaso tampoco esta en los p_subtotales entonces se encuetra en el p_body > tipoconsumo > secciones > items
                if (costoEntrega === 0) {
                    x.json_datos_delivery.p_body.tipoconsumo.map((c: any) => {
                        c.secciones.map((s: any) => {
                            s.items.map((i: any) => {
                                const _desItem = i.des.toLowerCase()
                                if (_desItem.includes('delivery') || _desItem.includes('envio') || _desItem.includes('entrega')) {
                                    costoEntrega += parseFloat(i.precio_print)
                                }
                            })
                        })
                    })
                }

                const propina = x.json_datos_delivery.p_header.arrDatosDelivery.propina.importe || 0
                x.total_paga_repartidor = parseFloat(importeTotal) - (parseFloat(costoEntrega) + parseFloat(propina))
                x.propina_repartidor = propina
                x.costo_delivery = costoEntrega
                x.idrepartidor = repartidorData.idrepartidor
            // }
        } catch (error) {
            console.error(error);
            x.json_datos_delivery = null
            x.total_paga_repartidor = 0
        }


        return x
    }

    cocinarLisPedidosNotificar = (listPedidos: any) => {
        let listClienteNotificar:any = [];
        const repartidorData = DeliveryDriver.getInstance().getUserData()
        
        
        listPedidos.map((p: any) => {
            const rowDatos = p?.json_datos_delivery?.p_header?.arrDatosDelivery;
            // hora que acepta el pedido
            let _time_line = p.time_line || new TimeLinePedido()            
            // _time_line.hora_acepta_pedido = new Date().getTime()

            if (rowDatos) {
                const rowCliente = {
                    nombre: rowDatos.nombre.split(' ')[0],
                    telefono: rowDatos.telefono,
                    establecimiento: rowDatos.establecimiento.nombre,
                    idpedido: p.idpedido,
                    repartidor_nom: repartidorData.nombre.split(' ')[0],
                    repartidor_telefono: repartidorData.telefono,
                    idsede: rowDatos.establecimiento.idsede,
                    idorg: rowDatos.establecimiento.idorg,
                    time_line: _time_line                    
                };

                listClienteNotificar.push(rowCliente);
            }
        });

        const notificationServices = new NotificationSocketsService(SocketClient.getInstance())
        notificationServices.emitPedidoAceptado(listClienteNotificar)

        
    }

    loadPedidosAceptadosStorage = () => {
        const pedidosAceptados = localStorage.getItem('pedidos-aceptados')
        if (pedidosAceptados) {
            this.listPedidoAceptados = JSON.parse(pedidosAceptados)

            listPedidosAceptadosStorage.update(() => {
                return this.listPedidoAceptados
            })
        }
    }

    getPedidosAcceptados = () => {
        const pedidosAceptados = localStorage.getItem('pedidos-aceptados')
        return pedidosAceptados ? JSON.parse(pedidosAceptados) : []        
    }

    // guarda en localstorage los pedidos aceptados
    savePedidoAceptadosLocalStorage = () => {
        localStorage.setItem('pedidos-aceptados', JSON.stringify(this.listPedidoAceptados))
    }

    // pedido entregado
    pedidoEntregado = async (order: any) => {
        const idrepartidor = getValueToken('usuario').idrepartidor 
        const isrepartidor_propio = getValueToken('usuario').idsede_suscrito == null ? false : true
        const pwa_delivery_comision_fija_no_afiliado = order.json_datos_delivery.p_header.arrDatosDelivery.establecimineto?.pwa_delivery_comision_fija_no_afiliado || 0

        // time_line marcar hora entregado
        const timeLineServices = new TimeLinePedido()
        timeLineServices.setData(order.time_line);
        timeLineServices.marcarPedidoEntregado()
        order.time_line = timeLineServices.getData()

        const _dataSend = {
            idrepartidor: idrepartidor,
            idpedido: order.idpedido,
            time_line: order.time_line,
            idcliente: order.idcliente,
            idsede: order.idsede,
            operacion: {
                isrepartidor_propio: isrepartidor_propio,
                metodoPago: order.json_datos_delivery.p_header.arrDatosDelivery.metodoPago,
                importeTotalPedido: order.total_r,
                importePagadoRepartidor: order.total_paga_repartidor, // (a)(b)
                comisionRepartidor: isrepartidor_propio ? 0 : order.costo_delivery, // comisionRepartidor - this.pedidoRepartidor.datosComercio.pwa_delivery_comision_fija_no_afiliado, // menos costo fijo comercio no afiliado,
                propinaRepartidor: isrepartidor_propio ? 0 : order.propina_repartidor,
                costoTotalServicio: isrepartidor_propio ? 0 : order.costo_delivery + order.propina_repartidor,
                importeDepositar: isrepartidor_propio ? 0 : parseFloat(pwa_delivery_comision_fija_no_afiliado).toFixed(2) // (a)
            }
        };

        if (isrepartidor_propio ) {
            order.estado = 4;
            order.paso_va = 4;
            order.pwa_delivery_status = 4;
        } else {
            order.estado = 2
        }

        // local storage
        this.savePedidoAceptadosLocalStorage()

        listPedidosAceptadosStorage.update(() => {
            return this.listPedidoAceptados
        })

        const rpt = await postDataJSON('repartidor', 'set-fin-pedido-entregado', _dataSend)
        // return rpt

        const socketService = SocketClient.getInstance()
        if (isrepartidor_propio) {
            socketService.sendMessage('repartidor-propio-notifica-fin-pedido', order);
        } else {
            socketService.sendMessage('repartidor-notifica-fin-one-pedido', order);
        }
    }

    // actualiza el estado de los pedidos
    // esta funcion lo activa desde el watchPosition del servicio de geolocalizacion    
    actualizarEstadoPedidos = (coordOrigen: { latitude: number; longitude: number }) => {
        if (this.listPedidoAceptados.length === 0) {
            this.getPedidosAcceptados()
        }


        if ( this.listPedidoAceptados.length > 0 ) {
            // si  no fueron entregados
            this.listPedidoAceptados.filter(order => order.pwa_estado !== 'E').map((order: any) => {                
                this.actualizarTimeLinePedido(order, coordOrigen)
            })
        }
    }

    
    // Función para actualizar el estado del pedido en función de la ubicación del repartidor
    private actualizarTimeLinePedido(order: any, coordOrigen: { latitude: number; longitude: number }) {
        const geoLocationServices = new GeoLocationServices();
        const currentCoordinates = coordOrigen;

        if (!currentCoordinates) {
            return; // No se pueden obtener las coordenadas del repartidor
        }

        const dataComercio = order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento;   
        let coordDirComercio: any = {};
        try {
            if (dataComercio.latitude === 0 ) return false
            coordDirComercio = {latitude: dataComercio.latitude, longitude: dataComercio.longitude} ;
        } catch (error) {
          // si el comercio no tiene coordenadas    
          return false  
        }
        
        const llegoAlComercio = geoLocationServices.estaDentroDelUmbral(currentCoordinates, coordDirComercio);        
        
        // Verifica si el repartidor llegó al comercio
        if (!order.time_line.llego_al_comercio && llegoAlComercio) {
            
            const timeLineServices = new TimeLinePedido()
            timeLineServices.setData(order.time_line);
            timeLineServices.marcarLlegadaAlComercio()
            order.time_line = timeLineServices.getData()

            this.savePedidoAceptadosLocalStorage();
            this.notificarTimeLinePedido(order)
        }

        // Verifica si el repartidor sale hacia la dirección de entrega
        if (order.time_line.llego_al_comercio 
            && !order.time_line.en_camino_al_cliente 
            && !llegoAlComercio) {

            const timeLineServices = new TimeLinePedido()
            timeLineServices.setData(order.time_line);
            timeLineServices.marcarEnCaminoAlCliente()
            order.time_line = timeLineServices.getData()

            // order.time_line.marcarEnCaminoAlCliente();
            this.savePedidoAceptadosLocalStorage();
            this.notificarTimeLinePedido(order)
        }

        // Otras acciones según sea necesario
    }


    // notifica al cliente el time_line del pedido  
    private notificarTimeLinePedido = (order: any) => {
        const rowDatos = order?.json_datos_delivery?.p_header?.arrDatosDelivery;
        const repartidorData = DeliveryDriver.getInstance().getUserData()

        const rowCliente = {
            nombre: rowDatos.nombre.split(' ')[0],
            telefono: rowDatos.telefono,
            establecimiento: rowDatos.establecimiento.nombre,
            idpedido: order.idpedido,
            repartidor_nom: repartidorData.nombre.split(' ')[0],
            repartidor_telefono: repartidorData.telefono,
            repartidor_id: repartidorData.idrepartidor, // update timeline
            time_line: order.time_line, // update timeline
            tipo_msj: order.time_line.paso
        }

        const listClienteNotificar:any = [];
        listClienteNotificar.push(rowCliente);

        const notificationServices = new NotificationSocketsService(SocketClient.getInstance())
        notificationServices.emitTimeLinePedido(listClienteNotificar)
        
    }

    listaPedidosEntregados = () => {
        DeliveryDriver.getInstance().resetPedidosAsignados()
        let repartidorData = DeliveryDriver.getInstance().getUserData()
        repartidorData.countPedidosAsignados = 0
        DeliveryDriver.getInstance().setUserData(repartidorData)

        const notificationServices = new NotificationSocketsService(SocketClient.getInstance())
        notificationServices.emitTerminoEntregarPedidos(repartidorData.idrepartidor)        
        this.removePedidoAceptado()
    }

    // remueve el pedido de la lista de pedidos aceptados tambien del localstorage
    private removePedidoAceptado = () => {
        this.listPedidoAceptados = []
        this.savePedidoAceptadosLocalStorage()
    }


    // repartidor se asigna pedido
    asignarsePedido = async (idpedido: number): Promise<any> => {
        let rptReturn: any = { success: false, message: 'Error al asignar el pedido' }          
        let repartidorData = DeliveryDriver.getInstance().getUserData()
        repartidorData.countPedidosAsignados = repartidorData.countPedidosAsignados ? repartidorData.countPedidosAsignados : 0;

        if (repartidorData.countPedidosAsignados >= 3) {            
            rptReturn.message = 'Ya tienes muchos pedidos!. Entrega lo que tienes primero.'
            rptReturn.success = false
            return rptReturn
        }

        const _dataSend = {
            idpedido: idpedido,
            idrepartidor: repartidorData.idrepartidor
        }

        const rpt = await postDataJSON('comercio', 'get-pedido-by-id', _dataSend)                

        if (rpt.data.length > 0){
            const pedido = rpt.data[0]
            
            // verificamos si tiene repartidor asignado
            if (pedido.idrepartidor) {                
                rptReturn.message = 'El pedido ya tiene repatirdor asignado.';
                rptReturn.success = false
                return rptReturn
            }

            repartidorData.countPedidosAsignados++
            const idsPedido = idpedido.toString()
            
            await this.aceptarPedido(idsPedido)

            rptReturn.message = 'Pedido asignado correctamente.'
            rptReturn.success = true

            DeliveryDriver.getInstance().setUserData(repartidorData)

        } else {
            rptReturn.message = 'El pedido no existe.'
            rptReturn.success = false
        }
        
        return rptReturn

    }

    // emitir sonido de notificacion
    emitSoundNotification = (audioFile: any) => {
        const audio = new Audio(audioFile);
        audio.play();
    }

    // lista de pedidos pedientes por aceptar de cada comercio
    // cuando el repartidor es propio del comercio
    listOrderComercioPendientes = async () => {                
        const rpt = await getData('repartidor', 'get-list-pedidos-pendientes-comercio')
        return rpt
    }

    // pedido asignado desde restobar o pacman
    pedidoAsignadoComercioOrPacman = async (order: any) => {
        // obtenemos los pedidos que tiene el repartidor 
        const dataDriver = DeliveryDriver.getInstance().getUserData()
        order = this.cocinarDataPedido(order, dataDriver)

        // order.json_datos_delivery = typeof order.json_datos_delivery !== 'object' ? JSON.parse(order.json_datos_delivery) : order.json_datos_delivery;
        const _idsedeOrder = order.json_datos_delivery.p_header.arrDatosDelivery.establecimiento.idsede
        this.listPedidoAceptados = this.getPedidosAcceptados()
        let _listPedido: any = []
        let _importePedido = parseInt(order.total)
        _listPedido.push(order.idpedido)
        

        if (this.listPedidoAceptados.length > 0) {            
            this.listPedidoAceptados.map((x: any) => {
                _listPedido.push(x.idpedido)
                _importePedido += parseFloat(x.total)
            }) 
        } 
        

        const pedidos_repartidor = {
            pedidos: _listPedido,
            importe_acumula: _importePedido.toFixed(2),
            importe_pagar: _importePedido.toFixed(2),
            idsede: _idsedeOrder,
            idrepartidor: dataDriver.idrepartidor,
            pedido_asignado_manual: order.idpedido,
            inSede: true
        };

        const _dataSend = {
            pedido: pedidos_repartidor,
            repartidor: dataDriver
        };


        this.listPedidoAceptados.push(order)
        this.savePedidoAceptadosLocalStorage()
        this.actualizarVistas(this.listPedidoAceptados)

        // enviamos al backend
        await postDataJSON('monitor', 'set-asignar-pedido-manual', _dataSend)  


    }

    // obtener idpedido de los pedidos que tenemos en localstorage
    getIdsPedidosLocalStorage = () => {
        const listPedidos = this.getPedidosAcceptados()
        let _ids: any = []
        listPedidos.map((x: any) => {
            _ids.push(x.idpedido)
        })
        return _ids
    }

    // comparar pedios que tenemos en localstorage con los pedidos que nos envia el backend
    // retonar solo idpedido que no estan en localstorage
    getIdsPedidosNoLocalStorage = (listPedidos: any) => {
        const listPedidosLocalStorage = this.getIdsPedidosLocalStorage()
        let _ids: any = []
        listPedidos.map((x: any) => {
            if (!listPedidosLocalStorage.includes(x)) {
                _ids.push(x)
            }
        })
        return _ids
    }
}


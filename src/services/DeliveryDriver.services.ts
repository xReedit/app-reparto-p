class DeliveryDriver {
    private static instance: DeliveryDriver | null = null;
    private userData: any = null; // Puedes personalizar esta estructura según los datos del repartidor
    private keyStorage = 'delivery-driver';

    private constructor() {
        // Inicializa los datos del repartidor, por ejemplo, desde la sesión actual o una API
        // this.userData = { id: 1, name: 'Nombre del Repartidor', ... };
    }

    static getInstance(): DeliveryDriver {
        if (!DeliveryDriver.instance) {
            DeliveryDriver.instance = new DeliveryDriver();
        }
        return DeliveryDriver.instance;
    }

    getUserData(): any {
        return this.userData ? this.userData : JSON.parse(localStorage.getItem(this.keyStorage) || '{}');
    }

    // Puedes agregar métodos para actualizar los datos del repartidor según sea necesario

    isLoggedIn(): boolean {
        return !!this.userData;
    }

    setUserData(userData: any): void {
        // Lógica para iniciar sesión del repartidor y establecer userData
        this.userData = userData;

        // guardamos en storage
        localStorage.setItem(this.keyStorage, JSON.stringify(userData));
    }

    // sumar los pedidos asignados
    sumarPedidosAsignados() {
        const userData = this.getUserData();
        userData.pedidos_asignados = userData.pedidos_asignados ? userData.pedidos_asignados + 1 :  1;
        this.setUserData(userData);
    }

    // reset pedidos asignados
    resetPedidosAsignados() {
        const userData = this.getUserData();
        userData.pedidos_asignados = 0;
        this.setUserData(userData);
    }

    isRepartidorPropio() {
        const userData = this.getUserData();
        return userData.idsede_suscrito === null ? false : true;
    }

    logout(): void {
        // Lógica para cerrar sesión del repartidor y limpiar los datos
        this.userData = null;
    }
}

export default DeliveryDriver;

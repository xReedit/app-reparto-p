export function calculateTimePedido(inputDate: string): { hora: number; minutos: number; horaString: string; } {   
    const currentDate = new Date();
    const pastDate = new Date(inputDate);

    const elapsedMilliseconds = currentDate.getTime() - pastDate.getTime();
    const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

    if (elapsedMinutes < 60) {
        const _horaString = `${elapsedMinutes}min`;
        return { hora: 0, minutos: elapsedMinutes, horaString: _horaString };  
    } else {
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const remainingMinutes = elapsedMinutes % 60;
        const _horaString = elapsedHours > 0 ? `${elapsedHours}hr ${remainingMinutes}min` : `${remainingMinutes}min`;
        return { hora: elapsedHours, minutos: elapsedMinutes, horaString: _horaString };  
    }
}

export function xGetClassTpDelivery(_idtipo_pago: string) {    
    const _classTp = ['badge-secondary', 'badge-primary', 'badge-papaya', 'badge-info', 'badge-warning', 'badge-dark', 'badge-primary']
    return _classTp[parseInt(_idtipo_pago) - 1];
}  

// funcion capitalize la primeras letras de la cadena en mayusculas
export function capitalizeFirstLetter(string: string) {
    string = string.toLocaleLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1);
}
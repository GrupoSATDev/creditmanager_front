export function parseCurrency(value: string): number {
    if (!value) {
        return 0; // Retorna 0 si el valor es nulo o indefinido
    }
    // Elimina el símbolo de moneda, comas y convierte a número
    const cleanedValue = value.replace(/[\$,]/g, '');
    return parseFloat(cleanedValue);
}

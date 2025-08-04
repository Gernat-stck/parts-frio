import { DEPARTAMENTS, MUNICIPALITIES_BY_DEPARTMENT } from '../constants/salesConstants';

export function formatUbicacion(ubicacion: string): string {
    const [municipioId, departamentoId] = ubicacion.split(' ');

    const departamento = DEPARTAMENTS.find((d) => d.value === departamentoId)?.label || 'DESCONOCIDO';
    const municipio = MUNICIPALITIES_BY_DEPARTMENT[departamentoId]?.find((m) => m.value === municipioId)?.label || 'DESCONOCIDO';
    return `${municipio}, ${departamento.toUpperCase()}`;
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  /**
   * Formatea una fecha de manera consistente para evitar problemas de zona horaria
   * @param dateString - La fecha a formatear (puede ser string, Date, o cualquier formato)
   * @returns string en formato YYYY-MM-DD
   */
  formatDate(dateString: any): string {
    if (!dateString) return '';
    
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Si no, convertirla de manera segura
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formateando fecha:', error, dateString);
      return '';
    }
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   * @returns string en formato YYYY-MM-DD
   */
  getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Compara dos fechas en formato YYYY-MM-DD
   * @param date1 - Primera fecha
   * @param date2 - Segunda fecha
   * @returns true si las fechas son iguales
   */
  areDatesEqual(date1: string, date2: string): boolean {
    return this.formatDate(date1) === this.formatDate(date2);
  }

  /**
   * Verifica si una fecha es hoy
   * @param dateString - La fecha a verificar
   * @returns true si la fecha es hoy
   */
  isToday(dateString: string): boolean {
    return this.areDatesEqual(dateString, this.getTodayString());
  }
}

export function formatDateString(date: string): string {
  if (!date) return '';
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }
  // Si es un string ISO o con hora, extrae solo la parte de la fecha
  return date.substring(0, 10);
} 

export function formatToDDMMYYYY(date: string): string {
  if (!date) return '';
  const [yyyy, mm, dd] = date.substring(0, 10).split('-');
  return `${dd}/${mm}/${yyyy}`;
} 

export function extractHourFromISO(date: string): string {
  if (!date) return '';
  // Si el string tiene formato ISO, extrae la parte de la hora
  // Ejemplo: 2024-06-25T14:30:00.000Z => 14:30
  const match = date.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : '';
} 
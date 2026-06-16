import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calendar } from './components/calendar'; 
import { RouterOutlet } from '@angular/router';
import { EventList } from './components/event-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, EventList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 
  protected calendar = inject(calendar);
  protected readonly title = signal('Lazy Calendar v1');
  protected showEvents = signal(false);
  protected monthLabel = computed(() => {
    const d = this.calendar.selectedDate();
    try {
      return d.toLocaleString('es-ES', { month: 'long' }).replace(/\b./, s => s.toUpperCase()) + ' ' + d.getFullYear();
    } catch {
      return `${d.getMonth() + 1}/${d.getFullYear()}`;
    }
  });

  getEventsForDay(day: Date | null) {
    if (!day) return [];
    const dateStr = day.toISOString().split('T')[0];
    return this.calendar.events().filter(e => e.date === dateStr);
  }


addEventPrompt(day: Date | null) {
  if (!day) return;

  const title = prompt('Nombre del evento (máx. 250 caracteres):');
   
  if (!title || title.trim().length === 0) return;
  
  if (title.length > 250) {
    alert('El evento es demasiado largo. Máximo 250 caracteres.');
    return;
  }

  const dateStr = day.toISOString().split('T')[0];
  this.calendar.addEvent({
    id: crypto.randomUUID(),
    date: dateStr,
    title: title.trim()
  });
}

removeEvent(event: any, eventId: string) {
  
  event.stopPropagation();
  
  if (confirm('¿Seguro que quieres eliminar este evento?')) {
    this.calendar.removeEvent(eventId);
  }
}

clearCalendar() {
  if (confirm('¿Estás seguro de que quieres borrar TODOS los eventos? Esta acción no se puede deshacer.')) {
    this.calendar.clearAllEvents();
  }
}
}
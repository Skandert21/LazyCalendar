import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calendar } from './calendar';

@Component({
  selector: 'event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.scss']
})
export class EventList {
  protected calendar = inject(calendar);

  protected sortedEvents = computed(() => {
    return this.calendar.events().slice().sort((a, b) => a.date.localeCompare(b.date));
  });

  protected formatDate(dateStr: string) {
    // expect YYYY-MM-DD -> return DD-MM-YYYY
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  protected removeEvent(ev: { id: string }, $event: Event) {
    $event.stopPropagation();
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return;
    this.calendar.removeEvent(ev.id);
  }
}

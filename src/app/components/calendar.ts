import { Injectable, signal, computed, effect } from '@angular/core';

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class calendar {
  events = signal<CalendarEvent[]>(JSON.parse(localStorage.getItem('events') || '[]'));
  selectedDate = signal(new Date());

  constructor() {
     
    effect(() => {
      localStorage.setItem('events', JSON.stringify(this.events()));
    });
  }
  daysInMonth = computed(() => {
    const date = this.selectedDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
    
    return days;
  });

  addEvent(event: CalendarEvent) {
    this.events.update(prev => [...prev, event]);
    localStorage.setItem('events', JSON.stringify(this.events()));
  }

 
removeEvent(id: string) {
  this.events.update(prev => prev.filter(e => e.id !== id));
  
}

clearAllEvents() {
  this.events.set([]);
 
}
}
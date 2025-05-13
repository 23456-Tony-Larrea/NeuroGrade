import React, { useState } from 'react';
import { Calendar as FullCalendar } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useAuthStore } from '../stores/authStore';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  courseId?: string;
  type: 'assignment' | 'exam' | 'class';
  allowLateSubmission?: boolean;
}

interface CalendarProps {
  events?: Event[];
  onEventAdd?: (event: Event) => void;
  onEventUpdate?: (event: Event) => void;
}

const eventTypes = [
  { label: 'Tarea', value: 'assignment' },
  { label: 'Examen', value: 'exam' },
  { label: 'Clase', value: 'class' }
];

const courses = [
  { label: 'Matemáticas', value: '1' },
  { label: 'Física', value: '2' },
  { label: 'Química', value: '3' }
];

export default function Calendar({ events: initialEvents = [], onEventAdd, onEventUpdate }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<Event> | null>(null);
  const { user } = useAuthStore();

  const handleDateSelect = (selectInfo: any) => {
    if (user?.role === 'teacher') {
      setSelectedEvent({
        start: selectInfo.start,
        end: selectInfo.end,
        type: 'assignment'
      });
      setShowEventDialog(true);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (user?.role === 'teacher') {
      setSelectedEvent({
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        description: clickInfo.event.extendedProps.description,
        type: clickInfo.event.extendedProps.type,
        courseId: clickInfo.event.extendedProps.courseId,
        allowLateSubmission: clickInfo.event.extendedProps.allowLateSubmission
      });
      setShowEventDialog(true);
    }
  };

  const handleSaveEvent = () => {
    if (!selectedEvent?.title || !selectedEvent.start || !selectedEvent.end) return;

    const newEvent: Event = {
      id: selectedEvent.id || Date.now().toString(),
      title: selectedEvent.title,
      start: new Date(selectedEvent.start),
      end: new Date(selectedEvent.end),
      description: selectedEvent.description,
      type: selectedEvent.type as 'assignment' | 'exam' | 'class',
      courseId: selectedEvent.courseId,
      allowLateSubmission: selectedEvent.allowLateSubmission
    };

    if (selectedEvent.id) {
      setEvents(events.map(e => e.id === selectedEvent.id ? newEvent : e));
      onEventUpdate?.(newEvent);
    } else {
      setEvents([...events, newEvent]);
      onEventAdd?.(newEvent);
    }

    setShowEventDialog(false);
    setSelectedEvent(null);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return '#4CAF50';
      case 'exam':
        return '#F44336';
      case 'class':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={user?.role === 'teacher'}
        selectable={user?.role === 'teacher'}
        selectMirror={true}
        dayMaxEvents={true}
        events={events.map(event => ({
          ...event,
          backgroundColor: getEventColor(event.type)
        }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        locale="es"
      />

      <Dialog
        visible={showEventDialog}
        onHide={() => {
          setShowEventDialog(false);
          setSelectedEvent(null);
        }}
        header={selectedEvent?.id ? 'Editar Evento' : 'Nuevo Evento'}
        modal
        style={{ width: '50vw' }}
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <InputText
              value={selectedEvent?.title || ''}
              onChange={(e) => setSelectedEvent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <InputTextarea
              value={selectedEvent?.description || ''}
              onChange={(e) => setSelectedEvent(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
              <PrimeCalendar
                value={selectedEvent?.start}
                onChange={(e) => setSelectedEvent(prev => ({ ...prev, start: e.value }))}
                showTime
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Fin</label>
              <PrimeCalendar
                value={selectedEvent?.end}
                onChange={(e) => setSelectedEvent(prev => ({ ...prev, end: e.value }))}
                showTime
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Dropdown
                value={selectedEvent?.type}
                options={eventTypes}
                onChange={(e) => setSelectedEvent(prev => ({ ...prev, type: e.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <Dropdown
                value={selectedEvent?.courseId}
                options={courses}
                onChange={(e) => setSelectedEvent(prev => ({ ...prev, courseId: e.value }))}
                className="w-full"
              />
            </div>
          </div>

          {selectedEvent?.type === 'assignment' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowLateSubmission"
                checked={selectedEvent.allowLateSubmission}
                onChange={(e) => setSelectedEvent(prev => ({
                  ...prev,
                  allowLateSubmission: e.target.checked
                }))}
              />
              <label htmlFor="allowLateSubmission" className="text-sm">
                Permitir entregas tardías
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              label="Cancelar"
              onClick={() => {
                setShowEventDialog(false);
                setSelectedEvent(null);
              }}
              className="p-button-text"
            />
            <Button
              label="Guardar"
              onClick={handleSaveEvent}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
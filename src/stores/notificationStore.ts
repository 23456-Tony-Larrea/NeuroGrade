import { create } from 'zustand';
import { format } from 'date-fns';
import { sendNotificationEmail, sendParentNotification } from '../lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'assignment' | 'grade' | 'system';
  status: 'unread' | 'read';
  date: string;
  courseId?: string;
  courseName?: string;
  link?: string;
  studentId?: string;
  parentEmail?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'status' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  sendParentAssignmentNotification: (studentId: string, parentEmail: string, assignmentTitle: string, dueDate: string) => Promise<void>;
  sendParentAttendanceNotification: (studentId: string, parentEmail: string, date: string, status: string) => Promise<void>;
  sendParentGradeNotification: (studentId: string, parentEmail: string, course: string, grade: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'Falta Registrada',
      message: 'Se ha registrado una falta en la clase de Matemáticas',
      type: 'attendance',
      status: 'unread',
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      courseId: '1',
      courseName: 'Matemáticas'
    },
    {
      id: '2',
      title: 'Tarea Pendiente',
      message: 'La entrega del proyecto final de Física vence mañana',
      type: 'assignment',
      status: 'unread',
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      courseId: '2',
      courseName: 'Física',
      link: '/assignments'
    }
  ],
  unreadCount: 2,

  addNotification: (notification) =>
    set((state) => {
      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        status: 'unread',
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      };

      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, status: 'read' } : notification
      ),
      unreadCount: state.unreadCount - 1
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        status: 'read'
      })),
      unreadCount: 0
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0
    }),

  sendParentAssignmentNotification: async (studentId: string, parentEmail: string, assignmentTitle: string, dueDate: string) => {
    const message = `Su representado tiene una nueva tarea asignada: ${assignmentTitle}. Fecha de entrega: ${dueDate}`;
    
    await sendParentNotification({
      studentId,
      parentEmail,
      type: 'assignment',
      message
    });

    await sendNotificationEmail({
      to: parentEmail,
      subject: 'Nueva Tarea Asignada',
      text: message,
      html: `
        <h2>Nueva Tarea Asignada</h2>
        <p>${message}</p>
        <p>Por favor, asegúrese de que su representado complete la tarea antes de la fecha límite.</p>
      `
    });
  },

  sendParentAttendanceNotification: async (studentId: string, parentEmail: string, date: string, status: string) => {
    const message = `Su representado ha ${status === 'absent' ? 'faltado' : 'llegado tarde'} a clases el día ${date}`;
    
    await sendParentNotification({
      studentId,
      parentEmail,
      type: 'attendance',
      message
    });

    await sendNotificationEmail({
      to: parentEmail,
      subject: 'Notificación de Asistencia',
      text: message,
      html: `
        <h2>Notificación de Asistencia</h2>
        <p>${message}</p>
        <p>Por favor, tome las medidas necesarias para asegurar la asistencia regular de su representado.</p>
      `
    });
  },

  sendParentGradeNotification: async (studentId: string, parentEmail: string, course: string, grade: number) => {
    const message = `Se ha registrado una nueva calificación para su representado en ${course}: ${grade}/100`;
    
    await sendParentNotification({
      studentId,
      parentEmail,
      type: 'grade',
      message
    });

    await sendNotificationEmail({
      to: parentEmail,
      subject: 'Nueva Calificación Registrada',
      text: message,
      html: `
        <h2>Nueva Calificación Registrada</h2>
        <p>${message}</p>
        <p>Puede revisar más detalles en el portal de padres.</p>
      `
    });
  }
}));
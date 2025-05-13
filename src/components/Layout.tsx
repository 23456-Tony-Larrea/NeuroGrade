import React, { useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useRole } from '../context/RoleContext';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useChatStore } from '../stores/chatStore';
import { PanelMenu } from 'primereact/panelmenu';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { OverlayPanel } from 'primereact/overlaypanel';
import NotificationPanel from './NotificationPanel';
import ChatWindow from './chat/ChatWindow';
import { BookOpen, Users, Bell, User, Settings, GraduationCap, FileText, BarChart2, Menu, LogOut, UserCheck, ClipboardList, MessageCircle, Home, MessageSquare, School, PieChart, Calendar, UserPlus, ShieldCheck, BookCheck, ClipboardCheck as ChalkboardTeacher, Presentation, Award } from 'lucide-react';

export default function Layout() {
  const { darkMode } = useTheme();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const notificationPanel = useRef<OverlayPanel>(null);
  const chatPanel = useRef<OverlayPanel>(null);
  const { unreadCount: chatUnreadCount } = useChatStore();

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const sidebarBg = darkMode ? 'bg-gray-800' : 'bg-sky-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-sky-200';

  const getMenuItems = (): MenuItem[] => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            label: 'Dashboard',
            icon: <BarChart2 className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/dashboard')
          },
          {
            label: 'Gestión de Usuarios',
            icon: <UserPlus className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/users')
          },
          {
            label: 'Roles y Permisos',
            icon: <ShieldCheck className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/roles')
          }
        ];

      case 'teacher':
        return [
          {
            label: 'Dashboard',
            icon: <BarChart2 className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/dashboard')
          },
          {
            label: 'Cursos',
            icon: <ChalkboardTeacher className="h-4 w-4 text-sky-600" />,
            items: [
              {
                label: 'Mis Cursos',
                command: () => navigate('/dashboard')
              },
              {
                label: 'Calendario',
                command: () => navigate('/dashboard')
              }
            ]
          },
          {
            label: 'Calificaciones',
            icon: <Award className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/teacher/grading')
          },
          {
            label: 'Asistencia',
            icon: <UserCheck className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/teacher/attendance')
          },
          {
            label: 'Tareas',
            icon: <BookCheck className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/assignments')
          },
          {
            label: 'Cuestionarios',
            icon: <Presentation className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/questionnaires')
          }
        ];

      case 'student':
        return [
          {
            label: 'Dashboard',
            icon: <BarChart2 className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/dashboard')
          },
          {
            label: 'Mis Cursos',
            icon: <School className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/dashboard')
          },
          {
            label: 'Tareas',
            icon: <BookCheck className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/assignments')
          },
          {
            label: 'Calificaciones',
            icon: <Award className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/grades')
          }
        ];

      case 'parent':
        return [
          {
            label: 'Dashboard',
            icon: <Home className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/parent/dashboard')
          },
          {
            label: 'Mensajes',
            icon: <MessageSquare className="h-4 w-4 text-sky-600" />,
            command: () => navigate('/parent/messages')
          }
        ];

      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <header className={`${sidebarBg} border-b ${borderColor} px-6 py-4 fixed top-0 w-full z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <School className="h-8 w-8 text-sky-600" />
            <h1 className={`text-2xl font-bold ${textColor}`}>Neugrade</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              icon={<Bell className="h-5 w-5" />}
              className="p-button-text p-button-rounded"
              badge={unreadCount.toString()}
              onClick={(e) => notificationPanel.current?.toggle(e)}
            />
            {user?.role === 'teacher' && (
              <Button
                icon={<MessageCircle className="h-5 w-5" />}
                className="p-button-text p-button-rounded"
                badge={chatUnreadCount.toString()}
                onClick={(e) => chatPanel.current?.toggle(e)}
              />
            )}
            <Button
              icon={<User className="h-5 w-5" />}
              className="p-button-text p-button-rounded"
            />
            <Button
              icon={<LogOut className="h-5 w-5" />}
              className="p-button-text p-button-rounded"
              onClick={handleLogout}
              tooltip="Cerrar Sesión"
            />
          </div>
        </div>
      </header>

      <OverlayPanel ref={notificationPanel} showCloseIcon>
        <NotificationPanel op={notificationPanel} />
      </OverlayPanel>

      <OverlayPanel ref={chatPanel} showCloseIcon>
        <div className="w-96">
          <ChatWindow />
        </div>
      </OverlayPanel>

      <aside className={`${sidebarBg} border-r ${borderColor} fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto`}>
        <div className="p-4">
          <PanelMenu model={getMenuItems()} className="w-full" />
        </div>
      </aside>

      <main className="ml-64 pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
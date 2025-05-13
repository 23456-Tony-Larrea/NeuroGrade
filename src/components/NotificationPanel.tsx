import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Bell, Calendar, Clock, BookOpen, Award } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationPanelProps {
  op: React.RefObject<OverlayPanel>;
}

export default function NotificationPanel({ op }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'assignment':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'grade':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    op.current?.hide();
  };

  return (
    <div className="w-96 max-h-[80vh] overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notificaciones</h3>
          <Button
            label="Marcar todo como leído"
            link
            size="small"
            onClick={markAllAsRead}
          />
        </div>
      </div>
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              notification.status === 'unread' ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(notification.date), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                {notification.courseName && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {notification.courseName}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay notificaciones
          </div>
        )}
      </div>
    </div>
  );
}
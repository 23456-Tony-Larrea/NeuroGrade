export type Role = 'admin' | 'teacher' | 'student';

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface RolePermissions {
  admin: Permission[];
  teacher: Permission[];
  student: Permission[];
}

export const defaultPermissions: RolePermissions = {
  admin: [
    { id: 'manage_users', name: 'Gestionar Usuarios', description: 'Crear, editar y eliminar usuarios', enabled: true },
    { id: 'manage_roles', name: 'Gestionar Roles', description: 'Asignar y modificar roles de usuarios', enabled: true },
    { id: 'manage_courses', name: 'Gestionar Cursos', description: 'Crear y administrar cursos', enabled: true },
    { id: 'view_analytics', name: 'Ver Analíticas', description: 'Acceso a estadísticas y reportes', enabled: true },
    { id: 'manage_system', name: 'Configuración del Sistema', description: 'Modificar configuraciones globales', enabled: true }
  ],
  teacher: [
    { id: 'manage_assignments', name: 'Gestionar Tareas', description: 'Crear y calificar tareas', enabled: true },
    { id: 'manage_grades', name: 'Gestionar Calificaciones', description: 'Asignar y modificar calificaciones', enabled: true },
    { id: 'take_attendance', name: 'Tomar Asistencia', description: 'Registrar asistencia de estudiantes', enabled: true },
    { id: 'message_students', name: 'Mensajes a Estudiantes', description: 'Enviar mensajes a estudiantes', enabled: true },
    { id: 'view_reports', name: 'Ver Reportes', description: 'Acceso a reportes de rendimiento', enabled: true }
  ],
  student: [
    { id: 'view_courses', name: 'Ver Cursos', description: 'Acceso a cursos inscritos', enabled: true },
    { id: 'submit_assignments', name: 'Entregar Tareas', description: 'Subir y entregar tareas', enabled: true },
    { id: 'view_grades', name: 'Ver Calificaciones', description: 'Consultar calificaciones', enabled: true },
    { id: 'message_teachers', name: 'Mensajes a Profesores', description: 'Enviar mensajes a profesores', enabled: true },
    { id: 'view_materials', name: 'Ver Materiales', description: 'Acceso a materiales de curso', enabled: true }
  ]
};
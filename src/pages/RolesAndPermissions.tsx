import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { useTheme } from '../context/ThemeContext';
import { Shield, Users, Key } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

const initialPermissions: Permission[] = [
  { id: '1', name: 'view_dashboard', description: 'Ver Dashboard', module: 'Dashboard' },
  { id: '2', name: 'manage_users', description: 'Gestionar Usuarios', module: 'Usuarios' },
  { id: '3', name: 'manage_courses', description: 'Gestionar Cursos', module: 'Cursos' },
  { id: '4', name: 'view_grades', description: 'Ver Calificaciones', module: 'Calificaciones' },
  { id: '5', name: 'manage_grades', description: 'Gestionar Calificaciones', module: 'Calificaciones' },
  { id: '6', name: 'manage_attendance', description: 'Gestionar Asistencia', module: 'Asistencia' },
];

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Control total del sistema',
    permissions: ['1', '2', '3', '4', '5', '6']
  },
  {
    id: '2',
    name: 'Profesor',
    description: 'Gestión de cursos y estudiantes',
    permissions: ['1', '3', '4', '5', '6']
  },
  {
    id: '3',
    name: 'Estudiante',
    description: 'Acceso básico al sistema',
    permissions: ['1', '4']
  }
];

export default function RolesAndPermissions() {
  const { darkMode } = useTheme();
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';

  const permissionsBodyTemplate = (rowData: Role) => {
    const rolePermissions = permissions.filter(p => rowData.permissions.includes(p.id));
    return (
      <div className="flex flex-wrap gap-1">
        {rolePermissions.map(permission => (
          <span
            key={permission.id}
            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
          >
            {permission.name}
          </span>
        ))}
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Role) => (
    <div className="flex gap-2">
      <Button
        icon={<Key className="h-4 w-4" />}
        rounded
        text
        onClick={() => {
          setSelectedRole(rowData);
          setShowRoleDialog(true);
        }}
        tooltip="Editar Permisos"
      />
    </div>
  );

  const handleSaveRole = () => {
    if (selectedRole) {
      setRoles(roles.map(role =>
        role.id === selectedRole.id ? selectedRole : role
      ));
    }
    setShowRoleDialog(false);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className={`${cardBg} flex items-center p-4`}>
          <Shield className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Roles</h3>
            <p className="text-2xl font-bold text-blue-500">{roles.length}</p>
          </div>
        </Card>
        <Card className={`${cardBg} flex items-center p-4`}>
          <Key className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Permisos</h3>
            <p className="text-2xl font-bold text-green-500">{permissions.length}</p>
          </div>
        </Card>
        <Card className={`${cardBg} flex items-center p-4`}>
          <Users className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Usuarios Activos</h3>
            <p className="text-2xl font-bold text-purple-500">150</p>
          </div>
        </Card>
      </div>

      <Card title="Roles y Permisos" className={cardBg}>
        <DataTable
          value={roles}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          stripedRows
          className={darkMode ? 'dark-theme' : ''}
        >
          <Column field="name" header="Rol" sortable />
          <Column field="description" header="Descripción" sortable />
          <Column
            field="permissions"
            header="Permisos"
            body={permissionsBodyTemplate}
          />
          <Column body={actionBodyTemplate} style={{ width: '100px' }} />
        </DataTable>
      </Card>

      <Dialog
        visible={showRoleDialog}
        onHide={() => setShowRoleDialog(false)}
        header="Editar Permisos del Rol"
        modal
        className={darkMode ? 'dark-theme' : ''}
      >
        {selectedRole && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Rol</label>
              <InputText
                value={selectedRole.name}
                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <InputText
                value={selectedRole.description}
                onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Permisos</label>
              <MultiSelect
                value={selectedRole.permissions}
                options={permissions}
                onChange={(e) => setSelectedRole({ ...selectedRole, permissions: e.value })}
                optionLabel="name"
                optionValue="id"
                display="chip"
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                label="Cancelar"
                onClick={() => setShowRoleDialog(false)}
                className="p-button-text"
              />
              <Button
                label="Guardar"
                onClick={handleSaveRole}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
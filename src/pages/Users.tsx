import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
}

const initialUsers: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'María García', email: 'maria@example.com', role: 'teacher', status: 'active' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', role: 'student', status: 'active' },
];

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Profesor', value: 'teacher' },
  { label: 'Estudiante', value: 'student' },
];

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { darkMode } = useTheme();

  const columns = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Correo', sortable: true },
    {
      field: 'role',
      header: 'Rol',
      sortable: true,
      body: (rowData: User) => {
        const option = roleOptions.find(opt => opt.value === rowData.role);
        return option?.label || rowData.role;
      }
    },
    {
      field: 'status',
      header: 'Estado',
      sortable: true,
      body: (rowData: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          rowData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {rowData.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  const handleCreate = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleDelete = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
  };

  const handleSave = (formData: Partial<User>) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name || '',
        email: formData.email || '',
        role: formData.role || 'student',
        status: formData.status || 'active',
      };
      setUsers([...users, newUser]);
    }
    setShowDialog(false);
  };

  return (
    <div className="p-6">
      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Usuarios"
      />

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        modal
        className={darkMode ? 'dark-theme' : ''}
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <InputText
              value={editingUser?.name || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <InputText
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <Dropdown
              value={editingUser?.role || 'student'}
              options={roleOptions}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.value } : null)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <Dropdown
              value={editingUser?.status || 'active'}
              options={statusOptions}
              onChange={(e) => setEditingUser(prev => prev ? { ...prev, status: e.value } : null)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              label="Cancelar"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Guardar"
              onClick={() => handleSave(editingUser || {})}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
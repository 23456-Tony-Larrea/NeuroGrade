import React from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Shield, Users, GraduationCap } from 'lucide-react';

const roleIcons = {
  admin: <Shield className="h-5 w-5 text-red-500" />,
  teacher: <Users className="h-5 w-5 text-blue-500" />,
  student: <GraduationCap className="h-5 w-5 text-green-500" />
};

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Profesor', value: 'teacher' },
  { label: 'Estudiante', value: 'student' }
];

export default function RoleManager() {
  const { currentRole, setCurrentRole, permissions, updatePermission } = useRole();
  const { darkMode } = useTheme();

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <Card className={`${cardBg} border ${borderColor}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${textColor}`}>Gestión de Roles</h2>
          <div className="flex items-center space-x-2">
            {roleIcons[currentRole]}
            <Dropdown
              value={currentRole}
              options={roleOptions}
              onChange={(e) => setCurrentRole(e.value)}
              className="w-48"
            />
          </div>
        </div>

        <div className="space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className={`p-4 rounded-lg border ${borderColor} flex items-center justify-between`}
            >
              <div>
                <h3 className={`font-medium ${textColor}`}>{permission.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {permission.description}
                </p>
              </div>
              <InputSwitch
                checked={permission.enabled}
                onChange={(e) => updatePermission(permission.id, e.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
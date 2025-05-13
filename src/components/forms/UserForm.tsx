import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { useTheme } from '../../context/ThemeContext';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
  isEdit?: boolean;
}

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Profesor', value: 'teacher' },
  { label: 'Estudiante', value: 'student' },
];

export default function UserForm({ onSubmit, initialData, isEdit = false }: UserFormProps) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<UserFormData>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    confirmPassword: '',
    role: initialData?.role || 'student',
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validate = () => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="username" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Nombre de Usuario
          </label>
          <InputText
            id="username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className={`w-full ${errors.username ? 'p-invalid' : ''}`}
          />
          {errors.username && <small className="text-red-500">{errors.username}</small>}
        </div>

        <div className="field">
          <label htmlFor="email" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Correo Electrónico
          </label>
          <InputText
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full ${errors.email ? 'p-invalid' : ''}`}
          />
          {errors.email && <small className="text-red-500">{errors.email}</small>}
        </div>

        {!isEdit && (
          <>
            <div className="field">
              <label htmlFor="password" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <Password
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                toggleMask
                className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                feedback={false}
              />
              {errors.password && <small className="text-red-500">{errors.password}</small>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Confirmar Contraseña
              </label>
              <Password
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                toggleMask
                className={`w-full ${errors.confirmPassword ? 'p-invalid' : ''}`}
                feedback={false}
              />
              {errors.confirmPassword && <small className="text-red-500">{errors.confirmPassword}</small>}
            </div>
          </>
        )}

        <div className="field">
          <label htmlFor="role" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Rol
          </label>
          <Dropdown
            id="role"
            value={formData.role}
            options={roleOptions}
            onChange={(e) => handleChange('role', e.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            label={isEdit ? 'Actualizar' : 'Crear Usuario'}
            className="w-full md:w-auto"
          />
        </div>
      </form>
    </Card>
  );
}
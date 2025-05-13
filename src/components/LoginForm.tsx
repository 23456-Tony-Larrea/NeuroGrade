import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Moon, Sun, Key, User, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showUsernameRecovery, setShowUsernameRecovery] = useState(false);
  const [identity, setIdentity] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Credenciales incorrectas',
        life: 3000
      });
    }
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña',
      life: 3000
    });
    setShowPasswordRecovery(false);
    setIdentity('');
  };

  const handleUsernameRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Se ha enviado un correo con tu nombre de usuario',
      life: 3000
    });
    setShowUsernameRecovery(false);
    setIdentity('');
  };

  return (
    <>
      <Toast ref={toast} />
      {isLoading && <LoadingSpinner />}
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full space-y-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className={`h-10 w-10 ${darkMode ? 'text-sky-400' : 'text-sky-500'}`} />
              <span className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Neugrade
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="text-center">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Iniciar Sesión
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ingresa tus credenciales para acceder
            </p>
            <div className="mt-2">
              <p className="text-sm text-sky-500">
                Admin: admin/123 | Profesor: teacher/123 | Estudiante: student/123
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                  placeholder="Ingresa tu usuario"
                />
              </div>
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPasswordRecovery(true)}
                className={`text-sm ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <button
                type="button"
                onClick={() => setShowUsernameRecovery(true)}
                className={`text-sm ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}
              >
                ¿Olvidaste tu usuario?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-sky-500 hover:bg-sky-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500`}
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>

      {/* Dialog para recuperación de contraseña */}
      <Dialog
        visible={showPasswordRecovery}
        onHide={() => setShowPasswordRecovery(false)}
        header="Recuperar Contraseña"
        modal
        className={darkMode ? 'dark-theme' : ''}
      >
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-center mb-6">
            <Key className="h-12 w-12 text-sky-500" />
          </div>
          <form onSubmit={handlePasswordRecovery} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Identificación
              </label>
              <InputText
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full"
                placeholder="Ingresa tu número de identificación"
              />
              <p className="mt-2 text-sm text-gray-500">
                Ingresa tu número de identificación para recibir instrucciones de recuperación de contraseña
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                icon={<ArrowLeft className="h-4 w-4 mr-2" />}
                label="Volver"
                className="p-button-text"
                onClick={() => setShowPasswordRecovery(false)}
              />
              <Button
                icon={<Key className="h-4 w-4 mr-2" />}
                label="Recuperar Contraseña"
                type="submit"
              />
            </div>
          </form>
        </Card>
      </Dialog>

      {/* Dialog para recuperación de usuario */}
      <Dialog
        visible={showUsernameRecovery}
        onHide={() => setShowUsernameRecovery(false)}
        header="Recuperar Usuario"
        modal
        className={darkMode ? 'dark-theme' : ''}
      >
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-center mb-6">
            <User className="h-12 w-12 text-sky-500" />
          </div>
          <form onSubmit={handleUsernameRecovery} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Identificación
              </label>
              <InputText
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full"
                placeholder="Ingresa tu número de identificación"
              />
              <p className="mt-2 text-sm text-gray-500">
                Ingresa tu número de identificación para recibir tu nombre de usuario
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                icon={<ArrowLeft className="h-4 w-4 mr-2" />}
                label="Volver"
                className="p-button-text"
                onClick={() => setShowUsernameRecovery(false)}
              />
              <Button
                icon={<User className="h-4 w-4 mr-2" />}
                label="Recuperar Usuario"
                type="submit"
              />
            </div>
          </form>
        </Card>
      </Dialog>
    </>
  );
}
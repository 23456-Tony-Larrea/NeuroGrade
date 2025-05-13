import React from 'react';
import { useUserForm } from '../../hooks/useUserForm';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const roles = [
  { label: 'Administrador', value: 1 },
  { label: 'Profesor', value: 2 },
  { label: 'Estudiante', value: 3 },
  { label: 'Representante', value: 4 }
];

const genders = [
  { label: 'Masculino', value: 1 },
  { label: 'Femenino', value: 2 },
  { label: 'Otro', value: 3 }
];

export default function UserFormExample() {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useUserForm((data) => {
    console.log('Form submitted:', data);
    // Aquí iría la lógica para enviar los datos al servidor
  });

  return (
    <Card title="Registro de Usuario" className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div className="field">
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Apellido Paterno
            </label>
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.lastName && <small className="text-red-500">{errors.lastName}</small>}
          </div>

          <div className="field">
            <label htmlFor="secondName" className="block text-sm font-medium mb-1">
              Segundo Nombre
            </label>
            <InputText
              id="secondName"
              name="secondName"
              value={formData.secondName}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="secondLastName" className="block text-sm font-medium mb-1">
              Apellido Materno
            </label>
            <InputText
              id="secondLastName"
              name="secondLastName"
              value={formData.secondLastName}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="identity" className="block text-sm font-medium mb-1">
              Identificación
            </label>
            <InputText
              id="identity"
              name="identity"
              value={formData.identity}
              onChange={handleChange}
              className={errors.identity ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.identity && <small className="text-red-500">{errors.identity}</small>}
          </div>

          <div className="field">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div className="field">
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Teléfono
            </label>
            <InputText
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.phone && <small className="text-red-500">{errors.phone}</small>}
          </div>

          <div className="field">
            <label htmlFor="age" className="block text-sm font-medium mb-1">
              Edad
            </label>
            <InputNumber
              id="age"
              name="age"
              value={formData.age}
              onValueChange={(e) => setFieldValue('age', e.value)}
              className={errors.age ? 'p-invalid w-full' : 'w-full'}
              min={0}
              max={120}
            />
            {errors.age && <small className="text-red-500">{errors.age}</small>}
          </div>

          <div className="field">
            <label htmlFor="roleId" className="block text-sm font-medium mb-1">
              Rol
            </label>
            <Dropdown
              id="roleId"
              name="roleId"
              value={formData.roleId}
              options={roles}
              onChange={(e) => setFieldValue('roleId', e.value)}
              className={errors.roleId ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.roleId && <small className="text-red-500">{errors.roleId}</small>}
          </div>

          <div className="field">
            <label htmlFor="genderId" className="block text-sm font-medium mb-1">
              Género
            </label>
            <Dropdown
              id="genderId"
              name="genderId"
              value={formData.genderId}
              options={genders}
              onChange={(e) => setFieldValue('genderId', e.value)}
              className={errors.genderId ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.genderId && <small className="text-red-500">{errors.genderId}</small>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'p-invalid w-full' : 'w-full'}
              toggleMask
              feedback={false}
            />
            {errors.password && <small className="text-red-500">{errors.password}</small>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirmar Contraseña
            </label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'p-invalid w-full' : 'w-full'}
              toggleMask
              feedback={false}
            />
            {errors.confirmPassword && (
              <small className="text-red-500">{errors.confirmPassword}</small>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            className="p-button-text"
            onClick={() => {
              // Aquí iría la lógica para cancelar el formulario
            }}
          />
          <Button
            type="submit"
            label="Guardar"
            loading={isSubmitting}
          />
        </div>
      </form>
    </Card>
  );
}
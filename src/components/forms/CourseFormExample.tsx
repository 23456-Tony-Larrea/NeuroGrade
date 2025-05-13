import React from 'react';
import { useCourseForm } from '../../hooks/useCourseForm';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const teachers = [
  { label: 'Prof. García', value: 1 },
  { label: 'Prof. Rodríguez', value: 2 },
  { label: 'Prof. López', value: 3 }
];

export default function CourseFormExample() {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useCourseForm((data) => {
    console.log('Form submitted:', data);
    // Aquí iría la lógica para enviar los datos al servidor
  });

  return (
    <Card title="Registro de Curso" className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre del Curso
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
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <InputTextarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={errors.description ? 'p-invalid w-full' : 'w-full'}
          />
          {errors.description && <small className="text-red-500">{errors.description}</small>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Fecha de Inicio
            </label>
            <Calendar
              id="startDate"
              name="startDate"
              value={formData.startDate ? new Date(formData.startDate) : null}
              onChange={(e) => setFieldValue('startDate', e.value?.toISOString())}
              className={errors.startDate ? 'p-invalid w-full' : 'w-full'}
              showIcon
            />
            {errors.startDate && <small className="text-red-500">{errors.startDate}</small>}
          </div>

          <div className="field">
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              Fecha de Fin
            </label>
            <Calendar
              id="endDate"
              name="endDate"
              value={formData.endDate ? new Date(formData.endDate) : null}
              onChange={(e) => setFieldValue('endDate', e.value?.toISOString())}
              className={errors.endDate ? 'p-invalid w-full' : 'w-full'}
              showIcon
            />
            {errors.endDate && <small className="text-red-500">{errors.endDate}</small>}
          </div>

          <div className="field">
            <label htmlFor="maxStudents" className="block text-sm font-medium mb-1">
              Máximo de Estudiantes
            </label>
            <InputNumber
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents}
              onValueChange={(e) => setFieldValue('maxStudents', e.value)}
              className={errors.maxStudents ? 'p-invalid w-full' : 'w-full'}
              min={1}
              max={100}
            />
            {errors.maxStudents && <small className="text-red-500">{errors.maxStudents}</small>}
          </div>

          <div className="field">
            <label htmlFor="teacherId" className="block text-sm font-medium mb-1">
              Profesor
            </label>
            <Dropdown
              id="teacherId"
              name="teacherId"
              value={formData.teacherId}
              options={teachers}
              onChange={(e) => setFieldValue('teacherId', e.value)}
              className={errors.teacherId ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.teacherId && <small className="text-red-500">{errors.teacherId}</small>}
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
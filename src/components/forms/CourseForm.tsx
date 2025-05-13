import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { useTheme } from '../../context/ThemeContext';

interface CourseFormData {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  color: string;
  maxStudents: number;
}

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  initialData?: Partial<CourseFormData>;
  isEdit?: boolean;
}

export default function CourseForm({ onSubmit, initialData, isEdit = false }: CourseFormProps) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<CourseFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    color: initialData?.color || '#ff0000',
    maxStudents: initialData?.maxStudents || 30,
  });
  const [errors, setErrors] = useState<Partial<CourseFormData>>({});

  const validate = () => {
    const newErrors: Partial<CourseFormData> = {};

    if (!formData.name) {
      newErrors.name = 'El nombre del curso es requerido';
    }

    if (!formData.description) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
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

  const handleChange = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="name" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Nombre del Curso
          </label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full ${errors.name ? 'p-invalid' : ''}`}
          />
          {errors.name && <small className="text-red-500">{errors.name}</small>}
        </div>

        <div className="field">
          <label htmlFor="description" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Descripción
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className={`w-full ${errors.description ? 'p-invalid' : ''}`}
          />
          {errors.description && <small className="text-red-500">{errors.description}</small>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="startDate" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Fecha de Inicio
            </label>
            <Calendar
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.value as Date)}
              showIcon
              className={`w-full ${errors.startDate ? 'p-invalid' : ''}`}
            />
            {errors.startDate && <small className="text-red-500">{errors.startDate}</small>}
          </div>

          <div className="field">
            <label htmlFor="endDate" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Fecha de Fin
            </label>
            <Calendar
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.value as Date)}
              showIcon
              className={`w-full ${errors.endDate ? 'p-invalid' : ''}`}
            />
            {errors.endDate && <small className="text-red-500">{errors.endDate}</small>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="color" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Color del Curso
            </label>
            <ColorPicker
              id="color"
              value={formData.color}
              onChange={(e) => handleChange('color', e.value as string)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="maxStudents" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Máximo de Estudiantes
            </label>
            <InputText
              id="maxStudents"
              type="number"
              value={formData.maxStudents.toString()}
              onChange={(e) => handleChange('maxStudents', parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            label={isEdit ? 'Actualizar Curso' : 'Crear Curso'}
            className="w-full md:w-auto"
          />
        </div>
      </form>
    </Card>
  );
}
}
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { useTheme } from '../../context/ThemeContext';

interface AssignmentFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  courseId: string;
  maxScore: number;
  file?: File;
}

interface AssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => void;
  initialData?: Partial<AssignmentFormData>;
  courses: Array<{ label: string; value: string }>;
  isEdit?: boolean;
}

export default function AssignmentForm({ onSubmit, initialData, courses, isEdit = false }: AssignmentFormProps) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || null,
    courseId: initialData?.courseId || '',
    maxScore: initialData?.maxScore || 100,
    file: undefined,
  });
  const [errors, setErrors] = useState<Partial<AssignmentFormData>>({});

  const validate = () => {
    const newErrors: Partial<AssignmentFormData> = {};

    if (!formData.title) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de entrega es requerida';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'El curso es requerido';
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

  const handleChange = <K extends keyof AssignmentFormData>(field: K, value: AssignmentFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: any) => {
    if (event.files && event.files.length > 0) {
      handleChange('file', event.files[0]);
    }
  };

  return (
    <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="title" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Título
          </label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full ${errors.title ? 'p-invalid' : ''}`}
          />
          {errors.title && <small className="text-red-500">{errors.title}</small>}
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
            <label htmlFor="courseId" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Curso
            </label>
            <Dropdown
              id="courseId"
              value={formData.courseId}
              options={courses}
              onChange={(e) => handleChange('courseId', e.value)}
              className={`w-full ${errors.courseId ? 'p-invalid' : ''}`}
            />
            {errors.courseId && <small className="text-red-500">{errors.courseId}</small>}
          </div>

          <div className="field">
            <label htmlFor="dueDate" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Fecha de Entrega
            </label>
            <Calendar
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.value as Date)}
              showTime
              showIcon
              className={`w-full ${errors.dueDate ? 'p-invalid' : ''}`}
            />
            {errors.dueDate && <small className="text-red-500">{errors.dueDate}</small>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="maxScore" className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Puntuación Máxima
          </label>
          <InputText
            id="maxScore"
            type="number"
            value={formData.maxScore.toString()}
            onChange={(e) => handleChange('maxScore', parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>

        <div className="field">
          <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Archivo Adjunto
          </label>
          <FileUpload
            mode="basic"
            accept="application/pdf,.doc,.docx"
            maxFileSize={10000000}
            onSelect={handleFileUpload}
            chooseLabel={isEdit ? 'Actualizar Archivo' : 'Seleccionar Archivo'}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            label={isEdit ? 'Actualizar Tarea' : 'Crear Tarea'}
            className="w-full md:w-auto"
          />
        </div>
      </form>
    </Card>
  );
}
}
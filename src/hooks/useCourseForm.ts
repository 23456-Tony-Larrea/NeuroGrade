import { useForm, ValidationRules } from './useForm';

export interface CourseFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  isActive: boolean;
  teacherId: number;
}

const initialCourseFormData: CourseFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  maxStudents: 30,
  isActive: true,
  teacherId: 0
};

const courseValidationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: {
    required: true,
    maxLength: 500
  },
  startDate: {
    required: true,
    validate: (value) => {
      if (!value) return 'La fecha de inicio es requerida';
      const start = new Date(value);
      if (isNaN(start.getTime())) return 'Fecha de inicio inválida';
      if (start < new Date()) return 'La fecha de inicio no puede ser anterior a hoy';
      return true;
    }
  },
  endDate: {
    required: true,
    validate: (value, formData) => {
      if (!value) return 'La fecha de fin es requerida';
      const end = new Date(value);
      const start = new Date(formData.startDate);
      if (isNaN(end.getTime())) return 'Fecha de fin inválida';
      if (end <= start) return 'La fecha de fin debe ser posterior a la fecha de inicio';
      return true;
    }
  },
  maxStudents: {
    required: true,
    validate: (value) => {
      const max = Number(value);
      if (isNaN(max)) return 'El número máximo de estudiantes debe ser un número';
      if (max < 1) return 'El curso debe permitir al menos un estudiante';
      if (max > 100) return 'El número máximo de estudiantes no puede exceder 100';
      return true;
    }
  },
  teacherId: {
    required: true,
    validate: (value) => {
      if (!value) return 'Debe seleccionar un profesor';
      return true;
    }
  }
};

export function useCourseForm(onSubmit?: (data: CourseFormData) => void) {
  return useForm<CourseFormData>(initialCourseFormData, courseValidationRules, onSubmit);
}
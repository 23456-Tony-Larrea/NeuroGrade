import { useForm, ValidationRules } from './useForm';

export interface UserFormData {
  name: string;
  lastName: string;
  secondName: string;
  secondLastName: string;
  identity: string;
  email: string;
  phone: string;
  age: number;
  isTutor: boolean;
  isRepresentant: boolean;
  roleId: number;
  genderId: number;
  photo: string;
  password: string;
  confirmPassword: string;
}

const initialUserFormData: UserFormData = {
  name: '',
  lastName: '',
  secondName: '',
  secondLastName: '',
  identity: '',
  email: '',
  phone: '',
  age: 0,
  isTutor: false,
  isRepresentant: false,
  roleId: 0,
  genderId: 0,
  photo: '',
  password: '',
  confirmPassword: ''
};

const userValidationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (value) => {
      if (value.length > 100) return 'El email no debe exceder 100 caracteres';
      return true;
    }
  },
  phone: {
    pattern: /^\+?[\d\s-]{8,}$/
  },
  age: {
    validate: (value) => {
      const age = Number(value);
      if (isNaN(age)) return 'La edad debe ser un número';
      if (age < 0) return 'La edad no puede ser negativa';
      if (age > 120) return 'La edad no es válida';
      return true;
    }
  },
  identity: {
    required: true,
    minLength: 5,
    maxLength: 20
  },
  password: {
    required: true,
    minLength: 8,
    validate: (value) => {
      if (!/\d/.test(value)) return 'La contraseña debe contener al menos un número';
      if (!/[A-Z]/.test(value)) return 'La contraseña debe contener al menos una mayúscula';
      if (!/[a-z]/.test(value)) return 'La contraseña debe contener al menos una minúscula';
      if (!/[!@#$%^&*]/.test(value)) return 'La contraseña debe contener al menos un carácter especial';
      return true;
    }
  },
  confirmPassword: {
    required: true,
    validate: (value, formData) => value === formData.password || 'Las contraseñas no coinciden'
  }
};

export function useUserForm(onSubmit?: (data: UserFormData) => void) {
  return useForm<UserFormData>(initialUserFormData, userValidationRules, onSubmit);
}
import { create } from 'zustand';

export interface Course {
  id: string;
  name: string;
  teacher: string;
  color: string;
  icon: string;
  image: string;
  description: string;
  nextAssignment?: string;
  studentCount?: number;
  submissionRate?: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  submissionCount?: number;
  averageGrade?: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
  role: 'student' | 'teacher';
}

interface CourseState {
  courses: Course[];
  assignments: Assignment[];
  isLoading: boolean;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addComment: (assignmentId: string, comment: Omit<Comment, 'id'>) => void;
  submitAssignment: (assignmentId: string) => void;
}

const adminCourses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas Avanzadas',
    teacher: 'Prof. García',
    color: 'bg-red-500',
    icon: '📐',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
    description: 'Curso de matemáticas avanzadas incluyendo álgebra, cálculo y geometría.',
    studentCount: 35,
    submissionRate: 85
  },
  {
    id: '2',
    name: 'Física Cuántica',
    teacher: 'Prof. García',
    color: 'bg-blue-500',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60',
    description: 'Física moderna y clásica, incluyendo mecánica cuántica.',
    studentCount: 28,
    submissionRate: 92
  },
  {
    id: '3',
    name: 'Química Orgánica',
    teacher: 'Prof. García',
    color: 'bg-green-500',
    icon: '🧪',
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=60',
    description: 'Química orgánica avanzada con prácticas de laboratorio.',
    studentCount: 32,
    submissionRate: 78
  }
];

const studentCourses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas',
    teacher: 'Prof. García',
    color: 'bg-red-500',
    icon: '📐',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60',
    description: 'Curso de matemáticas avanzadas incluyendo álgebra, cálculo y geometría.',
    nextAssignment: 'Entrega de Proyecto - 20/03'
  },
  {
    id: '2',
    name: 'Física',
    teacher: 'Prof. Rodríguez',
    color: 'bg-blue-500',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60',
    description: 'Física moderna y clásica, incluyendo mecánica, termodinámica y electromagnetismo.',
    nextAssignment: 'Examen Parcial - 22/03'
  }
];

const initialAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Proyecto Final de Matemáticas',
    description: 'Desarrollar un proyecto que aplique los conceptos de cálculo diferencial.',
    dueDate: '2024-03-20',
    status: 'pending',
    submissionCount: 25,
    averageGrade: 85,
    comments: []
  },
  {
    id: '2',
    courseId: '1',
    title: 'Ejercicios de Integración',
    description: 'Resolver el conjunto de ejercicios de integración por partes.',
    dueDate: '2024-03-25',
    status: 'pending',
    submissionCount: 30,
    averageGrade: 88,
    comments: []
  },
  {
    id: '3',
    courseId: '2',
    title: 'Informe de Laboratorio',
    description: 'Realizar el informe del experimento de interferencia cuántica.',
    dueDate: '2024-03-22',
    status: 'pending',
    submissionCount: 22,
    averageGrade: 90,
    comments: []
  }
];

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  assignments: initialAssignments,
  isLoading: false,
  
  addAssignment: (newAssignment) => set((state) => ({
    assignments: [...state.assignments, { ...newAssignment, id: Date.now().toString() }]
  })),
  
  addComment: (assignmentId, newComment) => set((state) => ({
    assignments: state.assignments.map(assignment =>
      assignment.id === assignmentId
        ? {
            ...assignment,
            comments: [
              ...assignment.comments,
              { ...newComment, id: Date.now().toString() }
            ]
          }
        : assignment
    )
  })),
  
  submitAssignment: (assignmentId) => set((state) => ({
    assignments: state.assignments.map(assignment =>
      assignment.id === assignmentId
        ? { ...assignment, status: 'submitted' }
        : assignment
    )
  })),
}));
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import {
  BookOpen, Users, GraduationCap, FileText,
  Clock, Calendar, CheckCircle, XCircle,
  TrendingUp, BarChart2, PieChart
} from 'lucide-react';

interface Course {
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

const courses: Course[] = [
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

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuthStore();

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';

  const AdminDashboard = () => {
    const studentData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Estudiantes Activos',
          data: [150, 165, 180, 190, 200, 210],
          borderColor: '#4CAF50',
          tension: 0.4
        },
        {
          label: 'Nuevos Registros',
          data: [20, 25, 15, 30, 20, 15],
          borderColor: '#2196F3',
          tension: 0.4
        }
      ]
    };

    const attendanceData = {
      labels: ['Asistencias', 'Faltas Justificadas', 'Faltas Injustificadas'],
      datasets: [
        {
          data: [75, 15, 10],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
        }
      ]
    };

    const performanceData = {
      labels: ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia'],
      datasets: [
        {
          label: 'Promedio de Notas',
          data: [85, 78, 92, 88, 76],
          backgroundColor: '#2196F3'
        }
      ]
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className={`${cardBg} col-span-full`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-blue-100 rounded-lg">
              <Users className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Estudiantes</h3>
                <p className="text-2xl font-bold text-blue-600">520</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-100 rounded-lg">
              <GraduationCap className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Profesores</h3>
                <p className="text-2xl font-bold text-green-600">45</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-100 rounded-lg">
              <BookOpen className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Cursos</h3>
                <p className="text-2xl font-bold text-purple-600">32</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Crecimiento Estudiantil" className={cardBg}>
          <Chart type="line" data={studentData} />
        </Card>

        <Card title="Asistencia General" className={cardBg}>
          <Chart type="doughnut" data={attendanceData} />
        </Card>

        <Card title="Rendimiento por Materia" className={cardBg}>
          <Chart type="bar" data={performanceData} />
        </Card>
      </div>
    );
  };

  const TeacherDashboard = () => {
    const submissionData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Tareas Entregadas',
          data: [45, 52, 49, 60, 55, 58],
          borderColor: '#4CAF50',
          tension: 0.4
        },
        {
          label: 'Tareas Pendientes',
          data: [15, 8, 11, 5, 10, 7],
          borderColor: '#F44336',
          tension: 0.4
        }
      ]
    };

    const gradeDistribution = {
      labels: ['90-100', '80-89', '70-79', '60-69', '<60'],
      datasets: [
        {
          label: 'Estudiantes',
          data: [15, 25, 20, 10, 5],
          backgroundColor: [
            '#4CAF50',
            '#8BC34A',
            '#FFC107',
            '#FF9800',
            '#F44336'
          ]
        }
      ]
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${cardBg} flex items-center p-4`}>
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Asistencia Promedio</h3>
              <p className="text-2xl font-bold text-green-500">92%</p>
            </div>
          </Card>
          <Card className={`${cardBg} flex items-center p-4`}>
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Tareas Entregadas</h3>
              <p className="text-2xl font-bold text-blue-500">85%</p>
            </div>
          </Card>
          <Card className={`${cardBg} flex items-center p-4`}>
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Promedio General</h3>
              <p className="text-2xl font-bold text-purple-500">8.5</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Seguimiento de Entregas" className={cardBg}>
            <Chart type="line" data={submissionData} />
          </Card>
          <Card title="Distribución de Calificaciones" className={cardBg}>
            <Chart type="bar" data={gradeDistribution} />
          </Card>
        </div>

        <Card title="Cursos Activos" className={cardBg}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                  <span className={`${course.color} p-2 rounded-lg text-white`}>
                    {course.icon}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Estudiantes: {course.studentCount}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Entregas:
                    </span>
                    <Tag
                      value={`${course.submissionRate}%`}
                      severity={
                        course.submissionRate >= 90
                          ? 'success'
                          : course.submissionRate >= 70
                          ? 'warning'
                          : 'danger'
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const StudentDashboard = () => {
    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    const CourseCard = ({ course }: { course: Course }) => (
      <div className={`${cardBg} border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 m-2`}>
        <div className="relative">
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-4 left-4 ${course.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
            {course.icon}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className={`text-lg font-semibold ${textColor}`}>{course.name}</h3>
            <p className="text-sm text-gray-500">{course.teacher}</p>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {course.description}
          </p>
          {course.nextAssignment && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 flex items-center">
                <Clock className="inline-block h-4 w-4 mr-2" />
                {course.nextAssignment}
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              label="Ver Detalles"
              icon={<FileText className="h-4 w-4" />}
              className="p-button-outlined"
            />
          </div>
        </div>
      </div>
    );

    const gradeData = {
      labels: ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia'],
      datasets: [
        {
          label: 'Calificaciones',
          data: [85, 92, 78, 88, 95],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${cardBg} flex items-center p-4`}>
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Cursos Activos</h3>
              <p className="text-2xl font-bold text-blue-500">5</p>
            </div>
          </Card>
          <Card className={`${cardBg} flex items-center p-4`}>
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Tareas Completadas</h3>
              <p className="text-2xl font-bold text-green-500">12/15</p>
            </div>
          </Card>
          <Card className={`${cardBg} flex items-center p-4`}>
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Promedio General</h3>
              <p className="text-2xl font-bold text-purple-500">9.2</p>
            </div>
          </Card>
        </div>

        <Card title="Mis Cursos" className={cardBg}>
          <Carousel
            value={courses}
            numVisible={3}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={(course) => <CourseCard course={course} />}
            className="mb-8"
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Calificaciones por Materia" className={cardBg}>
            <Chart type="radar" data={gradeData} />
          </Card>
          <Card title="Próximas Entregas" className={cardBg}>
            <div className="space-y-4">
              {[
                { course: 'Matemáticas', task: 'Proyecto Final', date: '2024-03-20' },
                { course: 'Física', task: 'Informe de Laboratorio', date: '2024-03-22' },
                { course: 'Química', task: 'Examen Parcial', date: '2024-03-25' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{task.course}</h4>
                    <p className="text-sm text-gray-500">{task.task}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 ${bgColor} min-h-screen`}>
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'teacher' && <TeacherDashboard />}
      {user?.role === 'student' && <StudentDashboard />}
    </div>
  );
}
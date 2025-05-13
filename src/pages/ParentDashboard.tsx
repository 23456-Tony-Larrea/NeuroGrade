import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, AlertTriangle, Clock, Award } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  teacher: string;
  grade: number;
  attendance: number;
  absences: number;
  nextAssignment?: string;
}

const mockStudent: Student = {
  id: '1',
  name: 'Carlos Pérez',
  grade: '8vo Básica',
  courses: [
    {
      id: '1',
      name: 'Matemáticas',
      teacher: 'Prof. García',
      grade: 85,
      attendance: 90,
      absences: 3,
      nextAssignment: 'Proyecto Final - 20/03'
    },
    {
      id: '2',
      name: 'Física',
      teacher: 'Prof. Rodríguez',
      grade: 78,
      attendance: 85,
      absences: 4,
      nextAssignment: 'Examen Parcial - 22/03'
    },
    {
      id: '3',
      name: 'Química',
      teacher: 'Prof. López',
      grade: 92,
      attendance: 95,
      absences: 1,
      nextAssignment: 'Informe de Laboratorio - 25/03'
    }
  ]
};

export default function ParentDashboard() {
  const { darkMode } = useTheme();
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';

  const gradeData = {
    labels: mockStudent.courses.map(course => course.name),
    datasets: [
      {
        label: 'Calificaciones',
        data: mockStudent.courses.map(course => course.grade),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }
    ]
  };

  const attendanceData = {
    labels: mockStudent.courses.map(course => course.name),
    datasets: [
      {
        label: 'Asistencia (%)',
        data: mockStudent.courses.map(course => course.attendance),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        fill: false
      }
    ]
  };

  const gradeTemplate = (rowData: Course) => (
    <Tag
      value={`${rowData.grade}%`}
      severity={rowData.grade >= 70 ? 'success' : 'danger'}
    />
  );

  const attendanceTemplate = (rowData: Course) => (
    <Tag
      value={`${rowData.attendance}%`}
      severity={rowData.attendance >= 85 ? 'success' : 'warning'}
    />
  );

  return (
    <div className={`p-4 ${bgColor}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={`${cardBg} flex items-center p-4`}>
          <Award className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Promedio General</h3>
            <p className="text-2xl font-bold text-blue-500">
              {(mockStudent.courses.reduce((acc, course) => acc + course.grade, 0) / mockStudent.courses.length).toFixed(1)}%
            </p>
          </div>
        </Card>

        <Card className={`${cardBg} flex items-center p-4`}>
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Faltas</h3>
            <p className="text-2xl font-bold text-red-500">
              {mockStudent.courses.reduce((acc, course) => acc + course.absences, 0)}
            </p>
          </div>
        </Card>

        <Card className={`${cardBg} flex items-center p-4`}>
          <BookOpen className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Materias</h3>
            <p className="text-2xl font-bold text-green-500">{mockStudent.courses.length}</p>
          </div>
        </Card>

        <Card className={`${cardBg} flex items-center p-4`}>
          <Clock className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Próximas Entregas</h3>
            <p className="text-2xl font-bold text-purple-500">3</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Calificaciones por Materia" className={cardBg}>
          <Chart type="bar" data={gradeData} />
        </Card>

        <Card title="Asistencia por Materia" className={cardBg}>
          <Chart type="line" data={attendanceData} />
        </Card>
      </div>

      <Card title="Detalle por Materias" className={`${cardBg} mt-6`}>
        <DataTable value={mockStudent.courses} stripedRows>
          <Column field="name" header="Materia" sortable />
          <Column field="teacher" header="Profesor" sortable />
          <Column field="grade" header="Calificación" body={gradeTemplate} sortable />
          <Column field="attendance" header="Asistencia" body={attendanceTemplate} sortable />
          <Column field="nextAssignment" header="Próxima Entrega" sortable />
        </DataTable>
      </Card>
    </div>
  );
}
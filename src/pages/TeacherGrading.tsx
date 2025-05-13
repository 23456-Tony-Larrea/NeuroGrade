import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import ExportButtons from '../components/ExportButtons';
import { useRef } from 'react';

interface Student {
  id: string;
  name: string;
  course: string;
  firstPartial: number | null;
  secondPartial: number | null;
  thirdPartial: number | null;
  attendance: number;
  final?: number;
}

const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    course: 'Matemáticas',
    firstPartial: 8,
    secondPartial: 7,
    thirdPartial: null,
    attendance: 85
  },
  {
    id: '2',
    name: 'María García',
    course: 'Matemáticas',
    firstPartial: 9,
    secondPartial: 9,
    thirdPartial: null,
    attendance: 95
  },
  {
    id: '3',
    name: 'Carlos López',
    course: 'Física',
    firstPartial: 7,
    secondPartial: 8,
    thirdPartial: null,
    attendance: 90
  }
];

const courses = [
  { label: 'Todos los Cursos', value: '' },
  { label: 'Matemáticas', value: 'Matemáticas' },
  { label: 'Física', value: 'Física' },
  { label: 'Química', value: 'Química' }
];

export default function TeacherGrading() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

  const handleGradeChange = (studentId: string, field: keyof Student, value: number | null) => {
    if (value !== null && (value < 0 || value > 10)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'La calificación debe estar entre 0 y 10',
        life: 3000
      });
      return;
    }

    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
              ...student,
              [field]: value,
              final: calculateFinal({
                ...student,
                [field]: value
              })
            }
          : student
      )
    );
  };

  const calculateFinal = (student: Student): number | undefined => {
    const partials = [student.firstPartial, student.secondPartial, student.thirdPartial];
    if (partials.some(grade => grade === null)) return undefined;
    
    const average = partials.reduce((sum, grade) => sum + (grade || 0), 0) / 3;
    const attendanceBonus = student.attendance >= 90 ? 0.5 : 0;
    return Math.min(10, average + attendanceBonus);
  };

  const gradeTemplate = (field: keyof Student) => (rowData: Student) => (
    <InputNumber
      value={rowData[field] as number}
      onValueChange={(e) => handleGradeChange(rowData.id, field, e.value)}
      min={0}
      max={10}
      maxFractionDigits={2}
      size={1}
      showButtons
      buttonLayout="horizontal"
      style={{ width: '100px' }}
    />
  );

  const attendanceTemplate = (rowData: Student) => (
    <Tag
      value={`${rowData.attendance}%`}
      severity={rowData.attendance >= 90 ? 'success' : rowData.attendance >= 75 ? 'warning' : 'danger'}
    />
  );

  const finalGradeTemplate = (rowData: Student) => {
    const final = calculateFinal(rowData);
    return final !== undefined ? (
      <span className={`font-bold ${final >= 7 ? 'text-green-600' : 'text-red-600'}`}>
        {final.toFixed(2)}
      </span>
    ) : '-';
  };

  const filteredStudents = selectedCourse
    ? students.filter(student => student.course === selectedCourse)
    : students;

  const tableColumns = [
    { field: 'name', header: 'Estudiante' },
    { field: 'course', header: 'Curso' },
    { field: 'firstPartial', header: 'Primer Parcial' },
    { field: 'secondPartial', header: 'Segundo Parcial' },
    { field: 'thirdPartial', header: 'Tercer Parcial' },
    { field: 'attendance', header: 'Asistencia' },
    { field: 'final', header: 'Nota Final' }
  ];

  const header = (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Dropdown
          value={selectedCourse}
          options={courses}
          onChange={(e) => setSelectedCourse(e.value)}
          placeholder="Seleccionar Curso"
          className="w-48"
        />
      </div>
      <ExportButtons
        data={filteredStudents}
        columns={tableColumns}
        title="Calificaciones_Estudiantes"
      />
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title="Calificaciones de Estudiantes" header={header}>
        <DataTable
          value={filteredStudents}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem' }}
          stripedRows
          globalFilter={globalFilter}
        >
          <Column field="name" header="Estudiante" sortable />
          <Column field="course" header="Curso" sortable />
          <Column
            field="firstPartial"
            header="Primer Parcial"
            body={gradeTemplate('firstPartial')}
            sortable
          />
          <Column
            field="secondPartial"
            header="Segundo Parcial"
            body={gradeTemplate('secondPartial')}
            sortable
          />
          <Column
            field="thirdPartial"
            header="Tercer Parcial"
            body={gradeTemplate('thirdPartial')}
            sortable
          />
          <Column
            field="attendance"
            header="Asistencia"
            body={attendanceTemplate}
            sortable
          />
          <Column
            field="final"
            header="Nota Final"
            body={finalGradeTemplate}
            sortable
          />
        </DataTable>
      </Card>
    </div>
  );
}
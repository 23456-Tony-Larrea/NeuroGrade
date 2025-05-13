import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import ExportButtons from '../components/ExportButtons';
import { useTheme } from '../context/ThemeContext';

interface Student {
  id: string;
  name: string;
  course: string;
  attendance: {
    [date: string]: AttendanceStatus;
  };
}

type AttendanceStatus = 'present' | 'absent' | 'unexcused';

const attendanceOptions = [
  { label: 'Asistió', value: 'present' },
  { label: 'No Asistió (Justificado)', value: 'absent' },
  { label: 'No Asistió (No Justificado)', value: 'unexcused' }
];

const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    course: 'Matemáticas',
    attendance: {}
  },
  {
    id: '2',
    name: 'María García',
    course: 'Matemáticas',
    attendance: {}
  },
  {
    id: '3',
    name: 'Carlos López',
    course: 'Física',
    attendance: {}
  }
];

const courses = [
  { label: 'Todos los Cursos', value: '' },
  { label: 'Matemáticas', value: 'Matemáticas' },
  { label: 'Física', value: 'Física' },
  { label: 'Química', value: 'Química' }
];

export default function TeacherAttendance() {
  const { darkMode } = useTheme();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [globalFilter, setGlobalFilter] = useState('');

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...student.attendance,
                [dateKey]: status
              }
            }
          : student
      )
    );
  };

  const getAttendanceStatus = (student: Student) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    return student.attendance[dateKey] || null;
  };

  const attendanceBodyTemplate = (rowData: Student) => {
    const status = getAttendanceStatus(rowData);
    return (
      <Dropdown
        value={status}
        options={attendanceOptions}
        onChange={(e) => handleAttendanceChange(rowData.id, e.value)}
        className="w-full"
        placeholder="Seleccionar estado"
      />
    );
  };

  const statusBodyTemplate = (rowData: Student) => {
    const status = getAttendanceStatus(rowData);
    if (!status) return null;

    const statusConfig = {
      present: { severity: 'success', label: 'Asistió' },
      absent: { severity: 'warning', label: 'No Asistió (J)' },
      unexcused: { severity: 'danger', label: 'No Asistió (NJ)' }
    };

    const config = statusConfig[status];
    return <Tag severity={config.severity} value={config.label} />;
  };

  const filteredStudents = selectedCourse
    ? students.filter(student => student.course === selectedCourse)
    : students;

  const calculateAttendanceRate = (student: Student) => {
    const dates = Object.values(student.attendance);
    if (dates.length === 0) return 0;

    const presentCount = dates.filter(status => status === 'present').length;
    return (presentCount / dates.length) * 100;
  };

  const attendanceRateBodyTemplate = (rowData: Student) => {
    const rate = calculateAttendanceRate(rowData);
    return (
      <Tag
        severity={rate >= 75 ? 'success' : rate >= 50 ? 'warning' : 'danger'}
        value={`${rate.toFixed(1)}%`}
      />
    );
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Dropdown
          value={selectedCourse}
          options={courses}
          onChange={(e) => setSelectedCourse(e.value)}
          placeholder="Seleccionar Curso"
          className="w-48"
        />
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value as Date)}
          showIcon
          dateFormat="dd/mm/yy"
          className="w-48"
        />
      </div>
      <ExportButtons
        data={filteredStudents}
        columns={[
          { field: 'name', header: 'Estudiante' },
          { field: 'course', header: 'Curso' }
        ]}
        title="Registro_Asistencia"
      />
    </div>
  );

  return (
    <div className="p-4">
      <Card title="Control de Asistencia" header={header}>
        <DataTable
          value={filteredStudents}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
          emptyMessage="No se encontraron estudiantes"
          className={darkMode ? 'dark-theme' : ''}
          stripedRows
        >
          <Column field="name" header="Estudiante" sortable />
          <Column field="course" header="Curso" sortable />
          <Column
            field="attendance"
            header="Asistencia"
            body={attendanceBodyTemplate}
            style={{ width: '250px' }}
          />
          <Column
            field="status"
            header="Estado"
            body={statusBodyTemplate}
            style={{ width: '150px' }}
          />
          <Column
            field="attendanceRate"
            header="Tasa de Asistencia"
            body={attendanceRateBodyTemplate}
            style={{ width: '150px' }}
            sortable
          />
        </DataTable>
      </Card>
    </div>
  );
}
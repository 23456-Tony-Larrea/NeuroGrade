import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import ExportButtons from '../components/ExportButtons';

interface Grade {
  id: string;
  course: string;
  firstTerm: number;
  secondTerm: number;
  thirdTerm: number;
  final: number;
}

const grades: Grade[] = [
  {
    id: '1',
    course: 'Matemáticas',
    firstTerm: 85,
    secondTerm: 90,
    thirdTerm: 88,
    final: 88
  },
  {
    id: '2',
    course: 'Física',
    firstTerm: 92,
    secondTerm: 88,
    thirdTerm: 95,
    final: 92
  },
  {
    id: '3',
    course: 'Química',
    firstTerm: 87,
    secondTerm: 85,
    thirdTerm: 90,
    final: 87
  }
];

export default function Grades() {
  const chartData = {
    labels: grades.map(g => g.course),
    datasets: [
      {
        label: 'Primer Parcial',
        data: grades.map(g => g.firstTerm),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Segundo Parcial',
        data: grades.map(g => g.secondTerm),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Tercer Parcial',
        data: grades.map(g => g.thirdTerm),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const tableColumns = [
    { field: 'course', header: 'Curso' },
    { field: 'firstTerm', header: 'Primer Parcial' },
    { field: 'secondTerm', header: 'Segundo Parcial' },
    { field: 'thirdTerm', header: 'Tercer Parcial' },
    { field: 'final', header: 'Nota Final' }
  ];

  return (
    <div className="p-4 space-y-6">
      <Card title="Resumen de Calificaciones">
        <div className="mb-6">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
        <div className="mb-4 flex justify-end">
          <ExportButtons
            data={grades}
            columns={tableColumns}
            title="Calificaciones"
          />
        </div>
        <DataTable
          value={grades}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem' }}
          stripedRows
        >
          <Column field="course" header="Curso" sortable />
          <Column field="firstTerm" header="Primer Parcial" sortable />
          <Column field="secondTerm" header="Segundo Parcial" sortable />
          <Column field="thirdTerm" header="Tercer Parcial" sortable />
          <Column field="final" header="Nota Final" sortable />
        </DataTable>
      </Card>
    </div>
  );
}
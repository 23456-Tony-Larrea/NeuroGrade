import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { useAuthStore } from '../stores/authStore';
import ExportButtons from '../components/ExportButtons';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Primer Aporte - Matemáticas',
    course: 'Matemáticas',
    dueDate: '2024-03-20',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Segundo Aporte - Física',
    course: 'Física',
    dueDate: '2024-03-25',
    status: 'submitted'
  },
  {
    id: '3',
    title: 'Examen Final - Química',
    course: 'Química',
    dueDate: '2024-04-01',
    status: 'graded',
    grade: 95,
    feedback: 'Excelente trabajo en la resolución de problemas.'
  }
];

export default function Assignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [comment, setComment] = useState('');
  const { user } = useAuthStore();

  const statusBodyTemplate = (rowData: Assignment) => {
    const severity = rowData.status === 'pending' 
      ? 'warning' 
      : rowData.status === 'submitted' 
        ? 'info' 
        : 'success';
    
    return <Tag severity={severity} value={rowData.status.toUpperCase()} />;
  };

  const actionBodyTemplate = (rowData: Assignment) => {
    if (user?.role === 'student') {
      return (
        <div className="flex gap-2">
          <Button
            icon="pi pi-upload"
            rounded
            text
            severity="info"
            onClick={() => {
              setSelectedAssignment(rowData);
              setShowSubmitDialog(true);
            }}
            disabled={rowData.status === 'graded'}
          />
          {rowData.status === 'graded' && (
            <Button
              icon="pi pi-eye"
              rounded
              text
              severity="success"
              onClick={() => {
                setSelectedAssignment(rowData);
                setShowFeedbackDialog(true);
              }}
            />
          )}
        </div>
      );
    }
    return null;
  };

  const tableColumns = [
    { field: 'title', header: 'Título' },
    { field: 'course', header: 'Curso' },
    { field: 'dueDate', header: 'Fecha Límite' },
    { field: 'status', header: 'Estado' }
  ];

  return (
    <div className="p-4">
      <Card title="Tareas y Evaluaciones">
        <div className="mb-4 flex justify-end">
          <ExportButtons
            data={assignments}
            columns={tableColumns}
            title="Tareas y Evaluaciones"
          />
        </div>
        <DataTable
          value={assignments}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          stripedRows
        >
          <Column field="title" header="Título" sortable />
          <Column field="course" header="Curso" sortable />
          <Column field="dueDate" header="Fecha Límite" sortable />
          <Column field="status" header="Estado" body={statusBodyTemplate} sortable />
          {user?.role === 'student' && (
            <Column body={actionBodyTemplate} exportable={false} style={{ width: '8rem' }} />
          )}
        </DataTable>
      </Card>

      {/* Submit Assignment Dialog */}
      <Dialog
        visible={showSubmitDialog}
        onHide={() => setShowSubmitDialog(false)}
        header="Entregar Tarea"
        style={{ width: '50vw' }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{selectedAssignment?.title}</h3>
          <FileUpload
            name="assignment"
            url="/api/upload"
            multiple
            accept="application/pdf,.doc,.docx,image/*"
            maxFileSize={10000000}
            emptyTemplate={
              <p className="text-center">
                Arrastra y suelta archivos aquí o haz clic para seleccionar
              </p>
            }
          />
          <div>
            <label className="block text-sm font-medium mb-2">Comentarios</label>
            <InputTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowSubmitDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Entregar"
              icon="pi pi-check"
              onClick={() => {
                // Handle submission
                setShowSubmitDialog(false);
                setComment('');
              }}
            />
          </div>
        </div>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        visible={showFeedbackDialog}
        onHide={() => setShowFeedbackDialog(false)}
        header="Retroalimentación"
        style={{ width: '30vw' }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedAssignment?.title}</h3>
            <p className="text-sm text-gray-500">{selectedAssignment?.course}</p>
          </div>
          <div>
            <p className="font-medium">Calificación:</p>
            <p className="text-2xl font-bold text-green-600">{selectedAssignment?.grade}/100</p>
          </div>
          <div>
            <p className="font-medium">Comentarios del Profesor:</p>
            <p className="text-gray-700">{selectedAssignment?.feedback}</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
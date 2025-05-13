import React, { useState } from 'react';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useTheme } from '../../context/ThemeContext';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    field: keyof T;
    header: string;
    sortable?: boolean;
    body?: (rowData: T) => React.ReactNode;
  }[];
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onCreate?: () => void;
  title: string;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  title
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { darkMode } = useTheme();

  const handleDelete = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const actionBody = (rowData: T) => (
    <div className="flex gap-2">
      {onEdit && (
        <Button
          icon={<Pencil className="h-4 w-4" />}
          className="p-button-text p-button-rounded"
          onClick={() => onEdit(rowData)}
          tooltip="Editar"
        />
      )}
      {onDelete && (
        <Button
          icon={<Trash2 className="h-4 w-4" />}
          className="p-button-text p-button-rounded p-button-danger"
          onClick={() => {
            setSelectedItem(rowData);
            setShowDeleteDialog(true);
          }}
          tooltip="Eliminar"
        />
      )}
    </div>
  );

  const header = (
    <div className="flex justify-between items-center">
      <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <div className="flex gap-4">
        <span className="p-input-icon-left">
          <Search className="h-4 w-4" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
            className="p-inputtext-sm"
          />
        </span>
        {onCreate && (
          <Button
            icon={<Plus className="h-4 w-4" />}
            label="Nuevo"
            onClick={onCreate}
            className="p-button-sm"
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <PrimeDataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        globalFilter={globalFilter}
        header={header}
        emptyMessage="No se encontraron registros"
        className={darkMode ? 'dark-theme' : ''}
        stripedRows
        responsiveLayout="scroll"
      >
        {columns.map((col) => (
          <Column
            key={col.field.toString()}
            field={col.field.toString()}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
          />
        ))}
        {(onEdit || onDelete) && (
          <Column body={actionBody} header="Acciones" style={{ width: '100px' }} />
        )}
      </PrimeDataTable>

      <Dialog
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        header="Confirmar eliminación"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowDeleteDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              onClick={handleDelete}
              className="p-button-danger"
            />
          </div>
        }
      >
        <p>¿Está seguro que desea eliminar este registro?</p>
      </Dialog>
    </>
  );
}
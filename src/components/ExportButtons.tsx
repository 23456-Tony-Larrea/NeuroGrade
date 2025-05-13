import React from 'react';
import { Button } from 'primereact/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

interface ExportButtonsProps {
  data: any[];
  columns: any[];
  title: string;
}

export default function ExportButtons({ data, columns, title }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        icon={<FileText className="h-4 w-4" />}
        label="PDF"
        severity="danger"
        onClick={() => exportToPDF(data, columns, title)}
      />
      <Button
        icon={<FileSpreadsheet className="h-4 w-4" />}
        label="Excel"
        severity="success"
        onClick={() => exportToExcel(data, columns, title)}
      />
    </div>
  );
}
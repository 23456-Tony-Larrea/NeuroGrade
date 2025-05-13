import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any[], columns: any[], title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Prepare data for table
  const tableData = data.map(item => 
    columns.map(col => {
      if (typeof item[col.field] === 'object') {
        return '';
      }
      return item[col.field]?.toString() || '';
    })
  );
  
  // Add table
  (doc as any).autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 25,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [51, 122, 183],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Save PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};

export const exportToExcel = (data: any[], columns: any[], title: string) => {
  // Prepare data for Excel
  const excelData = data.map(item => {
    const row: any = {};
    columns.forEach(col => {
      if (typeof item[col.field] === 'object') {
        row[col.header] = '';
      } else {
        row[col.header] = item[col.field];
      }
    });
    return row;
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Save Excel file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
};

export const exportQuestionnaireToExcel = (questionnaire: any) => {
  const workbook = XLSX.utils.book_new();

  // Overview worksheet
  const overviewData = [
    ['Título', questionnaire.title],
    ['Descripción', questionnaire.description],
    ['Total Participantes', questionnaire.totalParticipants],
    ['Promedio General', `${questionnaire.averageScore}%`],
    ['Tasa de Finalización', `${questionnaire.completionRate}%`],
    [],
    ['Resumen de Preguntas'],
    ['Pregunta', 'Total Respuestas', 'Respuestas Correctas', '% Acierto']
  ];

  questionnaire.questions.forEach((question: any) => {
    overviewData.push([
      question.text,
      question.totalResponses,
      question.correctResponses,
      `${((question.correctResponses / question.totalResponses) * 100).toFixed(1)}%`
    ]);
  });

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, wsOverview, 'Resumen');

  // Detailed questions worksheet
  const questionsData = [
    ['Pregunta', 'Tipo', 'Puntos', 'Opción', 'Correcta', 'Total Respuestas', '% Selección']
  ];

  questionnaire.questions.forEach((question: any) => {
    let firstRow = true;
    question.options.forEach((option: any) => {
      questionsData.push([
        firstRow ? question.text : '',
        firstRow ? question.type : '',
        firstRow ? question.points : '',
        option.text,
        option.isCorrect ? 'Sí' : 'No',
        option.responses,
        `${((option.responses / question.totalResponses) * 100).toFixed(1)}%`
      ]);
      firstRow = false;
    });
    // Add empty row between questions
    questionsData.push([]);
  });

  const wsQuestions = XLSX.utils.aoa_to_sheet(questionsData);
  XLSX.utils.book_append_sheet(workbook, wsQuestions, 'Preguntas Detalladas');

  // Response distribution worksheet
  const distributionData = [
    ['Rango de Calificación', 'Cantidad de Estudiantes', '% del Total']
  ];

  const ranges = ['90-100', '80-89', '70-79', '60-69', '<60'];
  ranges.forEach(range => {
    const count = Math.floor(Math.random() * questionnaire.totalParticipants); // Mock data
    distributionData.push([
      range,
      count,
      `${((count / questionnaire.totalParticipants) * 100).toFixed(1)}%`
    ]);
  });

  const wsDistribution = XLSX.utils.aoa_to_sheet(distributionData);
  XLSX.utils.book_append_sheet(workbook, wsDistribution, 'Distribución');

  // Save the workbook
  XLSX.writeFile(workbook, `cuestionario_${questionnaire.title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
};
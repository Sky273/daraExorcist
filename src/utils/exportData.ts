import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Column } from '../store/useDataStore';
import { anonymizationMethods } from './anonymization';
import { useDataStore } from '../store/useDataStore';

const anonymizeValue = (value: any, column: Column): any => {
  if (!column.shouldAnonymize) return value;

  // If it's a specific tool
  if (column.toolId) {
    const { savedTools } = useDataStore.getState();
    const tool = savedTools.find(t => t.id === column.toolId);
    if (tool) {
      if (column.anonymizationMethod === 'mask') {
        return '*'.repeat(String(value).length);
      } else if (tool.regexp) {
        try {
          const regex = new RegExp(tool.regexp);
          return String(value).replace(regex, match => '*'.repeat(match.length));
        } catch {
          return '*'.repeat(String(value).length);
        }
      }
    }
  }

  // Otherwise use built-in methods
  const method = column.anonymizationMethod || 'mask';
  const methodDef = anonymizationMethods[column.type]?.find(m => m.name === method);
  return methodDef ? methodDef.apply(value) : '****';
};

const processDataForExport = (data: any[], columns: Column[]): any[] => {
  return data.map(row => {
    const processedRow: any = {};
    columns.forEach(column => {
      processedRow[column.name] = anonymizeValue(row[column.name], column);
    });
    return processedRow;
  });
};

export const exportToCSV = (data: any[], columns: Column[]): void => {
  const processedData = processDataForExport(data, columns);
  const csv = Papa.unparse(processedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'anonymized-data.csv');
};

export const exportToExcel = (data: any[], columns: Column[]): void => {
  const processedData = processDataForExport(data, columns);
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Anonymized Data');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'anonymized-data.xlsx');
};

export const exportToSQL = (data: any[], columns: Column[], tableName: string = 'anonymized_data'): void => {
  const processedData = processDataForExport(data, columns);
  
  // Create table definition
  let sql = `CREATE TABLE ${tableName} (\n`;
  sql += columns.map(column => {
    // Determine SQL data type based on column type
    let sqlType = 'VARCHAR(255)'; // default
    switch (column.type) {
      case 'number':
        sqlType = 'NUMERIC';
        break;
      case 'date':
        sqlType = 'DATE';
        break;
      case 'text':
      case 'email':
      case 'phone':
      case 'website':
      case 'city':
      case 'country':
      case 'company':
      case 'firstName':
      case 'lastName':
      case 'fullName':
        sqlType = 'VARCHAR(255)';
        break;
      case 'ssn':
        sqlType = 'VARCHAR(20)';
        break;
      case 'zipcode':
        sqlType = 'VARCHAR(10)';
        break;
    }
    return `  ${column.name} ${sqlType}`;
  }).join(',\n');
  sql += '\n);\n\n';

  // Generate insert statements
  sql += processedData.map(row => {
    const values = columns.map(column => {
      const value = row[column.name];
      if (value === null || value === undefined) {
        return 'NULL';
      }
      // Escape single quotes and wrap strings in quotes
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      if (column.type === 'date' && value instanceof Date) {
        return `'${value.toISOString().split('T')[0]}'`;
      }
      return value;
    });
    return `INSERT INTO ${tableName} (${columns.map(c => c.name).join(', ')})\nVALUES (${values.join(', ')});`;
  }).join('\n');

  // Save the SQL file
  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'anonymized-data.sql');
};

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Column } from '../store/useDataStore';

// Zip code validation patterns
const ZIP_PATTERNS = {
  US: /^\d{5}(?:-\d{4})?$/,
  UK: /^[A-Z]{1,2}\d[\dA-Z]?\s*\d[A-Z]{2}$/i,
  FR: /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/,
  DE: /^\d{5}$/,
  IT: /^\d{5}$/,
  ES: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/,
  NL: /^\d{4}\s*[A-Z]{2}$/i,
  BE: /^\d{4}$/,
  CH: /^\d{4}$/,
  AT: /^\d{4}$/,
  SE: /^\d{3}\s*\d{2}$/,
  NO: /^\d{4}$/,
  DK: /^\d{4}$/,
  FI: /^\d{5}$/,
  PT: /^\d{4}-\d{3}$/
};

const isZipCode = (value: string): boolean => {
  const cleanValue = value.trim();
  return Object.values(ZIP_PATTERNS).some(pattern => {
    try {
      return pattern.test(cleanValue);
    } catch {
      return false;
    }
  });
};

const isValidDate = (value: string): boolean => {
  const dateFormats = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/,
    /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/,
    /^(0?[1-9]|[12]\d|3[01])[-.](0?[1-9]|1[0-2])[-.]\d{4}$/
  ];

  const isValidFormat = dateFormats.some(format => format.test(value));
  if (!isValidFormat) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
};

const SSN_PATTERNS = {
  US: /^(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}$/,
  FR: /^[12][0-9]{2}[0-1][0-9](2[AB]|[0-9]{2})\d{3}\d{3}\d{2}$/,
  UK: /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]$/i,
  DE: /^\d{2}\s?\d{6}\s?\d{1}\s?\d{3}$/,
  IT: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i,
  ES: /^\d{2}\/\d{8}\/\d{2}$/,
  SE: /^(\d{6}|\d{8})-?\d{4}$/,
  NL: /^\d{9}$/
};

const isSSN = (value: string): boolean => {
  const cleanValue = value.replace(/[\s.-]/g, '');
  return Object.values(SSN_PATTERNS).some(pattern => {
    try {
      return pattern.test(cleanValue);
    } catch {
      return false;
    }
  });
};

export const processFile = async (file: File): Promise<{ data: any[], columns: Column[] }> => {
  try {
    if (file.name.toLowerCase().endsWith('.csv')) {
      return processCsv(file);
    } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
      return processExcel(file);
    }
    throw new Error('Unsupported file format');
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process file');
  }
};

const processCsv = (file: File): Promise<{ data: any[], columns: Column[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing CSV file: ' + results.errors[0].message));
          return;
        }
        
        if (!results.data || results.data.length === 0) {
          reject(new Error('No data found in CSV file'));
          return;
        }

        try {
          const firstRow = results.data[0] as Record<string, unknown>;
          const columns = Object.keys(firstRow).map(name => ({
            name,
            type: inferColumnType(results.data as Record<string, unknown>[], name),
            shouldAnonymize: false
          }));
          resolve({ data: results.data, columns });
        } catch (error) {
          reject(new Error('Error processing CSV data: ' + (error instanceof Error ? error.message : 'Unknown error')));
        }
      },
      error: (error) => reject(new Error('Error parsing CSV file: ' + error.message))
    });
  });
};

const processExcel = async (file: File): Promise<{ data: any[], columns: Column[] }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    if (!workbook.SheetNames.length) {
      throw new Error('No sheets found in Excel file');
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    
    if (!data || data.length === 0) {
      throw new Error('No data found in Excel file');
    }

    const firstRow = data[0] as Record<string, unknown>;
    const columns = Object.keys(firstRow).map(name => ({
      name,
      type: inferColumnType(data as Record<string, unknown>[], name),
      shouldAnonymize: false
    }));

    return { data, columns };
  } catch (error) {
    throw new Error('Error processing Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

const inferColumnType = (data: Record<string, unknown>[], columnName: string): string => {
  try {
    const sample = data.slice(0, 100).map(row => row[columnName]);
    const columnNameLower = columnName.toLowerCase();
    
    if (!sample || sample.length === 0) {
      return 'text';
    }

    if (columnNameLower.includes('date') ||
        columnNameLower.includes('time') ||
        columnNameLower.includes('temps') ||
        columnNameLower.includes('jour') ||
        columnNameLower.includes('subscription') ||
        columnNameLower.includes('abonnement') ||
        columnNameLower.includes('joined') ||
        columnNameLower.includes('created') ||
        columnNameLower.includes('modified') ||
        columnNameLower.includes('updated')) {
      if (sample.some(value => 
        typeof value === 'string' && 
        value.trim() !== '' && 
        isValidDate(value)
      )) {
        return 'date';
      }
    }

    if (sample.some(value => 
      typeof value === 'string' && 
      value.trim() !== '' && 
      (
        /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(value.trim()) ||
        isValidDate(value)
      )
    )) {
      return 'date';
    }

    if (columnNameLower.includes('ssn') ||
        columnNameLower.includes('social') ||
        columnNameLower.includes('security') ||
        columnNameLower.includes('sécu') ||
        columnNameLower.includes('secu') ||
        columnNameLower.includes('sécurité sociale') ||
        columnNameLower.includes('securite sociale') ||
        columnNameLower.includes('nino') ||
        columnNameLower.includes('insurance') ||
        columnNameLower.includes('bsn') ||
        columnNameLower.includes('personnummer') ||
        columnNameLower.includes('fiscal') ||
        columnNameLower.includes('codice') ||
        sample.some(value => 
          typeof value === 'string' && 
          value.trim() !== '' &&
          isSSN(value.trim())
        )
    ) {
      return 'ssn';
    }

    if (columnNameLower.includes('zip') ||
        columnNameLower.includes('postal') ||
        columnNameLower.includes('post code') ||
        columnNameLower.includes('postcode') ||
        columnNameLower.includes('code postal') ||
        columnNameLower.includes('plz') ||
        columnNameLower.includes('cap') ||
        columnNameLower.includes('código postal') ||
        columnNameLower.includes('postnummer') ||
        columnNameLower.includes('postinumero') ||
        sample.some(value => 
          typeof value === 'string' && 
          value.trim() !== '' &&
          isZipCode(value.trim())
        )
    ) {
      return 'zipcode';
    }

    if (columnNameLower.includes('website') ||
        columnNameLower.includes('url') ||
        columnNameLower.includes('site') ||
        sample.some(value => 
          typeof value === 'string' && 
          (value.startsWith('http://') || value.startsWith('https://') || value.includes('www.'))
        )
    ) {
      return 'website';
    }

    if (columnNameLower.includes('city') ||
        columnNameLower.includes('town') ||
        columnNameLower.includes('ville') ||
        columnNameLower.includes('municipality')
    ) {
      return 'city';
    }

    if (columnNameLower.includes('country') ||
        columnNameLower.includes('pays') ||
        columnNameLower.includes('nation')
    ) {
      return 'country';
    }
    
    if (columnNameLower.includes('company') ||
        columnNameLower.includes('organization') ||
        columnNameLower.includes('organisation') ||
        columnNameLower.includes('business') ||
        columnNameLower.includes('employer') ||
        columnNameLower.includes('société') ||
        columnNameLower.includes('entreprise')
    ) {
      return 'company';
    }
    
    if ((columnNameLower.includes('first') && columnNameLower.includes('name')) ||
        columnNameLower === 'firstname' ||
        columnNameLower === 'fname' ||
        columnNameLower === 'prénom' ||
        columnNameLower.includes('prenom')
    ) {
      return 'firstName';
    }
    
    if ((columnNameLower.includes('last') && columnNameLower.includes('name')) ||
        columnNameLower === 'lastname' ||
        columnNameLower === 'lname' ||
        columnNameLower === 'surname' ||
        columnNameLower === 'nom' ||
        columnNameLower.includes('famille')
    ) {
      return 'lastName';
    }
    
    if (columnNameLower.includes('email') ||
        columnNameLower.includes('e-mail') ||
        columnNameLower.includes('courriel') ||
        sample.some(value => typeof value === 'string' && value.includes('@'))
    ) {
      return 'email';
    }
    
    if (columnNameLower.includes('phone') ||
        columnNameLower.includes('tel') ||
        columnNameLower.includes('mobile') ||
        columnNameLower.includes('téléphone') ||
        columnNameLower.includes('telephone') ||
        sample.some(value => 
          typeof value === 'string' && 
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value.trim())
        )
    ) {
      return 'phone';
    }
    
    if (sample.every(value => 
      typeof value === 'number' || 
      (typeof value === 'string' && !isNaN(Number(value.replace(',', '.'))))
    )) {
      return 'number';
    }
    
    return 'text';
  } catch (error) {
    console.error('Error inferring column type:', error);
    return 'text';
  }
};

export type { Column };

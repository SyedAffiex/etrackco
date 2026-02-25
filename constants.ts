
import { ActivityType, Student, Activity } from './types';

export const LOGOS = {
  SCHOOL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgMjBMNTAgMTBMOTAgMjBWOEM5MCA2MCA3MCA5MCA1MCA5NUMzMCA5MCAxMCA2MCAxMCAyMFoiIGZpbGw9IiMwMDQ3QUIiLz48cGF0aCBkPSJNMjAgMzBMNTAgMjBMODAgMzBWNjBDODAgODAgNjUgOTAgNTAgOTRDMzUgOTAgMjAgODAgMjAgNjBWMzBaIiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTMwIDUwSDcwVjcwSDMwVjUwWiIgZmlsbD0iIzAwNDdBQiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDUiIHI9IjgiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=',
  ZASS2: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMwIiBmaWxsPSIjMjU2M0VCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WkFTUzI8L3RleHQ+PHBhdGggZD0iTTI1IDY1IEg3NSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4='
};

// Senarai murid dikosongkan untuk pendaftaran baharu melalui CSV
export const INITIAL_STUDENTS: Student[] = [];

export const DEFAULT_ACTIVITIES: Activity[] = [
  { 
    id: 'u01', name: 'Pergerakan Puteri Islam (PPIM)', type: ActivityType.UNIFORM, 
    advisorHead: 'Nor Aziah bt Zakaria (K)', location: 'MAKMAL SAINS SPM B',
    advisors: ['Nor Aziah bt Zakaria (K)', 'Zalina bt Bidin', 'Nor Amalina bt Nawi', 'Zaharah bt Hamzah', 'Norazila bt Mohamed']
  },
  { id: 's01', name: 'Bola Sepak', type: ActivityType.SPORT, advisorHead: 'Wan Muhammad Zulhilmi (K)', location: '3B', advisors: ['Wan Muhammad Zulhilmi (K)', 'Mohd Kaziran bin Kadir', 'Mohd Hazim bin Mohd Ghazali'] },
  { id: 'c01', name: 'Persatuan Bahasa Melayu', type: ActivityType.CLUB, advisorHead: "Nor 'Elina bt Che Kerema (K)", location: 'MAKMAL SAINS D', advisors: ["Nor 'Elina bt Che Kerema (K)", "Roseniza bt Deraman"] },
];

export const STORAGE_KEYS = {
  RECORDS: 'smkz2_records',
  ACTIVITIES: 'smkz2_activities',
  STUDENTS: 'smkz2_students',
  SHEET_URL: 'smkz2_sheet_url',
  LAST_SYNC: 'smkz2_last_sync'
};

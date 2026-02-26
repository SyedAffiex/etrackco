
import { ActivityCategory, Student, Activity } from './types';

export const LOGOS = {
  SCHOOL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgMjBMNTAgMTBMOTAgMjBWOEM5MCA2MCA3MCA5MCA1MCA5NUMzMCA5MCAxMCA2MCAxMCAyMFoiIGZpbGw9IiMwMDQ3QUIiLz48cGF0aCBkPSJNMjAgMzBMNTAgMjBMODAgMzBWNjBDODAgODAgNjUgOTAgNTAgOTRDMzUgOTAgMjAgODAgMjAgNjBWMzBaIiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTMwIDUwSDcwVjcwSDMwVjUwWiIgZmlsbD0iIzAwNDdBQiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDUiIHI9IjgiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=',
  ZASS2: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMwIiBmaWxsPSIjMjU2M0VCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+WkFTUzI8L3RleHQ+PHBhdGggZD0iTTI1IDY1IEg3NSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4='
};

export const DEFAULT_CATEGORIES: ActivityCategory[] = [
  { id: 'cat_uniform', name: 'Badan Beruniform', icon: 'fa-shield-alt', color: 'indigo', coordinator: 'ZALHUSYAINI BT HAMZAH' },
  { id: 'cat_club', name: 'Kelab & Persatuan', icon: 'fa-users', color: 'blue', coordinator: 'MUNIRAH BT MUSTAPHA' },
  { id: 'cat_sport', name: 'Sukan & Permainan', icon: 'fa-volleyball-ball', color: 'green', coordinator: 'MOHD KAZIRAN BIN KADIR' },
  { id: 'cat_house', name: 'Rumah Sukan', icon: 'fa-home', color: 'orange' }
];

// Senarai murid awal dengan tugasan
export const INITIAL_STUDENTS: Student[] = [
  { id: 'm001', name: 'AINA BATRISYIA BT MOHD AZLAN', class: '5 AL-BIRUNI', assignments: { 'cat_uniform': 'u08' } },
  { id: 'm002', name: 'NUR AFEEFAH BT ABDULLAH', class: '5 AL-BIRUNI', assignments: { 'cat_uniform': 'u08' } },
  { id: 'm003', name: 'NUR AMALINA BT MOHD NAWI', class: '5 AL-BIRUNI', assignments: { 'cat_uniform': 'u08' } },
  { id: 'm004', name: 'SITI NURHALIZA BT TARUDIN', class: '4 AL-FARABI', assignments: { 'cat_uniform': 'u08' } },
  { id: 'm005', name: 'WAN NURUL IMAN BT WAN AZMI', class: '4 AL-FARABI', assignments: { 'cat_uniform': 'u08' } },
  { id: 'm006', name: 'NURUL IZZAH BT ANWAR', class: '3 CEKAP', assignments: { 'cat_uniform': 'u08' } },
];

export const DEFAULT_ACTIVITIES: Activity[] = [
  // Badan Beruniform
  { 
    id: 'u01', 
    name: 'Pengakap', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Nik Hasifah bt Nik Mustapha',
    advisors: ['Nik Hasifah bt Nik Mustapha', 'Nik Fatni bt Nik Abdullah', 'Khairany bt Ab Azib', 'Hashidah bt Abdullah', 'Rosminah bt Yusof'],
    location: 'MAKMAL SAINS C'
  },
  { 
    id: 'u02', 
    name: 'Kadet Bomba', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Mohd Kaziran Bin Kadir',
    advisors: ['Mohd Kaziran Bin Kadir', 'Khaleza Adilah bt Abd Ghani', 'Noor Aini bt Hussin', 'Jazilah bt Wan Mohd Kasim', 'Wan Muhammad Zul Hilmi bin Wan Zakaria'],
    location: 'FOYER IBN KHALDUN'
  },
  { 
    id: 'u03', 
    name: 'Kadet Polis', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Suriani bt Mat Yatim',
    advisors: ['Suriani bt Mat Yatim', 'Rahani bt Jusoh', 'Rozemah bt Sabtu', 'Norlayla bt Ibrahim', 'Roseniza bt Deraman', 'Wan Shafien b Wan Mohamed'],
    location: 'KANTIN'
  },
  { 
    id: 'u04', 
    name: 'KRS', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Nor Ashikin bt Mohd Razali',
    advisors: ['Nor Ashikin bt Mohd Razali', 'Zakina bt Harun', 'Wan Zarinah bt Wan Zin', 'Zaiton bt Zakaria', 'Ruslia bt Talib'],
    location: 'MAKMAL SAINS B'
  },
  { 
    id: 'u05', 
    name: 'KASPA', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Ruzilawati bt Mohamed',
    advisors: ['Ruzilawati bt Mohamed', 'Noraini bt Mat Ghani', 'Nor \'Elina bt Che Kerema', 'Mohd Hazim bin Mohd Ghazali'],
    location: 'MAKMAL SAINS D'
  },
  { 
    id: 'u06', 
    name: 'Bulan Sabit Merah', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Suhaida bt Abu Bakar',
    advisors: ['Suhaida bt Abu Bakar', 'Siti Hanum bt Zahudi', 'Munirah bt Mustapha', 'Ridhauddin bin Mohamed', 'Nursyuhada bt Shukri'],
    location: 'MAKMAL SAINS A'
  },
  { 
    id: 'u07', 
    name: 'Pandu Puteri', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Salwanie bt Mazlan',
    advisors: ['Salwanie bt Mazlan', 'Wan Nurulfarhah bt Awang@Hasan', 'Yarni bt Mohd Daud', 'Nor Sharmy Suharmila bt Hassan', 'Siti Saraf bt Roni'],
    location: 'MAKMAL SAINS SPM A'
  },
  { 
    id: 'u08', 
    name: 'Puteri Islam', 
    categoryId: 'cat_uniform', 
    advisorHead: 'Nor Aziah bt Zakaria',
    advisors: ['Nor Aziah bt Zakaria', 'Zalina bt Bidin', 'Nor Amalina bt Nawi', 'Zaharah bt Hamzah', 'Norazila bt Mohamed'],
    location: 'MAKMAL SAINS SPM B'
  },

  // Kelab & Persatuan
  { 
    id: 'c01', 
    name: 'Kelab Alam Sekitar', 
    categoryId: 'cat_club', 
    advisorHead: 'Zalina bt Bidin',
    advisors: ['Zalina bt Bidin', 'Norlayla bt Ibrahim'],
    location: 'FOYER'
  },
  { 
    id: 'c02', 
    name: 'Kelab Doktor Muda', 
    categoryId: 'cat_club', 
    advisorHead: 'Noor Aini bt Hussin',
    advisors: ['Noor Aini bt Hussin', 'Ridhaudin bin Mohamed', 'Khairany bt Ab Azib'],
    location: 'MAKMAL SAINS SPM B'
  },
  { 
    id: 'c03', 
    name: 'Kelab K3P', 
    categoryId: 'cat_club', 
    advisorHead: 'Wan Zarinah bt Wan Zin',
    advisors: ['Wan Zarinah bt Wan Zin', 'Nor Ashikin bt Mohd Razali', 'Zalhusyaini Binti Hamzah'],
    location: 'KELAS 4C'
  },
  { 
    id: 'c04', 
    name: 'Kelab Kerjaya', 
    categoryId: 'cat_club', 
    advisorHead: 'Norasyiqin bt Mohamad',
    advisors: ['Norasyiqin bt Mohamad', 'Wan Mohd Ruzaimin bin Wan Ariffin'],
    location: 'KELAS 2A'
  },
  { id: 'c05', name: 'Kelab Keselamatan Jalan Raya', categoryId: 'cat_club', advisors: [] },
  { 
    id: 'c06', 
    name: 'Kelab Pencegahan Jenayah', 
    categoryId: 'cat_club', 
    advisorHead: 'Zakina bt Harun',
    advisors: ['Zakina bt Harun', 'Rosminah bt Yusof', 'Mohd Kaziran bin Kadir', 'Wan Mohd Zul Hilmi bin Wan Zakaria'],
    location: 'MAKMAL SAINS C'
  },
  { 
    id: 'c07', 
    name: 'Kelab PNB', 
    categoryId: 'cat_club', 
    advisorHead: 'Nor Sharmy Suharmila bt Hassan',
    advisors: ['Nor Sharmy Suharmila bt Hassan', 'Zaharah bt Hamzah', 'Khaleza Adilah bt Abd Ghani'],
    location: 'KELAS 2E'
  },
  { 
    id: 'c08', 
    name: 'Kelab Seni Kraf', 
    categoryId: 'cat_club', 
    advisorHead: 'Hashidah bt Abdullah',
    advisors: ['Hashidah bt Abdullah', 'Ruzilawati bt Mohammad', 'Wan Nurulfarhah bt Awang@Hasan'],
    location: 'MAKMAL SAINS D'
  },
  { 
    id: 'c09', 
    name: 'Kelab STEM', 
    categoryId: 'cat_club', 
    advisorHead: 'Jazilah bt Wan Mohd Kasim',
    advisors: ['Jazilah bt Wan Mohd Kasim', 'Suhaida bt Abu Bakar', 'Salwanie bt Mazlan'],
    location: 'MAKMAL SAINS SPM A'
  },
  { 
    id: 'c10', 
    name: 'KESEF', 
    categoryId: 'cat_club', 
    advisorHead: 'Ruslia bt Talib',
    advisors: ['Ruslia bt Talib', 'Nik Fatni bt Nik Abdullah', 'Noraini bt Mat Ghani'],
    location: 'MAKMAL SAINS B'
  },
  { 
    id: 'c11', 
    name: 'Persatuan Bahasa Inggeris', 
    categoryId: 'cat_club', 
    advisorHead: 'Siti Hanum bt Zahudi @ Zulkifli',
    advisors: ['Siti Hanum bt Zahudi @ Zulkifli', 'Nik Hasifah bt Nik Mustafa', 'Suriani bt Mat Yatim'],
    location: 'KELAS 3B'
  },
  { 
    id: 'c12', 
    name: 'Persatuan Bahasa Melayu', 
    categoryId: 'cat_club', 
    advisorHead: 'Nor \'Elina bt Che Kerema',
    advisors: ['Nor \'Elina bt Che Kerema', 'Roseniza bt Deraman', 'Wan Shafien b Wan Mohamed', 'Nursyuhada bt Shukri'],
    location: 'KELAS 3A'
  },
  { 
    id: 'c13', 
    name: 'Persatuan Pendidikan Islam', 
    categoryId: 'cat_club', 
    advisorHead: 'Nor Amalina bt Nawi',
    advisors: ['Nor Amalina bt Nawi', 'Zaiton bt Zakaria', 'Nor Aziah bt Zakaria'],
    location: 'KELAS 2B'
  },
  { 
    id: 'c14', 
    name: 'Persatuan Sejarah', 
    categoryId: 'cat_club', 
    advisorHead: 'Rozemah bt Sabtu',
    advisors: ['Rozemah bt Sabtu', 'Siti Saraf bt Roni', 'Rahani bt Jusoh'],
    location: 'KELAS 2C'
  },

  // Sukan Permainan
  { 
    id: 's01', 
    name: 'Badminton', 
    categoryId: 'cat_sport', 
    advisorHead: 'Munirah bt Mustapha',
    advisors: ['Munirah bt Mustapha', 'Nik Fatni bt Nik Abdullah', 'Nor\'Elina bt Che Kerema', 'Ruslia bt Talib'],
    location: 'KELAS 2B'
  },
  { 
    id: 's02', 
    name: 'Bocce', 
    categoryId: 'cat_sport', 
    advisorHead: 'Zaharah bt Hamzah',
    advisors: ['Zaharah bt Hamzah', 'Zalhusyaini bt Hamzah', 'Yarni bt Mohd Daud'],
    location: 'MAKMAL SAINS A'
  },
  { 
    id: 's03', 
    name: 'Bola Baling', 
    categoryId: 'cat_sport', 
    advisorHead: 'Rahani bt Jusoh',
    advisors: ['Rahani bt Jusoh', 'Jazilah bt Wan Mohd Kasim', 'Zakina bt Harun', 'Zaiton bt Zakaria'],
    location: 'KELAS 2E'
  },
  { 
    id: 's04', 
    name: 'Bola Jaring', 
    categoryId: 'cat_sport', 
    advisorHead: 'Noraini bt Mat Ghani',
    advisors: ['Noraini bt Mat Ghani', 'Suriani bt Mat Yatim', 'Nor Amalina bt Mat Nawi', 'Nik Hasifah bt Nik Mustapha'],
    location: 'MAKMAL SAINS C'
  },
  { 
    id: 's05', 
    name: 'Bola Sepak', 
    categoryId: 'cat_sport', 
    advisorHead: 'Wan Muhammad Zulhilmi bin Wan Zakaria',
    advisors: ['Wan Muhammad Zulhilmi bin Wan Zakaria', 'Mohd Kaziran bin Kadir', 'Mohd Hazim bin Mohd Ghazali', 'Noor Aini bt Hussin', 'Rozemah bt Sabtu'],
    location: 'KELAS 3A'
  },
  { 
    id: 's06', 
    name: 'Bola Tampar', 
    categoryId: 'cat_sport', 
    advisorHead: 'Siti Saraf bt Roni',
    advisors: ['Siti Saraf bt Roni', 'Hashidah bt Abdullah', 'Wan Nurul Farhah bt Wan Awang @ Hasan', 'Siti Hanum bt Zahudi @ Zulkifli'],
    location: 'KELAS 2C'
  },
  { 
    id: 's07', 
    name: 'Olahraga', 
    categoryId: 'cat_sport', 
    advisorHead: 'Ridhauddin bin Mohamed',
    advisors: ['Ridhauddin bin Mohamed', 'Norasyiqin bt Mohamad', 'Wan Zarinah bt Wan Zin', 'Nursyuhada bt Shukri', 'Salwanie bt Mazlan'],
    location: 'MAKMAL SAINS D'
  },
  { 
    id: 's08', 
    name: 'Petanque', 
    categoryId: 'cat_sport', 
    advisorHead: 'Khaleza Adilah bt Abd Ghani',
    advisors: ['Khaleza Adilah bt Abd Ghani', 'Norashikin bt Mohd Razali', 'Nor Sharmy Suharmila bt Hassan'],
    location: 'KANTIN'
  },
  { 
    id: 's09', 
    name: 'Ping Pong', 
    categoryId: 'cat_sport', 
    advisorHead: 'Khairany bt Ab Azib',
    advisors: ['Khairany bt Ab Azib', 'Norlayla bt Ibrahim', 'Suhaida bt Abu Bakar', 'Nor Aziah bt Zakaria'],
    location: 'MAKMAL SAINS B'
  },
  { 
    id: 's10', 
    name: 'Sepak Takraw', 
    categoryId: 'cat_sport', 
    advisorHead: 'Wan Shafien b Wan Mohamed',
    advisors: ['Wan Shafien b Wan Mohamed', 'Wan Mohd Ruzaimin bin Wan Ariffin', 'Ruzilawati bt Mohamad', 'Zalina bt Bidin', 'Rosminah bt Yusof'],
    location: 'KELAS 2A'
  },

  // Rumah Sukan
  { id: 'h01', name: 'Rumah Biru', categoryId: 'cat_house', advisors: [] },
  { id: 'h02', name: 'Rumah Hijau', categoryId: 'cat_house', advisors: [] },
  { id: 'h03', name: 'Rumah Kuning', categoryId: 'cat_house', advisors: [] },
  { id: 'h04', name: 'Rumah Merah', categoryId: 'cat_house', advisors: [] },
];

export const STORAGE_KEYS = {
  RECORDS: 'smkz2_records',
  ACTIVITIES: 'smkz2_activities',
  CATEGORIES: 'smkz2_categories',
  STUDENTS: 'smkz2_students',
  SHEET_URL: 'smkz2_sheet_url',
  LAST_SYNC: 'smkz2_last_sync'
};

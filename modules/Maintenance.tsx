
import React, { useState, useEffect } from 'react';
import { Activity, ActivityType, Student } from '../types';
import { STORAGE_KEYS } from '../constants';

interface MaintenanceProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Maintenance: React.FC<MaintenanceProps> = ({ activities, setActivities, setStudents }) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ActivityType>(ActivityType.UNIFORM);
  const [sheetUrl, setSheetUrl] = useState('');
  const [csvPaste, setCsvPaste] = useState('');
  const [lastSync, setLastSync] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SHEET_URL);
    const savedSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (savedUrl) setSheetUrl(savedUrl);
    if (savedSync) setLastSync(savedSync);
  }, []);

  const parseAndSaveCSV = (csvText: string) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const parsedStudents: Student[] = lines
      .slice(1) // Abaikan header
      .map(line => {
        // Handle CSV split by comma but respect potential quotes
        const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columns.length < 3) return null;
        return {
          id: columns[0].trim().replace(/"/g, ''), // Bil/ID
          name: columns[1].trim().replace(/"/g, ''), // Nama
          class: columns[2].trim().replace(/"/g, '')  // Kelas
        };
      })
      .filter(s => s !== null && s.id && s.name) as Student[];
    
    return parsedStudents;
  };

  const processImport = (parsed: Student[]) => {
    if (parsed.length === 0) {
      alert('Gagal memproses data. Sila pastikan format CSV adalah betul.');
      return;
    }

    setStudents(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const uniqueNew = parsed.filter(p => !existingIds.has(p.id));
      
      if (uniqueNew.length === 0) {
        alert('Tiada data baharu ditemui. Semua rekod dalam fail sudah wujud dalam sistem.');
        return prev;
      }

      if (confirm(`Ditemui ${uniqueNew.length} rekod baharu (${parsed.length - uniqueNew.length} rekod sedia ada akan diabaikan). Teruskan import?`)) {
        const updated = [...prev, ...uniqueNew];
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
        
        const now = new Date().toLocaleString('ms-MY');
        setLastSync(now);
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
        setCsvPaste('');
        setFileInputKey(Date.now());
        alert(`Berjaya menambah ${uniqueNew.length} rekod murid baharu!`);
        return updated;
      }
      return prev;
    });
  };

  const handleCsvPasteImport = () => {
    if (!csvPaste.trim()) {
      alert('Sila tampal data CSV terlebih dahulu.');
      return;
    }

    const parsed = parseAndSaveCSV(csvPaste);
    processImport(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseAndSaveCSV(text);
      processImport(parsed);
    };
    reader.readAsText(file);
  };

  const syncStudentsFromGoogle = async () => {
    if (!sheetUrl) {
      alert('Sila masukkan URL Google Sheets (CSV) terlebih dahulu.');
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error('Gagal mengakses URL. Pastikan pautan adalah "Publish to web" sebagai CSV.');
      
      const csvText = await response.text();
      const parsed = parseAndSaveCSV(csvText);

      if (parsed.length === 0) {
        throw new Error('Tiada data murid ditemui dalam fail CSV tersebut.');
      }

      processImport(parsed);
      localStorage.setItem(STORAGE_KEYS.SHEET_URL, sheetUrl);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Ralat semasa memuat turun data.');
    } finally {
      setIsSyncing(false);
    }
  };

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      type: newType,
      advisors: [] 
    };

    setActivities(prev => [...prev, activity]);
    setNewName('');
    alert('Aktiviti berjaya ditambah!');
  };

  const removeActivity = (id: string) => {
    if (confirm('Padam aktiviti ini?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const clearAllStudents = () => {
    if (confirm('AMARAN: Ini akan memadam SEMUA data murid dari sistem. Teruskan?')) {
      setStudents([]);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      alert('Semua data murid telah dikosongkan.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        {/* CSV IMPORT CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-file-csv text-blue-600"></i>
            Import Data Murid (CSV)
          </h3>
          <div className="space-y-6">
            {/* File Upload Option */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Muat Naik Fail CSV</label>
              <div className="relative group">
                <input 
                  key={fileInputKey}
                  type="file" 
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl px-4 py-6 text-center group-hover:bg-blue-100 group-hover:border-blue-300 transition-all">
                  <i className="fas fa-cloud-upload-alt text-blue-500 text-2xl mb-2"></i>
                  <p className="text-xs font-bold text-blue-700">Pilih Fail CSV</p>
                  <p className="text-[9px] text-blue-500 mt-1">Klik atau seret fail ke sini</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-2 text-gray-300">Atau</span>
              </div>
            </div>

            {/* Paste Option */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tampal Data CSV</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[10px] focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none font-mono"
                placeholder="Bil,Nama,Kelas... (Copy & Paste dari Excel/Sheets)"
                value={csvPaste}
                onChange={(e) => setCsvPaste(e.target.value)}
              />
              <button 
                onClick={handleCsvPasteImport}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-paste text-xs"></i>
                Import dari Tampalan
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-[9px] text-amber-700 leading-relaxed">
                <i className="fas fa-info-circle mr-1"></i>
                <strong>Format:</strong> Lajur 1: ID/Bil, Lajur 2: Nama, Lajur 3: Kelas.<br/>
                Sistem akan mengesan data berulang secara automatik dan hanya memasukkan rekod baharu.
              </p>
            </div>
          </div>
        </div>

        {/* GOOGLE SHEETS SYNC CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fab fa-google-drive text-green-600"></i>
            Sync Google Sheets (Penuh)
          </h3>
          <div className="space-y-4">
            <input 
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="URL Google Sheets (CSV)"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
            <button 
              onClick={syncStudentsFromGoogle}
              disabled={isSyncing}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
              {isSyncing ? 'Menyinkron...' : 'Sinkron Pangkalan Data'}
            </button>
            <button 
              onClick={clearAllStudents}
              className="w-full text-red-500 text-[10px] font-bold uppercase py-2 hover:bg-red-50 rounded-lg transition-all"
            >
              Padam Semua Data Murid
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-plus-circle text-indigo-600"></i>
            Tambah Aktiviti Baharu
          </h3>
          <form onSubmit={addActivity} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              className="md:col-span-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Nama Aktiviti"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <select 
              className="md:col-span-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newType}
              onChange={(e) => setNewType(e.target.value as ActivityType)}
            >
              {Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Simpan
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Senarai Aktiviti Sistem</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {Object.values(ActivityType).map(type => (
              <div key={type} className="p-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  {type}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activities.filter(a => a.type === type).map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all">
                      <span className="text-sm font-semibold text-gray-700">{activity.name}</span>
                      <button 
                        onClick={() => removeActivity(activity.id)}
                        className="text-gray-300 hover:text-red-600 p-2 transition-colors"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

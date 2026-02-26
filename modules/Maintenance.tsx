
import React, { useState, useEffect } from 'react';
import { Activity, ActivityCategory, Student } from '../types';
import { STORAGE_KEYS, DEFAULT_CATEGORIES, DEFAULT_ACTIVITIES } from '../constants';

interface MaintenanceProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  categories: ActivityCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ActivityCategory[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Maintenance: React.FC<MaintenanceProps> = ({ activities, setActivities, categories, setCategories, setStudents }) => {
  const [newName, setNewName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryCoordinator, setNewCategoryCoordinator] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('fa-folder');
  const [newCategoryColor, setNewCategoryColor] = useState('indigo');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [csvPaste, setCsvPaste] = useState('');
  const [lastSync, setLastSync] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (categories.length > 0 && !newCategoryId) {
      setNewCategoryId(categories[0].id);
    }
  }, [categories, newCategoryId]);

  useEffect(() => {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.SHEET_URL);
    const savedSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (savedUrl) setSheetUrl(savedUrl);
    if (savedSync) setLastSync(savedSync);
  }, []);

  const parseAndSaveCSV = (csvText: string) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const header = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/"/g, '').toLowerCase());
    
    // Map headers to category IDs
    const headerMap: Record<string, number> = {};
    header.forEach((h, i) => {
      headerMap[h] = i;
    });

    const idx = {
      id: header.indexOf('bil') !== -1 ? header.indexOf('bil') : header.indexOf('id'),
      name: header.indexOf('nama'),
      class: header.indexOf('kelas')
    };

    const parsedStudents: Student[] = lines
      .slice(1)
      .map(line => {
        const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columns.length < 3) return null;

        const getVal = (index: number) => index !== -1 && columns[index] ? columns[index].trim().replace(/"/g, '') : undefined;

        const assignments: Record<string, string> = {};
        
        // Match columns to categories
        categories.forEach(cat => {
          const catName = cat.name.toLowerCase();
          const colIdx = header.findIndex(h => 
            h.includes(catName) || 
            (catName.includes('uniform') && h.includes('uniform')) ||
            (catName.includes('kelab') && h.includes('kelab')) ||
            (catName.includes('sukan') && h.includes('sukan')) ||
            (catName.includes('rumah') && h.includes('rumah'))
          );

          if (colIdx !== -1) {
            const activityName = getVal(colIdx);
            if (activityName) {
              const match = activities.find(a => 
                a.categoryId === cat.id && 
                a.name.toLowerCase().includes(activityName.toLowerCase())
              );
              if (match) assignments[cat.id] = match.id;
            }
          }
        });

        return {
          id: getVal(idx.id) || Math.random().toString(36).substr(2, 9),
          name: getVal(idx.name) || 'Tiada Nama',
          class: getVal(idx.class) || 'Tiada Kelas',
          assignments
        };
      })
      .filter(s => s !== null && s.name !== 'Tiada Nama') as Student[];
    
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

  const [newLocation, setNewLocation] = useState('');
  const [newAdvisorHead, setNewAdvisorHead] = useState('');
  const [newAdvisors, setNewAdvisors] = useState('');

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCategoryId) return;
    
    if (editingActivityId) {
      setActivities(prev => prev.map(a => a.id === editingActivityId ? {
        ...a,
        name: newName,
        categoryId: newCategoryId,
        advisorHead: newAdvisorHead,
        advisors: newAdvisors.split(',').map(a => a.trim()).filter(Boolean),
        location: newLocation
      } : a));
      setEditingActivityId(null);
      alert('Aktiviti berjaya dikemaskini!');
    } else {
      const activity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        categoryId: newCategoryId,
        advisorHead: newAdvisorHead,
        advisors: newAdvisors.split(',').map(a => a.trim()).filter(Boolean),
        location: newLocation
      };
      setActivities(prev => [...prev, activity]);
      alert('Aktiviti berjaya ditambah!');
    }

    setNewName('');
    setNewLocation('');
    setNewAdvisorHead('');
    setNewAdvisors('');
  };

  const startEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setNewName(activity.name);
    setNewCategoryId(activity.categoryId);
    setNewLocation(activity.location || '');
    setNewAdvisorHead(activity.advisorHead || '');
    setNewAdvisors((activity.advisors || []).join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeActivity = (id: string) => {
    if (confirm('Padam aktiviti ini?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    if (editingCategoryId) {
      setCategories(prev => prev.map(c => c.id === editingCategoryId ? {
        ...c,
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
        coordinator: newCategoryCoordinator
      } : c));
      setEditingCategoryId(null);
      alert('Kategori berjaya dikemaskini!');
    } else {
      const category: ActivityCategory = {
        id: 'cat_' + Math.random().toString(36).substr(2, 5),
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
        coordinator: newCategoryCoordinator
      };
      setCategories(prev => [...prev, category]);
      alert('Kategori berjaya ditambah!');
    }

    setNewCategoryName('');
    setNewCategoryCoordinator('');
    setNewCategoryIcon('fa-folder');
    setNewCategoryColor('indigo');
  };

  const startEditCategory = (category: ActivityCategory) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryCoordinator(category.coordinator || '');
    setNewCategoryIcon(category.icon || 'fa-folder');
    setNewCategoryColor(category.color || 'indigo');
  };

  const resetToDefaults = () => {
    if (confirm('AMARAN: Ini akan memadam SEMUA kategori dan aktiviti sedia ada dan menggantikannya dengan tetapan asal. Teruskan?')) {
      setCategories(DEFAULT_CATEGORIES);
      setActivities(DEFAULT_ACTIVITIES);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      alert('Sistem telah dikembalikan ke tetapan asal.');
    }
  };

  const removeCategory = (id: string) => {
    const hasActivities = activities.some(a => a.categoryId === id);
    if (hasActivities) {
      alert('Gagal memadam. Sila padam semua aktiviti di bawah kategori ini terlebih dahulu.');
      return;
    }

    if (confirm('Padam kategori ini?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
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
        {/* CATEGORY MANAGEMENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-tags text-amber-600"></i>
            {editingCategoryId ? 'Kemaskini Kategori' : 'Urus Kategori Aktiviti'}
          </h3>
          <form onSubmit={addCategory} className="space-y-4 mb-6">
            <div className="space-y-3">
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Nama Kategori"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Nama Penyelaras (Opsional)"
                value={newCategoryCoordinator}
                onChange={(e) => setNewCategoryCoordinator(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                >
                  <option value="fa-folder">Folder</option>
                  <option value="fa-shield-alt">Shield</option>
                  <option value="fa-users">Users</option>
                  <option value="fa-volleyball-ball">Ball</option>
                  <option value="fa-home">Home</option>
                  <option value="fa-star">Star</option>
                  <option value="fa-book">Book</option>
                </select>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                >
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className={`flex-1 ${editingCategoryId ? 'bg-blue-600' : 'bg-amber-600'} text-white py-2 rounded-xl font-bold hover:opacity-90 transition-all`}>
                  {editingCategoryId ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
                {editingCategoryId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setNewCategoryName('');
                      setNewCategoryCoordinator('');
                      setNewCategoryIcon('fa-folder');
                      setNewCategoryColor('indigo');
                    }}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </form>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded bg-${cat.color || 'gray'}-100 text-${cat.color || 'gray'}-600 flex items-center justify-center text-[10px]`}>
                    <i className={`fas ${cat.icon || 'fa-folder'}`}></i>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                    {cat.coordinator && <span className="text-[9px] text-gray-400 font-medium">Penyelaras: {cat.coordinator}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEditCategory(cat)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button 
                    onClick={() => removeCategory(cat.id)}
                    className="text-gray-300 hover:text-red-600 transition-colors"
                  >
                    <i className="fas fa-times-circle text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSV IMPORT CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-file-csv text-blue-600"></i>
            Import Data Murid (CSV)
          </h3>
          <div className="space-y-6">
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
                <strong>Format:</strong> Lajur 1: ID/Bil, Lajur 2: Nama, Lajur 3: Kelas. Lajur tambahan boleh mengandungi nama kategori (Cth: "Rumah Sukan") untuk tugasan automatik.
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
            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={resetToDefaults}
                className="w-full text-amber-600 text-[10px] font-bold uppercase py-2 hover:bg-amber-50 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-undo-alt"></i>
                Kembali ke Tetapan Asal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className={`fas ${editingActivityId ? 'fa-edit' : 'fa-plus-circle'} text-indigo-600`}></i>
            {editingActivityId ? 'Kemaskini Aktiviti' : 'Tambah Aktiviti Baharu'}
          </h3>
          <form onSubmit={addActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Maklumat Asas</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Nama Aktiviti"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lokasi & Guru</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Lokasi (Cth: Kelas 3A)"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ketua Guru Penasihat"
                value={newAdvisorHead}
                onChange={(e) => setNewAdvisorHead(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Senarai Guru Penasihat (Asingkan dengan koma)</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                placeholder="Cth: Guru A, Guru B, Guru C"
                value={newAdvisors}
                onChange={(e) => setNewAdvisors(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button className={`flex-1 ${editingActivityId ? 'bg-blue-600' : 'bg-indigo-600'} text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-100`}>
                {editingActivityId ? 'Simpan Perubahan' : 'Simpan Aktiviti'}
              </button>
              {editingActivityId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingActivityId(null);
                    setNewName('');
                    setNewLocation('');
                    setNewAdvisorHead('');
                    setNewAdvisors('');
                  }}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Senarai Aktiviti Sistem</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {categories.map(category => (
              <div key={category.id} className="p-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  {category.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activities.filter(a => a.categoryId === category.id).map(activity => (
                    <div key={activity.id} className="flex flex-col p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-800">{activity.name}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startEditActivity(activity)}
                            className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                          >
                            <i className="fas fa-edit text-[10px]"></i>
                          </button>
                          <button 
                            onClick={() => removeActivity(activity.id)}
                            className="text-gray-300 hover:text-red-600 p-1 transition-colors"
                          >
                            <i className="fas fa-trash-alt text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
                          <i className="fas fa-map-marker-alt text-indigo-400"></i>
                          {activity.location || '-'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
                          <i className="fas fa-user-tie text-blue-400"></i>
                          {activity.advisorHead || '-'}
                        </div>
                      </div>
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

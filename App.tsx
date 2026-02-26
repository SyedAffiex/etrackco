
import React, { useState, useEffect } from 'react';
import { AppRole, NavPage, AttendanceRecord, Activity, ActivityCategory, RecordStatus, Student } from './types';
import { STORAGE_KEYS, DEFAULT_ACTIVITIES, DEFAULT_CATEGORIES, INITIAL_STUDENTS, LOGOS } from './constants';
import Sidebar from './components/Sidebar';
import GuruDashboard from './modules/GuruDashboard';
import AttendanceForm from './modules/AttendanceForm';
import PastReports from './modules/PastReports';
import SUDashboard from './modules/SUDashboard';
import Maintenance from './modules/Maintenance';
import SecretaryReports from './modules/SecretaryReports';
import StudentRecords from './modules/StudentRecords';
import SUFootbar from './components/SUFootbar';
import SULogin from './components/SULogin';

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>('GURU');
  const [isSUAuthenticated, setIsSUAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('RECORD_ATTENDANCE');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const SU_PASSWORD = 'suko@zass2';

  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
      const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);

      if (savedRecords) setRecords(JSON.parse(savedRecords));
      
      if (savedActivities) {
        const loadedActivities: Activity[] = JSON.parse(savedActivities);
        // Migration: Merge missing fields from DEFAULT_ACTIVITIES
        const migratedActivities = loadedActivities.map(loaded => {
          const defaultAct = DEFAULT_ACTIVITIES.find(d => d.id === loaded.id);
          if (defaultAct) {
            return {
              ...defaultAct,
              ...loaded,
              // Prioritize default values for these specific fields if they are missing in loaded data
              location: loaded.location || defaultAct.location,
              advisorHead: loaded.advisorHead || defaultAct.advisorHead,
              advisors: (loaded.advisors && loaded.advisors.length > 0) ? loaded.advisors : defaultAct.advisors
            };
          }
          return loaded;
        });
        setActivities(migratedActivities);
      } else {
        setActivities(DEFAULT_ACTIVITIES);
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      }

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      }

      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        setStudents(INITIAL_STUDENTS);
      }
      
      const auth = localStorage.getItem('su_auth');
      if (auth === 'true') setIsSUAuthenticated(true);
    } catch (e) {
      console.error("Initialization Error:", e);
    }
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    }
  }, [records]);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories]);

  const handleRoleSwitch = (newRole: AppRole) => {
    if (newRole === role && !showLogin) return;
    if (newRole === 'SU' && !isSUAuthenticated) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
      setRole(newRole);
      setCurrentPage(newRole === 'GURU' ? 'RECORD_ATTENDANCE' : 'DASHBOARD');
    }
  };

  const handleLoginSuccess = () => {
    setIsSUAuthenticated(true);
    localStorage.setItem('su_auth', 'true');
    setShowLogin(false);
    setRole('SU');
    setCurrentPage('DASHBOARD');
  };

  const handleLogout = () => {
    setIsSUAuthenticated(false);
    localStorage.removeItem('su_auth');
    setRole('GURU');
    setCurrentPage('RECORD_ATTENDANCE');
  };

  const saveRecord = (newRecord: AttendanceRecord) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === newRecord.id ? newRecord : r));
      setEditingRecord(null);
    } else {
      setRecords(prev => [newRecord, ...prev]);
    }
    setCurrentPage('VIEW_REPORTS');
  };

  const updateRecord = (id: string, updatedData: Partial<AttendanceRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const verifyRecord = (id: string) => {
    updateRecord(id, { status: RecordStatus.VERIFIED });
  };

  const startEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setCurrentPage('RECORD_ATTENDANCE');
  };

  const renderContent = () => {
    if (showLogin) {
      return <SULogin password={SU_PASSWORD} onSuccess={handleLoginSuccess} onCancel={() => { setShowLogin(false); setRole('GURU'); setCurrentPage('RECORD_ATTENDANCE'); }} />;
    }

    if (role === 'GURU') {
      switch (currentPage) {
        case 'RECORD_ATTENDANCE':
          return <AttendanceForm 
            activities={activities} 
            categories={categories}
            students={students} 
            onSubmit={saveRecord} 
            onCancel={() => { setEditingRecord(null); setCurrentPage('VIEW_REPORTS'); }} 
            initialRecord={editingRecord || undefined}
          />;
        case 'VIEW_REPORTS':
          return <PastReports 
            records={records} 
            activities={activities} 
            categories={categories}
            students={students} 
            updateRecord={updateRecord} 
            onEdit={startEdit}
          />;
        default:
          return <GuruDashboard records={records} setCurrentPage={setCurrentPage} />;
      }
    } else {
      switch (currentPage) {
        case 'DASHBOARD':
          return <SUDashboard records={records} activities={activities} categories={categories} verifyRecord={verifyRecord} deleteRecord={deleteRecord} />;
        case 'STUDENT_RECORDS':
          return <StudentRecords records={records} students={students} activities={activities} categories={categories} />;
        case 'SECRETARY_REPORTS':
          return <SecretaryReports records={records} activities={activities} categories={categories} students={students} />;
        case 'MAINTENANCE':
          return <Maintenance activities={activities} setActivities={setActivities} categories={categories} setCategories={setCategories} setStudents={setStudents} />;
        default:
          return <SUDashboard records={records} activities={activities} categories={categories} verifyRecord={verifyRecord} deleteRecord={deleteRecord} />;
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${role === 'SU' ? 'pb-24' : ''}`}>
      <div className="flex flex-1">
        <Sidebar 
          role={showLogin ? 'SU' : role} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
          isSUAuthenticated={isSUAuthenticated}
        />

        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          {!showLogin && (
            <header className="mb-8 no-print">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1">
                    <img src={LOGOS.SCHOOL} alt="Logo Sekolah" className="max-h-full max-w-full" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
                      eTrackCO <span className="text-blue-600">Zass2</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                      Sistem Pengurusan Rekod Kehadiran Kokurikulum. Hakcipta Terpelihara.
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-right hidden md:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pangkalan Data</p>
                  <p className="text-xs font-bold text-gray-700">{students.length} Murid Berdaftar</p>
                </div>
              </div>
            </header>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {role === 'SU' && !showLogin && <SUFootbar records={records} />}
    </div>
  );
};

export default App;

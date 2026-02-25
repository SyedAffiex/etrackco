
import React, { useState, useMemo, useEffect } from 'react';
import { Activity, ActivityType, Student, RecordStatus, AttendanceRecord, AdvisorAttendance } from '../types';

interface AttendanceFormProps {
  activities: Activity[];
  students: Student[];
  onSubmit: (record: AttendanceRecord) => void;
  onCancel: () => void;
  initialRecord?: AttendanceRecord;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ activities, students, onSubmit, onCancel, initialRecord }) => {
  const [type, setType] = useState<ActivityType>(initialRecord?.activityType || ActivityType.CLUB);
  const [activityId, setActivityId] = useState(initialRecord?.activityId || '');
  const [date, setDate] = useState(initialRecord?.date || new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState(initialRecord?.topic || '');
  const [absenteeIds, setAbsenteeIds] = useState<string[]>(initialRecord?.absenteeIds || []);
  const [advisorAttendance, setAdvisorAttendance] = useState<AdvisorAttendance[]>(initialRecord?.advisorAttendance || []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = useMemo(() => activities.filter(a => a.type === type), [activities, type]);
  const selectedActivity = useMemo(() => activities.find(a => a.id === activityId), [activities, activityId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  useEffect(() => {
    if (selectedActivity) {
      const isDifferentFromInitial = initialRecord?.activityId !== activityId;
      if (!initialRecord || isDifferentFromInitial) {
        const advisors = selectedActivity.advisors || [];
        const initialAdvisors = advisors.map(name => ({
          name,
          isPresent: true,
          reason: ''
        }));
        setAdvisorAttendance(initialAdvisors);
      }
    } else {
      setAdvisorAttendance([]);
    }
  }, [selectedActivity, activityId, initialRecord]);

  const toggleStudent = (id: string) => {
    setAbsenteeIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateAdvisorPresence = (index: number, isPresent: boolean) => {
    setAdvisorAttendance(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], isPresent, reason: isPresent ? '' : next[index].reason };
      }
      return next;
    });
  };

  const updateAdvisorReason = (index: number, reason: string) => {
    setAdvisorAttendance(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], reason };
      }
      return next;
    });
  };

  const handleAction = (status: RecordStatus) => {
    if (!activityId) {
      alert('Sila pilih nama aktiviti terlebih dahulu.');
      return;
    }
    if (!topic.trim()) {
      alert('Sila masukkan tajuk atau perkara aktiviti.');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: initialRecord?.id || Math.random().toString(36).substr(2, 9),
      activityId,
      activityType: type,
      date,
      topic: topic.trim(),
      absenteeIds,
      advisorAttendance,
      status,
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
      teacherName: initialRecord?.teacherName || selectedActivity?.advisorHead || 'Guru Bertugas', 
      location: selectedActivity?.location || 'Tiada Lokasi',
      advisorHead: selectedActivity?.advisorHead || 'Tiada Nama'
    };

    onSubmit(newRecord);
    const msg = status === RecordStatus.DRAFT ? 'Draf berjaya dikemaskini.' : 'Laporan telah berjaya dihantar.';
    alert(msg);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <i className={`fas ${initialRecord ? 'fa-edit' : 'fa-clipboard-check'}`}></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{initialRecord ? 'Kemaskini Laporan' : 'Rekod Kehadiran Baharu'}</h2>
            <p className="text-sm text-gray-500">Lengkapkan maklumat aktiviti sebelum menandakan kehadiran.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">1. Pilih Jenis Aktiviti</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
              value={type}
              onChange={(e) => {
                setType(e.target.value as ActivityType);
                setActivityId('');
              }}
            >
              {Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">2. Pilih Nama Aktiviti</label>
            <select 
              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold ${!activityId ? 'border-amber-300 ring-2 ring-amber-50' : 'border-gray-200'}`}
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
            >
              <option value="">-- Sila Pilih --</option>
              {filteredActivities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {selectedActivity && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-indigo-500"></i>
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm font-bold text-indigo-700">{selectedActivity.location || '-'}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                <i className="fas fa-user-tie text-blue-500"></i>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ketua Penasihat</p>
                  <p className="text-sm font-bold text-blue-700">{selectedActivity.advisorHead || '-'}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">3. Tarikh</label>
            <input 
              type="date" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">4. Tajuk/Perkara</label>
            <input 
              type="text" 
              placeholder="Cth: Mesyuarat Agung"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        {/* CONDITION RENDER: GURU & MURID LIST */}
        {activityId ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Bahagian Kehadiran Guru */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                <i className="fas fa-user-shield text-indigo-500"></i>
                Kehadiran Guru Penasihat
                <span className="text-xs font-normal text-gray-400">(Tandakan jika <span className="text-green-600 font-bold">HADIR</span>)</span>
              </h3>
              <div className="space-y-3">
                {(advisorAttendance || []).map((advisor, index) => (
                  <div key={index} className={`p-4 rounded-xl border transition-all ${advisor.isPresent ? 'bg-white border-gray-100 shadow-sm' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 flex items-center gap-3">
                        <button 
                          onClick={() => updateAdvisorPresence(index, !advisor.isPresent)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${advisor.isPresent ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-transparent'}`}
                        >
                          <i className="fas fa-check text-[10px]"></i>
                        </button>
                        <span className={`text-sm font-bold ${advisor.isPresent ? 'text-gray-800' : 'text-red-700'}`}>
                          {advisor.name}
                        </span>
                      </div>
                      {!advisor.isPresent && (
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Sebab tidak hadir..."
                            className="w-full bg-white border border-red-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-red-500 font-medium"
                            value={advisor.reason || ''}
                            onChange={(e) => updateAdvisorReason(index, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-users text-blue-500"></i>
                  Kehadiran Murid
                  <span className="text-xs font-normal text-gray-400">(Tandakan yang <span className="text-red-500 font-bold underline">TIDAK HADIR</span>)</span>
                </h3>
                
                <div className="relative w-full md:w-64">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input 
                    type="text"
                    placeholder="Cari nama murid..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStudents.map(student => {
                  const isAbsent = absenteeIds.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${
                        isAbsent 
                          ? 'bg-red-50 border-red-200 text-red-700' 
                          : 'bg-green-50/20 border-green-100 text-gray-700 hover:bg-white hover:shadow-md hover:border-blue-200'
                      }`}
                    >
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-bold mb-0.5">{student.name}</span>
                        <span className="text-[9px] opacity-60 uppercase font-black tracking-widest">{student.class}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ml-3 transition-colors ${isAbsent ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 bg-white text-transparent group-hover:border-blue-400'}`}>
                        <i className="fas fa-check text-[10px]"></i>
                      </div>
                    </button>
                  );
                })}
                {filteredStudents.length === 0 && students.length > 0 && (
                  <div className="md:col-span-2 py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 font-medium italic">Tiada nama sepadan dengan "{searchQuery}"</p>
                  </div>
                )}
                {students.length === 0 && (
                  <div className="md:col-span-2 py-16 text-center bg-blue-50 rounded-2xl border border-dashed border-blue-200">
                    <i className="fas fa-user-slash text-blue-200 text-4xl mb-4 block"></i>
                    <p className="text-sm text-blue-600 font-bold">Pangkalan data murid masih kosong.</p>
                    <p className="text-xs text-blue-400 mt-1">Sila pastikan S/U telah mengimport data murid di menu Penyelenggaraan.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-8 mt-8 border-t border-gray-100">
              <button 
                onClick={() => handleAction(RecordStatus.SUBMITTED)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-paper-plane"></i>
                Hantar Laporan Rasmi
              </button>
              <button 
                onClick={() => handleAction(RecordStatus.DRAFT)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-save"></i>
                Simpan Draf
              </button>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-mouse-pointer text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-gray-500 font-bold">Sila Pilih Nama Aktiviti</h3>
            <p className="text-xs text-gray-400 mt-1">Senarai kehadiran akan dipaparkan secara automatik selepas pilihan dibuat.</p>
          </div>
        )}

        <div className="mt-6 pt-4 text-center">
          <button onClick={onCancel} className="text-xs text-gray-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest">
            Batal & Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;

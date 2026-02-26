
import React, { useState } from 'react';
import { AttendanceRecord, Activity, ActivityCategory, RecordStatus } from '../types';

interface SUDashboardProps {
  records: AttendanceRecord[];
  activities: Activity[];
  categories: ActivityCategory[];
  verifyRecord: (id: string) => void;
  deleteRecord: (id: string) => void;
}

const SUDashboard: React.FC<SUDashboardProps> = ({ records, activities, categories, verifyRecord, deleteRecord }) => {
  const [filterCategoryId, setFilterCategoryId] = useState<string>('ALL');
  const [filterDate, setFilterDate] = useState<string>('');

  const filtered = records.filter(r => {
    const matchCategory = filterCategoryId === 'ALL' || r.categoryId === filterCategoryId;
    const matchDate = !filterDate || r.date === filterDate;
    return matchCategory && matchDate;
  });

  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === RecordStatus.SUBMITTED).length,
    verified: records.filter(r => r.status === RecordStatus.VERIFIED).length,
    today: records.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jumlah Laporan', value: stats.total, color: 'indigo', icon: 'fa-file-alt' },
          { label: 'Perlu Pengesahan', value: stats.pending, color: 'red', icon: 'fa-exclamation-triangle' },
          { label: 'Telah Disahkan', value: stats.verified, color: 'green', icon: 'fa-check-double' },
          { label: 'Laporan Hari Ini', value: stats.today, color: 'blue', icon: 'fa-calendar-day' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center text-xl`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-6 rounded-2xl border border-gray-100 shadow-sm no-print">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tapis Kategori</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tapis Tarikh</label>
          <input 
            type="date" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setFilterCategoryId('ALL'); setFilterDate(''); }}
          className="bg-gray-100 text-gray-500 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Senarai Kehadiran Untuk Disahkan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Guru Penasihat</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Aktiviti / Tajuk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Hadir</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(record => {
                const activityName = activities.find(a => a.id === record.activityId)?.name || 'N/A';
                return (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          {record.teacherName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{record.teacherName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{record.topic}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{activityName} • {new Date(record.date).toLocaleDateString('ms-MY')}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">10/10</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        record.status === RecordStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                        record.status === RecordStatus.SUBMITTED ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {record.status === RecordStatus.SUBMITTED && (
                        <button 
                          onClick={() => verifyRecord(record.id)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-100"
                        >
                          Sahkan
                        </button>
                      )}
                      <button 
                        onClick={() => { if(confirm('Hapus rekod ini?')) deleteRecord(record.id); }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">Tiada rekod memerlukan perhatian anda buat masa ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SUDashboard;

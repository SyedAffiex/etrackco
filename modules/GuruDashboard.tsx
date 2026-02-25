
import React from 'react';
import { AttendanceRecord, NavPage, RecordStatus } from '../types';

interface GuruDashboardProps {
  records: AttendanceRecord[];
  setCurrentPage: (page: NavPage) => void;
}

const GuruDashboard: React.FC<GuruDashboardProps> = ({ records, setCurrentPage }) => {
  const stats = {
    total: records.length,
    verified: records.filter(r => r.status === RecordStatus.VERIFIED).length,
    pending: records.filter(r => r.status === RecordStatus.SUBMITTED).length,
    draft: records.filter(r => r.status === RecordStatus.DRAFT).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jumlah Rekod', value: stats.total, color: 'blue', icon: 'fa-list' },
          { label: 'Telah Disahkan', value: stats.verified, color: 'green', icon: 'fa-check-circle' },
          { label: 'Belum Disah', value: stats.pending, color: 'amber', icon: 'fa-clock' },
          { label: 'Dalam Draf', value: stats.draft, color: 'gray', icon: 'fa-file-edit' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Sedia untuk merekod?</h2>
          <p className="text-blue-100 mb-6 max-w-md">Pastikan anda merekod kehadiran aktiviti kokurikulum setiap minggu untuk pelaporan yang tepat.</p>
          <button 
            onClick={() => setCurrentPage('RECORD_ATTENDANCE')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Rekod Sekarang
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Rekod Terkini</h3>
          <button onClick={() => setCurrentPage('PAST_REPORTS')} className="text-sm text-blue-600 font-bold hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Aktiviti</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Tarikh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.slice(0, 5).map(record => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-700">{record.topic}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.date).toLocaleDateString('ms-MY')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      record.status === RecordStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                      record.status === RecordStatus.SUBMITTED ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">Tiada rekod setakat ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuruDashboard;

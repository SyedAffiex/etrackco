
import React from 'react';
import { AttendanceRecord, RecordStatus } from '../types';

interface SUFootbarProps {
  records: AttendanceRecord[];
}

const SUFootbar: React.FC<SUFootbarProps> = ({ records }) => {
  const pendingCount = records.filter(r => r.status === RecordStatus.SUBMITTED).length;
  const verifiedCount = records.filter(r => r.status === RecordStatus.VERIFIED).length;

  return (
    <footer className="fixed bottom-0 left-0 lg:left-64 right-0 bg-indigo-900 text-white p-4 z-40 shadow-2xl border-t border-indigo-800 no-print backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-bold tracking-wider uppercase opacity-80">Ringkasan S/U:</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-indigo-800/50 px-3 py-1.5 rounded-lg border border-indigo-700">
              <span className="text-xs font-medium text-indigo-300 uppercase">Perlu Sah:</span>
              <span className="text-sm font-black text-white">{pendingCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-900/40 px-3 py-1.5 rounded-lg border border-green-800/50">
              <span className="text-xs font-medium text-green-400 uppercase">Selesai:</span>
              <span className="text-sm font-black text-white">{verifiedCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>Sesi Akademik 2024/2025</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span>S/U Kokurikulum SMK Zainab 2</span>
        </div>
      </div>
    </footer>
  );
};

export default SUFootbar;

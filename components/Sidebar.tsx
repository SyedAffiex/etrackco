
import React from 'react';
import { AppRole, NavPage } from '../types';
import { LOGOS } from '../constants';

interface SidebarProps {
  role: AppRole;
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  onRoleSwitch: (role: AppRole) => void;
  onLogout: () => void;
  isSUAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentPage, setCurrentPage, onRoleSwitch, onLogout, isSUAuthenticated }) => {
  const guruMenu = [
    { id: 'RECORD_ATTENDANCE', icon: 'fa-plus-circle', label: 'Rekod Kehadiran' },
    { id: 'VIEW_REPORTS', icon: 'fa-file-invoice', label: 'Lihat Laporan' },
  ];

  const suMenu = [
    { id: 'DASHBOARD', icon: 'fa-chart-pie', label: 'Dashboard S/U' },
    { id: 'STUDENT_RECORDS', icon: 'fa-user-graduate', label: 'Rekod Murid' },
    { id: 'SECRETARY_REPORTS', icon: 'fa-print', label: 'Jana Laporan' },
    { id: 'MAINTENANCE', icon: 'fa-cog', label: 'Penyelenggaraan' },
  ];

  const menu = role === 'GURU' ? guruMenu : suMenu;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-40 no-print">
      <div className="p-6 border-b border-gray-50 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={LOGOS.ZASS2} 
            alt="Logo Zass 2" 
            className="w-32 h-auto mb-4 hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="font-black text-blue-900 text-sm tracking-tighter text-center uppercase">eTrackCO Zass2</span>
        </div>

        {/* Role Switcher */}
        <div className="bg-gray-100/80 p-1 rounded-xl flex items-center border border-gray-200">
          <button
            onClick={() => onRoleSwitch('GURU')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              role === 'GURU' 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            GURU
          </button>
          <button
            onClick={() => onRoleSwitch('SU')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              role === 'SU' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            S/U
          </button>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2">
        <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Menu {role === 'GURU' ? 'Guru Penasihat' : 'S/U Kokurikulum'}
        </p>
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as NavPage)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === item.id 
                ? role === 'GURU' 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                  : 'bg-indigo-50 text-indigo-600 shadow-sm border-l-4 border-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        {role === 'SU' && isSUAuthenticated && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            Log Keluar S/U
          </button>
        )}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium text-center italic leading-tight">
            eTrackCO Zass2<br/>Sistem Pengurusan Rekod Kehadiran Kokurikulum
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
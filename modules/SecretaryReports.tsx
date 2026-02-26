
import React, { useState } from 'react';
import { AttendanceRecord, Activity, ActivityCategory, Student, RecordStatus } from '../types';

interface SecretaryReportsProps {
  records: AttendanceRecord[];
  activities: Activity[];
  categories: ActivityCategory[];
  students: Student[];
}

const SecretaryReports: React.FC<SecretaryReportsProps> = ({ records, activities, categories, students }) => {
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('ALL');

  const months = [
    { value: 'ALL', label: 'Semua Bulan' },
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Mac' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Jun' },
    { value: '6', label: 'Julai' },
    { value: '7', label: 'Ogos' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Disember' },
  ];

  const filtered = records.filter(r => {
    const rDate = new Date(r.date);
    const matchMonth = filterMonth === 'ALL' || rDate.getMonth().toString() === filterMonth;
    const matchCategory = filterCategoryId === 'ALL' || r.categoryId === filterCategoryId;
    return matchMonth && matchCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm no-print flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bulan Pelaporan</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kategori Aktiviti</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-print"></i>
          Cetak Pelaporan
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" id="print-area">
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-xl font-bold uppercase">Ringkasan Pelaporan Bulanan Kokurikulum</h1>
          <h2 className="text-lg font-bold uppercase">SMK Zainab 2, Kota Bharu</h2>
          <p className="text-sm mt-2">
            Pelaporan: {filterMonth === 'ALL' ? 'Sepanjang Tahun' : months.find(m => m.value === filterMonth)?.label} 
            {filterCategoryId !== 'ALL' ? ` (${categories.find(c => c.id === filterCategoryId)?.name})` : ''}
          </p>
        </div>

        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-xs font-bold uppercase">
              <th className="border border-gray-300 p-2 text-left w-12">No</th>
              <th className="border border-gray-300 p-2 text-left">Tarikh</th>
              <th className="border border-gray-300 p-2 text-left">Guru Penasihat</th>
              <th className="border border-gray-300 p-2 text-left">Aktiviti / Tajuk</th>
              <th className="border border-gray-300 p-2 text-center">Hadir</th>
              <th className="border border-gray-300 p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const activity = activities.find(a => a.id === r.activityId);
              // Count students assigned to this specific activity
              const assignedStudents = students.filter(s => s.assignments?.[r.categoryId] === r.activityId);
              const totalAssigned = assignedStudents.length || students.length; // Fallback to all if none assigned (legacy)
              
              return (
                <tr key={r.id}>
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">{new Date(r.date).toLocaleDateString('ms-MY')}</td>
                  <td className="border border-gray-300 p-2">{r.teacherName}</td>
                  <td className="border border-gray-300 p-2">
                    <span className="font-bold">{activity?.name}</span><br/>
                    <span className="text-xs italic">{r.topic}</span>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{totalAssigned - r.absenteeIds.length} / {totalAssigned}</td>
                  <td className="border border-gray-300 p-2 text-center text-xs font-bold uppercase">{r.status}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-10 text-center italic text-gray-400">Tiada data pelaporan untuk kriteria ini.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 text-sm text-gray-500 no-print">
          <p className="flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            Nota: Hanya laporan yang telah <strong>Disahkan</strong> oleh S/U Kokurikulum akan dikira sebagai data rasmi sekolah.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecretaryReports;


import React, { useState, useMemo } from 'react';
import { AttendanceRecord, Activity, ActivityCategory, Student, RecordStatus } from '../types';
import { LOGOS } from '../constants';

interface PastReportsProps {
  records: AttendanceRecord[];
  activities: Activity[];
  categories: ActivityCategory[];
  students: Student[];
  updateRecord?: (id: string, data: Partial<AttendanceRecord>) => void;
  onEdit?: (record: AttendanceRecord) => void;
}

const PastReports: React.FC<PastReportsProps> = ({ records, activities, categories, students, updateRecord, onEdit }) => {
  const [filterCategoryId, setFilterCategoryId] = useState<string>('ALL');
  const [filterWeek, setFilterWeek] = useState<string>('ALL');
  const [filterActivityId, setFilterActivityId] = useState<string>('ALL');
  const [filterAdvisor, setFilterAdvisor] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const weeks = useMemo(() => {
    const list = [];
    const startDate = new Date('2026-01-14');
    for (let i = 1; i <= 42; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      list.push({
        num: i,
        startStr: weekStart.toISOString().split('T')[0],
        endStr: weekEnd.toISOString().split('T')[0],
        label: `Minggu ${i} (${weekStart.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })})`
      });
    }
    return list;
  }, []);

  const advisorList = useMemo(() => {
    const advisors = activities.map(a => a.advisorHead).filter(Boolean) as string[];
    return Array.from(new Set(advisors)).sort();
  }, [activities]);

  const filtered = records.filter(r => {
    const matchCategory = filterCategoryId === 'ALL' || r.categoryId === filterCategoryId;
    const matchActivity = filterActivityId === 'ALL' || r.activityId === filterActivityId;
    const matchAdvisor = filterAdvisor === 'ALL' || r.advisorHead === filterAdvisor;
    
    let matchWeek = true;
    if (filterWeek !== 'ALL') {
      const week = weeks.find(w => w.num.toString() === filterWeek);
      if (week) {
        matchWeek = r.date >= week.startStr && r.date <= week.endStr;
      }
    }
    return matchCategory && matchWeek && matchActivity && matchAdvisor;
  });

  const handleDownloadReport = () => {
    if (!selectedRecord) return;
    if (selectedRecord.status !== RecordStatus.VERIFIED) {
      alert("⚠️ AKSES DINAFIKAN: Laporan ini belum disahkan oleh S/U Kokurikulum. Sila hubungi S/U untuk pengesahan sebelum menjana dokumen rasmi.");
      return;
    }
    
    const activity = activities.find(a => a.id === selectedRecord.activityId);
    const activityName = activity?.name || 'Aktiviti';
    const categoryName = categories.find(c => c.id === selectedRecord.categoryId)?.name || 'N/A';
    
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Laporan_${activityName}_${selectedRecord.date}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          @media print { .no-print { display: none; } }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid black !important; padding: 8px; font-size: 12px; }
          body { padding: 40px; font-family: sans-serif; background: white; }
          .section-title { font-weight: bold; text-transform: uppercase; margin-bottom: 10px; font-size: 14px; border-left: 4px solid black; padding-left: 10px; }
          .header-container { display: flex; align-items: center; justify-content: space-between; border-bottom: 4px double black; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-img { height: 80px; width: auto; object-fit: contain; }
          .header-text { text-align: center; flex: 1; }
        </style>
      </head>
      <body onload="window.print()">
        <div class="max-w-4xl mx-auto">
          <div class="header-container">
            <img src="${LOGOS.SCHOOL}" class="logo-img" alt="Logo Sekolah" />
            <div class="header-text">
              <h1 class="text-2xl font-black uppercase leading-tight">Laporan Kehadiran Kokurikulum</h1>
              <h2 class="text-xl font-bold uppercase text-blue-800">SMK Zainab 2, Kota Bharu</h2>
              <p class="text-sm font-bold mt-1">Sesi Akademik 2024/2025</p>
              <p class="text-xs italic font-medium mt-1">Tarikh: ${new Date(selectedRecord.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <img src="${LOGOS.ZASS2}" class="logo-img" alt="Logo Zass 2" />
          </div>

          <div class="grid grid-cols-2 gap-8 mb-8">
            <div class="border border-black p-4 bg-gray-50/50">
              <p class="text-[10px] font-bold uppercase text-gray-500">Unit / Aktiviti:</p>
              <p class="text-lg font-black">${activityName}</p>
              <p class="text-[10px] font-bold uppercase mt-2 text-gray-500">Lokasi / Tempat:</p>
              <p class="font-bold">${selectedRecord.location || '-'}</p>
            </div>
            <div class="border border-black p-4 text-right">
              <p class="text-[10px] font-bold uppercase text-gray-500">Tajuk Perjumpaan:</p>
              <p class="text-lg font-black">${selectedRecord.topic}</p>
              <p class="text-[10px] font-bold uppercase mt-2 text-gray-500">Kategori:</p>
              <p class="font-bold uppercase">${categoryName}</p>
            </div>
          </div>

          <div class="section-title">A. Kehadiran Guru Penasihat</div>
          <table>
            <thead>
              <tr class="bg-gray-100">
                <th class="w-12">No</th>
                <th class="text-left">Nama Guru</th>
                <th class="w-32">Status</th>
                <th class="text-left">Catatan / Sebab</th>
              </tr>
            </thead>
            <tbody>
              ${(selectedRecord.advisorAttendance || []).map((adv, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td class="font-bold">${adv.name}</td>
                  <td class="text-center ${adv.isPresent ? 'text-green-600' : 'text-red-600'} font-black">
                    ${adv.isPresent ? 'HADIR' : 'TIDAK HADIR'}
                  </td>
                  <td>${adv.reason || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section-title">B. Kehadiran Murid (Enrolmen: ${students.length})</div>
          <table>
            <thead>
              <tr class="bg-gray-100">
                <th class="w-12">No</th>
                <th class="text-left">Nama Murid</th>
                <th class="w-32">Kelas</th>
                <th class="w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.map((s, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td class="font-bold">${s.name}</td>
                  <td>${s.class}</td>
                  <td class="text-center font-black ${selectedRecord.absenteeIds.includes(s.id) ? 'text-red-600' : 'text-green-600'}">
                    ${selectedRecord.absenteeIds.includes(s.id) ? 'TIDAK HADIR' : 'HADIR'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="grid grid-cols-2 gap-20 mt-20 text-center">
            <div class="flex flex-col items-center">
              <div class="w-full border-b border-black mb-2 max-w-[200px]"></div>
              <p class="text-[10px] font-bold">DISEDIAKAN OLEH:</p>
              <p class="font-bold mt-1 text-xs">(${selectedRecord.advisorHead || 'Ketua Guru Penasihat'})</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-full border-b border-black mb-2 max-w-[200px]"></div>
              <p class="text-[10px] font-bold">DISAHKAN OLEH:</p>
              <p class="font-bold mt-1 text-xs">(CIK KU FATIMAH BINTI CHE KU YEN)</p>
              <p class="text-[9px] mt-1 italic uppercase">Setiausaha Kokurikulum SMK Zainab 2</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_${activityName}_${selectedRecord.date}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (selectedRecord) {
    const presentCount = students.length - selectedRecord.absenteeIds.length;
    const activity = activities.find(a => a.id === selectedRecord.activityId);
    const isVerified = selectedRecord.status === RecordStatus.VERIFIED;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-800">Butiran Laporan Penuh</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadReport}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${isVerified ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <i className="fas fa-file-download mr-2"></i> Muat Turun Laporan Rasmi
            </button>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b-2 border-gray-800 pb-6 mb-10">
            <img src={LOGOS.SCHOOL} alt="Logo" className="w-20 h-auto" />
            <div className="text-center">
              <h1 className="text-xl font-black uppercase leading-tight">Laporan Aktiviti Kokurikulum</h1>
              <p className="text-sm font-bold text-blue-600 uppercase">SMK Zainab 2, Kota Bharu</p>
            </div>
            <img src={LOGOS.ZASS2} alt="Logo" className="w-20 h-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Butiran Aktiviti</p>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800 uppercase">{activity?.name}</p>
                <p className="text-sm text-indigo-600 font-bold">{selectedRecord.location}</p>
                <p className="text-sm text-gray-600 font-medium">Tajuk: {selectedRecord.topic}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tarikh & Status</p>
              <p className="text-sm font-bold text-gray-800">{new Date(selectedRecord.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-xs font-black text-blue-600 mt-2">KATEGORI: {categories.find(c => c.id === selectedRecord.categoryId)?.name.toUpperCase()}</p>
              <p className="text-xs font-black text-blue-600 mt-1">STATUS: {selectedRecord.status.toUpperCase()}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-black uppercase text-gray-800 mb-4 border-l-4 border-indigo-600 pl-3">Kehadiran Guru Penasihat</h3>
            <table className="w-full text-sm border-collapse border-2 border-black">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-2 border-black p-2 text-center w-12 text-[10px] font-black uppercase">No</th>
                  <th className="border-2 border-black p-2 text-left text-[10px] font-black uppercase">Nama Guru</th>
                  <th className="border-2 border-black p-2 text-center w-32 text-[10px] font-black uppercase">Status</th>
                  <th className="border-2 border-black p-2 text-left text-[10px] font-black uppercase">Sebab</th>
                </tr>
              </thead>
              <tbody>
                {(selectedRecord.advisorAttendance || []).map((adv, i) => (
                  <tr key={i}>
                    <td className="border-2 border-black p-2 text-center text-gray-600">{i + 1}</td>
                    <td className="border-2 border-black p-2 font-bold text-gray-800 text-xs">{adv.name}</td>
                    <td className={`border-2 border-black p-2 text-center font-black text-[10px] ${adv.isPresent ? 'text-green-600' : 'text-red-600'}`}>
                      {adv.isPresent ? 'HADIR' : 'TAK HADIR'}
                    </td>
                    <td className="border-2 border-black p-2 text-gray-600 italic text-[10px]">{adv.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-black uppercase text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Kehadiran Murid (Enrolmen: {students.length})</h3>
            <table className="w-full text-sm border-collapse border-2 border-black">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-2 border-black p-2 text-center w-12 text-[10px] font-black uppercase">No</th>
                  <th className="border-2 border-black p-2 text-left text-[10px] font-black uppercase">Nama Murid</th>
                  <th className="border-2 border-black p-2 text-left w-32 text-[10px] font-black uppercase">Kelas</th>
                  <th className="border-2 border-black p-2 text-center w-32 text-[10px] font-black uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td className="border-2 border-black p-2 text-center text-gray-600">{i + 1}</td>
                    <td className="border-2 border-black p-2 font-bold text-gray-800 text-xs">{s.name}</td>
                    <td className="border-2 border-black p-2 text-gray-600 text-xs">{s.class}</td>
                    <td className={`border-2 border-black p-2 text-center font-black text-[10px] ${selectedRecord.absenteeIds.includes(s.id) ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedRecord.absenteeIds.includes(s.id) ? 'TAK HADIR' : 'HADIR'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-20 mt-20 text-center">
            <div>
              <div className="border-b-2 border-black mb-2 mx-auto max-w-[200px]"></div>
              <p className="text-[10px] font-bold uppercase">Disediakan Oleh:<br/>({selectedRecord.advisorHead || 'Ketua Guru Penasihat'})</p>
            </div>
            <div>
              <div className="border-b-2 border-black mb-2 mx-auto max-w-[200px]"></div>
              <p className="text-[10px] font-bold uppercase">Disahkan Oleh:<br/>(CIK KU FATIMAH BINTI CHE KU YEN)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm no-print">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Kategori Aktiviti</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filterCategoryId}
              onChange={(e) => {
                setFilterCategoryId(e.target.value);
                setFilterActivityId('ALL');
              }}
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nama Aktiviti</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filterActivityId}
              onChange={(e) => setFilterActivityId(e.target.value)}
            >
              <option value="ALL">Semua Aktiviti</option>
              {activities
                .filter(a => filterCategoryId === 'ALL' || a.categoryId === filterCategoryId)
                .map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Ketua Guru Penasihat</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filterAdvisor}
              onChange={(e) => setFilterAdvisor(e.target.value)}
            >
              <option value="ALL">Semua Guru</option>
              {advisorList.map(advisor => <option key={advisor} value={advisor}>{advisor}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Minggu Aktiviti (2026)</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
            >
              <option value="ALL">Semua Minggu</option>
              {weeks.map(w => (
                <option key={w.num} value={w.num}>{w.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filtered.map(record => {
          const activity = activities.find(a => a.id === record.activityId);
          return (
            <div key={record.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group animate-in slide-in-from-bottom-2">
              <div className={`h-1.5 ${
                record.status === RecordStatus.VERIFIED ? 'bg-green-500' :
                record.status === RecordStatus.SUBMITTED ? 'bg-amber-500' :
                'bg-gray-300'
              }`}></div>
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {categories.find(c => c.id === record.categoryId)?.name || 'N/A'}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    record.status === RecordStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                    record.status === RecordStatus.SUBMITTED ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <h3 className="font-black text-gray-800 text-lg mb-1 leading-tight">{record.topic}</h3>
                <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-wide">{activity?.name || 'Aktiviti'}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-user-tie text-gray-300 text-[10px]"></i>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{record.advisorHead || 'Guru N/A'}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-50 mb-6">
                   <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                    <i className="far fa-calendar-alt text-blue-500"></i>
                    {new Date(record.date).toLocaleDateString('ms-MY')}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                    <i className="fas fa-users text-green-500"></i>
                    {students.length - record.absenteeIds.length}/{students.length} Hadir
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setSelectedRecord(record)}
                    className="w-full py-3.5 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black border border-gray-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all uppercase tracking-widest"
                  >
                    Lihat Butiran
                  </button>
                  
                  {record.status === RecordStatus.DRAFT && onEdit && (
                    <button 
                      onClick={() => onEdit(record)}
                      className="w-full py-3 bg-amber-50 text-amber-700 rounded-2xl text-xs font-black border border-amber-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-edit"></i>
                      Sunting Draf
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastReports;

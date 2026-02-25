
import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, ActivityType, Activity, RecordStatus } from '../types';
import { LOGOS } from '../constants';

interface StudentRecordsProps {
  records: AttendanceRecord[];
  students: Student[];
  activities: Activity[];
}

const StudentRecords: React.FC<StudentRecordsProps> = ({ records, students, activities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return [];
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const getAttendanceStats = (studentId: string) => {
    const stats = {
      [ActivityType.CLUB]: 0,
      [ActivityType.UNIFORM]: 0,
      [ActivityType.SPORT]: 0,
    };

    records.filter(r => r.status === RecordStatus.VERIFIED).forEach(record => {
      if (!record.absenteeIds.includes(studentId)) {
        stats[record.activityType] += 1;
      }
    });

    return stats;
  };

  const handlePrintCertificate = (student: Student) => {
    const stats = getAttendanceStats(student.id);
    const target = 12;
    const totalPresent = stats[ActivityType.CLUB] + stats[ActivityType.UNIFORM] + stats[ActivityType.SPORT];
    const totalTarget = target * 3;
    const percentage = ((totalPresent / totalTarget) * 100).toFixed(1);

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Penyata_Kehadiran_${student.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print { .no-print { display: none; } }
          body { padding: 50px; font-family: 'Arial', sans-serif; background: white; }
          .header { border-bottom: 4px double #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; }
          .footer-sig { margin-top: 80px; display: grid; grid-cols: 2; gap: 100px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 12px; text-align: left; }
          .bg-gray { background-color: #f3f4f6; }
        </style>
      </head>
      <body onload="window.print()">
        <div class="max-w-4xl mx-auto">
          <div class="header">
            <img src="${LOGOS.SCHOOL}" style="height: 100px;" />
            <div class="text-center flex-1">
              <h1 class="text-2xl font-black uppercase">SMK Zainab 2, Kota Bharu</h1>
              <h2 class="text-lg font-bold text-blue-800 uppercase">Penyata Kehadiran Kokurikulum Individu</h2>
              <p class="text-sm font-bold">Sesi Akademik 2024/2025</p>
            </div>
            <img src="${LOGOS.ZASS2}" style="height: 100px;" />
          </div>

          <div class="mb-8 bg-gray-50 p-6 border border-black">
            <h3 class="font-black border-b border-black pb-2 mb-4 uppercase">Butiran Murid</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Nama Murid:</strong> ${student.name}</p>
              <p><strong>Kelas:</strong> ${student.class}</p>
              <p><strong>No. Kad Pengenalan:</strong> - </p>
              <p><strong>Tarikh Jana:</strong> ${new Date().toLocaleDateString('ms-MY')}</p>
            </div>
          </div>

          <h3 class="font-black uppercase mb-4">Ringkasan Kehadiran Mengikut Kategori</h3>
          <table>
            <thead>
              <tr class="bg-gray">
                <th class="w-12 text-center">No</th>
                <th>Komponen Kokurikulum</th>
                <th class="text-center w-32">Bil. Hadir</th>
                <th class="text-center w-32">Sasaran</th>
                <th class="text-center w-32">Peratus (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">1</td>
                <td>${ActivityType.CLUB}</td>
                <td class="text-center font-bold">${stats[ActivityType.CLUB]}</td>
                <td class="text-center">${target}</td>
                <td class="text-center">${((stats[ActivityType.CLUB] / target) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td class="text-center">2</td>
                <td>${ActivityType.UNIFORM}</td>
                <td class="text-center font-bold">${stats[ActivityType.UNIFORM]}</td>
                <td class="text-center">${target}</td>
                <td class="text-center">${((stats[ActivityType.UNIFORM] / target) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td class="text-center">3</td>
                <td>${ActivityType.SPORT}</td>
                <td class="text-center font-bold">${stats[ActivityType.SPORT]}</td>
                <td class="text-center">${target}</td>
                <td class="text-center">${((stats[ActivityType.SPORT] / target) * 100).toFixed(1)}%</td>
              </tr>
              <tr class="bg-gray font-black">
                <td colspan="2" class="text-right">JUMLAH KESELURUHAN</td>
                <td class="text-center">${totalPresent}</td>
                <td class="text-center">${totalTarget}</td>
                <td class="text-center">${percentage}%</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-8 text-sm italic">
            <p>* Penyata ini dijana secara automatik melalui Sistem E-Koku SMK Zainab 2.</p>
            <p>* Markah kehadiran ini akan diselaraskan ke dalam sistem PAJSK KPM.</p>
          </div>

          <div class="grid grid-cols-2 gap-20 mt-20 text-center">
            <div>
              <div class="border-b border-black mb-2 mx-auto w-48"></div>
              <p class="text-[10px] font-bold uppercase">Tandatangan & Cop Murid</p>
            </div>
            <div>
              <div class="border-b border-black mb-2 mx-auto w-48"></div>
              <p class="text-[10px] font-bold uppercase">Tandatangan S/U Kokurikulum</p>
              <p class="text-[9px] mt-1">(CIK KU FATIMAH BINTI CHE KU YEN)</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) alert('Sila benarkan pop-up untuk mencetak dokumen.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-search"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Carian Rekod Murid</h2>
            <p className="text-sm text-gray-400 font-medium">Lihat statistik kehadiran individu & jana penyata rasmi.</p>
          </div>
        </div>

        <div className="relative mb-8">
          <i className="fas fa-user-graduate absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Cari nama murid atau kelas (Cth: 5 Al-Farabi)..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedStudent(null);
            }}
          />
        </div>

        {searchQuery && !selectedStudent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
              >
                <div>
                  <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{student.class}</p>
                </div>
                <i className="fas fa-chevron-right text-gray-200 group-hover:text-indigo-500 transition-all"></i>
              </button>
            ))}
            {filteredStudents.length === 0 && (
              <div className="md:col-span-2 py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400 italic">Tiada murid dijumpai untuk carian ini.</p>
              </div>
            )}
          </div>
        )}

        {selectedStudent && (
          <div className="animate-in zoom-in duration-300">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl shadow-indigo-100">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{selectedStudent.name}</h3>
                    <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm">{selectedStudent.class}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handlePrintCertificate(selectedStudent)}
                  className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-print"></i>
                  Cetak Penyata Rasmi
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: ActivityType.CLUB, icon: 'fa-users', color: 'blue' },
                { type: ActivityType.UNIFORM, icon: 'fa-shield-alt', color: 'indigo' },
                { type: ActivityType.SPORT, icon: 'fa-volleyball-ball', color: 'green' },
              ].map(cat => {
                const count = getAttendanceStats(selectedStudent.id)[cat.type];
                const target = 12;
                const percentage = (count / target) * 100;
                
                return (
                  <div key={cat.type} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 bg-${cat.color}-50 text-${cat.color}-600 rounded-2xl flex items-center justify-center text-xl mb-4`}>
                      <i className={`fas ${cat.icon}`}></i>
                    </div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{cat.type}</h4>
                    <div className="flex items-end justify-between mb-4">
                      <span className="text-3xl font-black text-gray-800">{count}</span>
                      <span className="text-sm font-bold text-gray-400">/ {target} Kali</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full bg-${cat.color}-500 transition-all duration-1000`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className={`text-[10px] font-bold ${percentage >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                      {percentage >= 100 ? 'SASARAN DICAPAI' : `${(100 - percentage).toFixed(0)}% LAGI UNTUK SASARAN`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRecords;

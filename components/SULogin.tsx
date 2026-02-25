
import React, { useState } from 'react';

interface SULoginProps {
  password: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SULogin: React.FC<SULoginProps> = ({ password: correctPassword, onSuccess, onCancel }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800">Akses Terhad</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">Modul ini terhad kepada Setiausaha Kokurikulum sahaja. Sila masukkan kata laluan untuk meneruskan.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <i className="fas fa-exclamation-circle"></i>
            Kata laluan salah! Akses dinafikan.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Kata Laluan S/U</label>
            <input 
              type="password" 
              autoFocus
              className={`w-full bg-gray-50 border ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-indigo-500'} rounded-2xl px-5 py-4 text-sm outline-none transition-all text-center tracking-widest font-black`}
              placeholder="••••••••••••"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-sign-in-alt"></i>
              Log Masuk Modul S/U
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full bg-white text-gray-400 py-3 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 transition-all text-sm"
            >
              Kembali ke Menu Guru
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            eTrackCO Zass2 • Hakcipta Terpelihara.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SULogin;
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Aktiviti {
  id: number;
  nama: string;
  lokasi: string;
  ketua_guru: string;
}

export default function BorangKehadiran() {
  // State sedia ada
  const [senaraiAktiviti, setSenaraiAktiviti] = useState<Aktiviti[]>([])
  const [jenisKo, setJenisKo] = useState('') // Tambah state untuk jenis
  const [aktivitiDipilih, setAktivitiDipilih] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [ketuaGuru, setKetuaGuru] = useState('')
  const [tarikh, setTarikh] = useState('')
  const [minggu, setMinggu] = useState('')

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('senarai_aktiviti').select('*')
      if (data) setSenaraiAktiviti(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const dataAktiviti = senaraiAktiviti.find((a) => a.nama === aktivitiDipilih)
    if (dataAktiviti) {
      setLokasi(dataAktiviti.lokasi)
      setKetuaGuru(dataAktiviti.ketua_guru)
    }
  }, [aktivitiDipilih, senaraiAktiviti])

  // Fungsi untuk simpan data ke Supabase 💾
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Mencegah halaman daripada 'refresh'

    const dataKehadiran = {
      jenis_aktiviti: jenisKo,
      nama_aktiviti: aktivitiDipilih,
      lokasi: lokasi,
      ketua_guru: ketuaGuru,
      tarikh: tarikh,
      minggu: minggu,
      // senarai_pelajar: ... (akan ditambah kemudian)
    }

    const { error } = await supabase.from('kehadiran_aktiviti').insert([dataKehadiran])

    if (error) {
      alert("Gagal menyimpan: " + error.message)
    } else {
      alert("Data berjaya disimpan! 🎉")
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Borang Kehadiran Kokurikulum 🏆</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Jenis Ko */}
        <div>
          <label className="block font-medium">Jenis Aktiviti</label>
          <select value={jenisKo} onChange={(e) => setJenisKo(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Pilih Jenis</option>
            <option value="Uniform">Badan Beruniform</option>
            <option value="Kelab">Kelab & Persatuan</option>
            <option value="Sukan">Sukan & Permainan</option>
          </select>
        </div>

        {/* Input Aktiviti */}
        <div>
          <label className="block font-medium">Nama Aktiviti</label>
          <select value={aktivitiDipilih} onChange={(e) => setAktivitiDipilih(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Pilih Aktiviti</option>
            {senaraiAktiviti.map((item) => <option key={item.id} value={item.nama}>{item.nama}</option>)}
          </select>
        </div>

        {/* Input Lokasi & Guru */}
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Lokasi" value={lokasi} readOnly className="p-2 border bg-gray-100 rounded" />
          <input type="text" placeholder="Ketua Guru" value={ketuaGuru} readOnly className="p-2 border bg-gray-100 rounded" />
        </div>

        {/* Input Tarikh & Minggu */}
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={tarikh} onChange={(e) => setTarikh(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="Minggu Ke-" value={minggu} onChange={(e) => setMinggu(e.target.value)} className="p-2 border rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan Kehadiran
        </button>
      </form>
    </div>
  )
}
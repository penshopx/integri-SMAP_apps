export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
      <p className="mb-4">Maaf, halaman yang Anda cari tidak ditemukan.</p>
      <a 
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Kembali ke Beranda
      </a>
    </div>
  )
}
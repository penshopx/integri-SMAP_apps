import Link from 'next/link'

export default function TentangPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tentang IntegriGuide</h1>
      <p className="mb-4">
        IntegriGuide adalah platform generasi dokumen SMAP dan Pancek berbasis AI yang membantu
        organisasi dalam mengelola dokumen kepatuhan dengan lebih efisien.
      </p>
      <Link 
        href="/"
        className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
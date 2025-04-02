'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl font-bold mb-4">Terjadi kesalahan!</h2>
      <p className="mb-4">Error: {error.message}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => reset()}
      >
        Coba lagi
      </button>
    </div>
  )
}
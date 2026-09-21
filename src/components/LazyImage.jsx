import { useState } from 'react'

export default function LazyImage({ src, alt = '', className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !failed ? <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800" aria-hidden="true" /> : null}
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 px-4 text-center text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">Image unavailable</div>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => { setLoaded(true); setFailed(true) }} className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </div>
  )
}

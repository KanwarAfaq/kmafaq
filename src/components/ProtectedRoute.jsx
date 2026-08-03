import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    async function bootstrap() {
      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return
      if (!error) setSession(data.session ?? null)
      setLoading(false)
    }
    bootstrap()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null)
      setLoading(false)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
          <span className="text-sm font-medium">Checking admin access...</span>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location }} />
  return children
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Listen for the password recovery event
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        toast.success("Ready to update your password.")
      }
    })
  }, [])

  async function handleUpdatePassword(e) {
    e.preventDefault()
    try {
      setLoading(true)
      // This updates the password for the currently active session
      const { error } = await supabase.auth.updateUser({ password: password })
      if (error) throw error
      
      toast.success('Password updated successfully!')
      navigate('/admin') // Send them to the dashboard after success
    } catch (error) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mb-8 flex items-start gap-4">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
            <FiLock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Password</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Enter your new secure password below.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" 
              placeholder="Enter new password" 
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiCheck size={16} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
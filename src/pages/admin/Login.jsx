import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiLock, FiLogIn } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dark, toggleDark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/admin'
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Admin login successful')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  async function handleResetPassword() {
    if (!email) {
      toast.error('Please enter your email first')
      return
    }
    try {
      setLoading(true)
      // This sends the reset email. The redirectTo URL is where they go AFTER clicking the email link.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, 
      })
      if (error) throw error
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="absolute inset-0"><div className="absolute left-[-8%] top-[-5%] h-80 w-80 rounded-full bg-accent/10 blur-[120px]" /><div className="absolute right-[-8%] top-[20%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[140px]" /></div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
          <div className="mb-8 flex items-start justify-between gap-4"><div><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg"><FiLock size={24} /></div><h1 className="text-2xl font-bold tracking-tight">Admin Login</h1><p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Sign in to manage projects, social links, and portfolio content.</p></div><button type="button" onClick={toggleDark} className="rounded-2xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300">{dark ? 'Light' : 'Dark'}</button></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" placeholder="admin@example.com" /></div>
            <div><label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" placeholder="Enter your password" /></div>
           <div className="flex justify-end">
  <button 
    type="button" 
    onClick={handleResetPassword}
    disabled={loading}
    className="text-xs font-medium text-accent hover:underline dark:text-accent/80"
  >
    Forgot Password?
  </button>
</div>
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"><FiLogIn size={16} />{loading ? 'Signing in...' : 'Sign in to admin'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

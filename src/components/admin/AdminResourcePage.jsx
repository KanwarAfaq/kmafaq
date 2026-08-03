import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'
import AdminHeader from './AdminHeader'
import AdminEmptyState from './AdminEmptyState'
import GenericResourceModal from './GenericResourceModal'
import { createRow, deleteRow, listRows, tableConfigs, updateRow } from '../../lib/adminApi'

export default function AdminResourcePage({ table, title, subtitle, fields }) {
  const config = tableConfigs[table] || {}
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function loadRows() {
    try {
      setLoading(true)
      const data = await listRows(table, config.orderBy || 'id', config.ascending ?? false)
      setRows(data)
    } catch (error) {
      toast.error(error.message || `Failed to load ${title.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRows()
  }, [table])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q))
  }, [rows, search])

  async function handleSubmit(payload) {
    try {
      setSaving(true)
      if (editing?.id || (table === 'graph_nodes' && editing?.id !== undefined)) {
        const targetId = table === 'graph_nodes' ? editing.id : editing.id
        await updateRow(table, targetId, payload)
        toast.success(`${title.slice(0, -1)} updated`)
      } else {
        await createRow(table, payload)
        toast.success(`${title.slice(0, -1)} created`)
      }
      setModalOpen(false)
      setEditing(null)
      loadRows()
    } catch (error) {
      toast.error(error.message || `Failed to save ${title.toLowerCase()}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return
    try {
      await deleteRow(table, id)
      toast.success('Record deleted')
      loadRows()
    } catch (error) {
      toast.error(error.message || 'Failed to delete record')
    }
  }

  return (
    <AdminLayout>
      <AdminHeader title={title} subtitle={subtitle} />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>
          {!config.readOnlyCreate ? (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              <FiPlus size={16} /> New
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            Loading {title.toLowerCase()}...
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState title={`No ${title.toLowerCase()} found`} text={`No records available in ${table}.`} />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-950">
  <tr>
    {fields.map((field) => (
      <th
        key={field.name}
        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        {field.label || field.name}
      </th>
    ))}
    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
      Actions
    </th>
  </tr>
</thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
  {filtered.map((row) => (
    <tr key={row.id ?? row.slug ?? JSON.stringify(row)}>
      {fields.map((field) => (
        <td
          key={field.name}
          className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
        >
          {Array.isArray(row[field.name])
            ? row[field.name].join(', ')
            : typeof row[field.name] === 'boolean'
            ? row[field.name]
              ? 'Yes'
              : 'No'
            : String(row[field.name] ?? '').slice(0, 100)}
        </td>
      ))}
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(row)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
          >
            <FiEdit2 size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 dark:border-red-500/30"
          >
            <FiTrash2 size={14} /> Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <GenericResourceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={saving}
        title={title}
        table={table}
        fields={fields}
      />
    </AdminLayout>
  )
}

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminShellCard from '../../components/admin/AdminShellCard'
import StatPill from '../../components/admin/StatPill'
import { createGraphEdge, deleteGraphEdge, fetchGraphEdges, fetchGraphNodes, updateGraphEdge } from '../../lib/adminApi'

const emptyForm = { source: '', target: '', relation: '', weight: '', description: '' }

export default function GraphEdgesAdminFinal() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [search, setSearch] = useState('')
  const [relationFilter, setRelationFilter] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    try {
      const [nodeRows, edgeRows] = await Promise.all([fetchGraphNodes(), fetchGraphEdges()])
      setNodes(nodeRows)
      setEdges(edgeRows)
    } catch (error) {
      toast.error(error.message || 'Failed to load graph edges')
    }
  }

  useEffect(() => { loadData() }, [])

  const nodeOptions = useMemo(() => nodes.map((node) => ({ value: String(node.id), label: `${node.label} (${node.type || 'type'})` })), [nodes])
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [String(node.id), node])), [nodes])
  const relationOptions = useMemo(() => ['all', ...new Set(edges.map((edge) => edge.relation).filter(Boolean))], [edges])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return edges.filter((edge) => {
      const source = nodeMap[String(edge.source)]
      const target = nodeMap[String(edge.target)]
      const matchesRelation = relationFilter === 'all' || edge.relation === relationFilter
      const haystack = [edge.relation, edge.description, source?.label, target?.label, source?.type, target?.type].join(' ').toLowerCase()
      const matchesSearch = !q || haystack.includes(q)
      return matchesRelation && matchesSearch
    })
  }, [edges, nodeMap, relationFilter, search])

  function openCreate() { setForm(emptyForm); setOpen(true) }
  function openEdit(edge) { setForm({ ...edge, source: String(edge.source ?? ''), target: String(edge.target ?? ''), weight: edge.weight ?? '' }); setOpen(true) }

  async function submit(e) {
    e.preventDefault()
    if (!form.source || !form.target) return toast.error('Please select both source node and target node')
    if (String(form.source) === String(form.target)) return toast.error('Source node and target node should be different')
    try {
      setSaving(true)
      const payload = {
        source: form.source,
        target: form.target,
        relation: form.relation,
        weight: form.weight === '' ? null : Number(form.weight),
        description: form.description,
      }
      if (form.id) {
        await updateGraphEdge(form.id, payload)
        toast.success('Edge updated')
      } else {
        await createGraphEdge(payload)
        toast.success('Edge created')
      }
      setOpen(false)
      setForm(emptyForm)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save edge')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this edge?')) return
    try {
      await deleteGraphEdge(id)
      toast.success('Edge deleted')
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to delete edge')
    }
  }

  return (
    <AdminLayout>
      <AdminHeader title="Graph Edges" subtitle="Manage relationships between nodes. Source node and target node are selected from the Graph Nodes table." />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Edges" value={edges.length} />
          <StatPill label="Available nodes" value={nodes.length} />
          <StatPill label="Relations" value={relationOptions.length - 1} />
          <StatPill label="Filtered" value={filtered.length} />
        </div>

        <AdminShellCard
          title="Relationship table"
          subtitle="Each edge connects one source node to one target node. Create nodes first, then create edges between them."
          actions={[
            <input key="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search edges" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white" />,
            <select key="relation" value={relationFilter} onChange={(e) => setRelationFilter(e.target.value)} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white">
              {relationOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>,
            <button key="new" type="button" onClick={openCreate} disabled={nodes.length < 2} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white disabled:opacity-50">New edge</button>,
          ]}
        >
          {nodes.length < 2 ? <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">You need at least 2 graph nodes before creating an edge.</p> : null}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th className="px-4 py-3">Source node</th>
                  <th className="px-4 py-3">Relation</th>
                  <th className="px-4 py-3">Target node</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((edge) => {
                  const source = nodeMap[String(edge.source)]
                  const target = nodeMap[String(edge.target)]
                  return (
                    <tr key={edge.id} className="border-b border-gray-100 align-top dark:border-gray-900">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{source?.label || edge.source}</div>
                        <div className="text-xs text-gray-500">{source?.type || 'Unknown type'}</div>
                      </td>
                      <td className="px-4 py-4"><span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{edge.relation || 'related_to'}</span></td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{target?.label || edge.target}</div>
                        <div className="text-xs text-gray-500">{target?.type || 'Unknown type'}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{edge.weight ?? '—'}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{edge.description || '—'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => openEdit(edge)} className="rounded-2xl border border-gray-200 px-3 py-2 dark:border-gray-800">Edit</button>
                          <button type="button" onClick={() => handleDelete(edge.id)} className="rounded-2xl border border-red-200 px-3 py-2 text-red-500 dark:border-red-500/30">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AdminShellCard>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{form.id ? 'Edit edge' : 'Create edge'}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pick source node and target node from the node table, then define the relationship between them.</p>
            </div>
            <form onSubmit={submit} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Source node</label>
                  <select value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" required>
                    <option value="">Select source node</option>
                    {nodeOptions.map((node) => <option key={node.value} value={node.value}>{node.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target node</label>
                  <select value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" required>
                    <option value="">Select target node</option>
                    {nodeOptions.map((node) => <option key={node.value} value={node.value}>{node.label}</option>)}
                  </select>
                </div>
                <input value={form.relation} onChange={(e) => setForm((p) => ({ ...p, relation: e.target.value }))} placeholder="Relation, e.g. uses / authored / related_to" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
                <input value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} placeholder="Weight (optional)" type="number" step="any" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" />
                <textarea rows="4" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description (optional)" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm md:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:text-white" />
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Source node and target node are loaded from the Graph Nodes table. This avoids manual typing mistakes and keeps relationships consistent.
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                <button type="button" onClick={() => setOpen(false)} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">{saving ? 'Saving...' : form.id ? 'Save changes' : 'Create edge'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

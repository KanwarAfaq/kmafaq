import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminShellCard from '../../components/admin/AdminShellCard'
import StatPill from '../../components/admin/StatPill'
import { createGraphNode, deleteGraphNode, fetchGraphEdges, fetchGraphNodes, updateGraphNode } from '../../lib/adminApi'

const emptyForm = { label: '', type: '', description: '' }

// ── Dropdown option preset arrays ──
const nodeTypeOptions = [
  'Project',
  'Publication',
  'Skill',
  'Topic',
  'Person',
  'Institution'
]

const nodeLabelSuggestions = [
  'Natural Language Processing',
  'Air Quality Prediction',
  'Data Collection & Automation',
  'Code-mixed Roman Urdu–English',
  'Sentiment Analysis',
  'Transformers',
  'BERT',
  'RoBERTa',
  'LSTM',
  'CNN',
  'PM2.5 Forecasting',
  'Chang Gung University',
  'PeerJ Computer Science'
]

export default function GraphNodesAdminFinal() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    try {
      const [nodeRows, edgeRows] = await Promise.all([fetchGraphNodes(), fetchGraphEdges()])
      setNodes(nodeRows)
      setEdges(edgeRows)
    } catch (error) {
      toast.error(error.message || 'Failed to load graph nodes')
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return nodes
    return nodes.filter((node) => [node.label, node.type, node.description].join(' ').toLowerCase().includes(q))
  }, [nodes, search])

  const typeCount = new Set(nodes.map((n) => n.type).filter(Boolean)).size

  function openCreate() { setForm(emptyForm); setOpen(true) }
  function openEdit(node) { setForm({ ...node }); setOpen(true) }

  async function submit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      if (form.id) {
        await updateGraphNode(form.id, { label: form.label, type: form.type, description: form.description })
        toast.success('Node updated')
      } else {
        await createGraphNode({ label: form.label, type: form.type, description: form.description })
        toast.success('Node created')
      }
      setOpen(false)
      setForm(emptyForm)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save node')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this node? Make sure no edge still depends on it.')) return
    try {
      await deleteGraphNode(id)
      toast.success('Node deleted')
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to delete node')
    }
  }

  function countConnected(nodeId) {
    return edges.filter((edge) => String(edge.source) === String(nodeId) || String(edge.target) === String(nodeId)).length
  }

  return (
    <AdminLayout>
      <AdminHeader title="Graph Nodes" subtitle="Manage the entities in your graph. Nodes are the things; edges are the relationships between them." />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Nodes" value={nodes.length} />
          <StatPill label="Node types" value={typeCount} />
          <StatPill label="Edges linked" value={edges.length} />
          <StatPill label="Search results" value={filtered.length} />
        </div>

        <AdminShellCard
          title="Node directory"
          subtitle="Examples: Person, Project, Publication, Skill, Topic. Create the nodes first, then connect them in Graph Edges."
          actions={[
            <input key="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search nodes" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white" />,
            <button key="new" type="button" onClick={openCreate} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">New node</button>,
          ]}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Connected edges</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((node) => (
                  <tr key={node.id} className="border-b border-gray-100 align-top dark:border-gray-900">
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{node.label}</td>
                    <td className="px-4 py-4"><span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{node.type || 'Unspecified'}</span></td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{node.description || '—'}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{countConnected(node.id)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => openEdit(node)} className="rounded-2xl border border-gray-200 px-3 py-2 dark:border-gray-800">Edit</button>
                        <button type="button" onClick={() => handleDelete(node.id)} className="rounded-2xl border border-red-200 px-3 py-2 text-red-500 dark:border-red-500/30">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminShellCard>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{form.id ? 'Edit node' : 'Create node'}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">A node is an entity in the graph, not a relationship.</p>
            </div>
            <form onSubmit={submit} className="space-y-5 px-6 py-6">
              
              {/* ── CREATABLE SELECT DROPDOWN FOR LABEL ── */}
              <div className="relative">
                <input 
                  value={form.label} 
                  list="graph-node-label-datalist"
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} 
                  placeholder="Label, e.g. Air Quality Prediction" 
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none focus:border-accent transition-all" 
                  required 
                />
                <datalist id="graph-node-label-datalist">
                  {nodeLabelSuggestions.map((label) => (
                    <option key={label} value={label} />
                  ))}
                </datalist>
              </div>

              {/* ── CREATABLE SELECT DROPDOWN FOR TYPE ── */}
              <div className="relative">
                <input 
                  value={form.type} 
                  list="graph-node-type-datalist"
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} 
                  placeholder="Type, e.g. Project / Skill / Publication" 
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none focus:border-accent transition-all" 
                  required 
                />
                <datalist id="graph-node-type-datalist">
                  {nodeTypeOptions.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </div>

              <textarea rows="4" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none focus:border-accent transition-all" />
              
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                <button type="button" onClick={() => setOpen(false)} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Saving...' : form.id ? 'Save changes' : 'Create node'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}
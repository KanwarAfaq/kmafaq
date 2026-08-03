import AdminResourcePage from '../../components/admin/AdminResourcePage'

export default function PublicationsAdmin() {
 
  return (
    <AdminResourcePage 
      table="publications" 
      title="Publications" 
      subtitle="Manage papers, abstracts, DOI links, and publication metadata." 
      fields={[
        { name: 'title', label: 'Title', required: true, full: true },
        { name: 'authors', label: 'Authors', required: true, full: true },
        // Find the journal row inside fields array and change it to:
{ 
  name: 'journal', 
  label: 'Journal', 
  required: true, 
  type: 'creatable-select',
  options: [
    'PeerJ Computer Science',
    'IEEE Access',
    'ACM Transactions on Asian and Low-Resource Language Information Processing',
    'Artificial Intelligence Review',
    'Knowledge-Based Systems',
    'Pattern Recognition Letters'
  ]
},
        // ── SEARCHABLE & CREATABLE PUBLISHER DROPDOWN ──
        { 
          name: 'publisher', 
          label: 'Publisher', 
          required: true, 
          type: 'creatable-select',
          options: [
            'PeerJ',
            'IEEE',
            'ACM',
            'Elsevier',
            'Springer',
            'MDPI',
            'Wiley'
          ]
        },
        // ── UPDATED TO FULL CALENDAR DATE PICKER ──
        { 
          name: 'year', 
          label: 'Publication Date', 
          required: true, 
          inputType: 'date' 
        },
      
        {name:'status', label:'Status', type:'creatable-select', options:['Published', 'In Review', 'Submitted', 'Under Review', 'Preprint'], required:true},
        
        // ── UPDATED DROPDOWN FIELD CONFIGURATION ──
        { 
          name: 'type', 
          label: 'Type', 
          required: true, 
          type: 'creatable-select', 
          options: ['Conference', 'Journal', 'Book', 'Preprint'] 
        },
        
        { name: 'abstract', label: 'Abstract', type: 'textarea', required: true, full: true, rows: 8 },
        { name: 'doi', label: 'DOI', full: true },
        { name: 'pdf', label: 'PDF URL', inputType: 'url', full: true },
        { name: 'scholar', label: 'Scholar URL', inputType: 'url', full: true },
        { name: 'citations', label: 'Citations', type: 'number', inputType: 'number', required: true },
        { name: 'tags', label: 'Tags', type: 'array', full: true },
      ]} 
    />
  )
}
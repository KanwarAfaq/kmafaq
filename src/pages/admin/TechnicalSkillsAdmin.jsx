import AdminResourcePage from '../../components/admin/AdminResourcePage'

export default function TechnicalSkillsAdmin() {
  return (
    <AdminResourcePage 
      table="technical_skills" 
      title="Technical Skills" 
      subtitle="Manage grouped technical skills and display ordering." 
      fields={[
        // ── SEARCHABLE & CREATABLE CATEGORY DROPDOWN ──
        { 
          name: 'category', 
          label: 'Category', 
          required: true,
          type: 'creatable-select',
          options: [
            'Natural Language Processing',
            'Air Quality Prediction',
            'Data Collection & Automation',
            'Programming Languages',
            'Frameworks & Developer Tools'
          ]
        },
        
        { name: 'skill_name', label: 'Skill Name', required: true,type:'creatable-select', options: ['Python', 'Selenium', 'BeautifulSoup', 'APIs', 'Data Pipelines', 'Web Scraping'] },
        { name: 'display_order', label: 'Display Order', type: 'number', inputType: 'number' },
      ]} 
    />
  )
}
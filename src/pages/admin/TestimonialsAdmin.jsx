import AdminResourcePage from '../../components/admin/AdminResourcePage'
export default function TestimonialsAdmin() {
  return <AdminResourcePage table="testimonials" title="Testimonials" subtitle="Manage recommendations, roles, institutions, and photos." fields={[
    { name: 'name', label: 'Name', required: true },
    { name: 'role', label: 'Role', required: true,type:'creatable-select', options:['Professor', 'Colleague', 'Supervisor', 'Client', 'Mentor'] },
    { name: 'institution', label: 'Institution', required: true, full: true,type:'creatable-select', options:['University of California, Berkeley', 'Stanford University', 'Massachusetts Institute of Technology', 'Google', 'Microsoft', 'Amazon', 'Facebook', 'IBM'] },
    { name: 'text_content', label: 'Text Content', type: 'textarea', required: true, full: true, rows: 6 },
    { name: 'image', label: 'Image', type: 'file', full: true },
    { name: 'avatar', label: 'Avatar', type: 'file', full: true },
  ]} />
}

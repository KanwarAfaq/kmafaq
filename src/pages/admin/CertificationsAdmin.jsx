import AdminResourcePage from '../../components/admin/AdminResourcePage'

export default function CertificationsAdmin() {
  return (
    <AdminResourcePage
      table="certifications"
      title="Certifications"
      subtitle="Manage certificates, issuers, verification links, and PDF files."
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          full: true,
          placeholder: 'Example: Automated Scraping and Data Pipelines',
        },
        {
          name: 'issuer',
          label: 'Issuer',
          required: true,
          placeholder: 'Example: Developer Certification Suite',
        },
        {
          name: 'date',
          label: 'Date',
          required: true,
          inputType: 'date',
        },
        {
          name: 'category',
          label: 'Category',
          required: true,
          type: 'creatable-select',
          options: ['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'AI & Machine Learning', 'DevOps'],
          
        },
        {
          name: 'credential_id',
          label: 'Credential ID',
          required: false,
          placeholder: 'Example: DCS-2025-001',
        },
        {
          name: 'verify_url',
          label: 'Verify URL',
          inputType: 'url',
         
          full: true,
          placeholder: 'Example: https://issuer-site.com/verify/abc123',
        },
        {
          name: 'pdf_url',
          label: 'Certificate PDF',
          type: 'file',
          required: true,
          accept: 'application/pdf',
          folder: 'certifications/pdfs',
          full: true,
        },
        {
          name: 'color',
          label: 'Color',
          type: 'select',
          required: true,
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
            { label: 'Teal', value: 'teal' },
          ],
        },
        {
          name: 'skills',
          label: 'Skills',
  
          type: 'creatable-select',
          options: ['Python', 'Selenium', 'BeautifulSoup', 'APIs', 'Data Pipelines', 'Web Scraping'],
          placeholder: 'Example: Python, Selenium, BeautifulSoup, APIs',
        },
      ]}
    />
  )
}
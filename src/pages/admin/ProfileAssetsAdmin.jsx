import AdminResourcePage from '../../components/admin/AdminResourcePage'
export default function ProfileAssetsAdmin() {
  return <AdminResourcePage table="profile_assets" title="Profile Assets" subtitle="Manage reusable website assets like avatars and hero images." fields={[
    { name: 'asset_name', label: 'Asset Name', required: true },
    { name: 'file_url', label: 'File URL', type: 'file', required: true, full: true },
  ]} />
}

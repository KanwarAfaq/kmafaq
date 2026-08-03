export default function AdminEmptyState({ title, text, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">{text}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

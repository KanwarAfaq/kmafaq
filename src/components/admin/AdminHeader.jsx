export default function AdminHeader({ title, subtitle, action }) {
  return (
    <div className="border-b border-gray-200 bg-white/70 px-5 py-5 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/70 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Admin module</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  )
}

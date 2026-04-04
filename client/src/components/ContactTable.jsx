export function ContactTable({ records = [] }) {
  return (
    <div className="table-scroll overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Contact Name</th>
            <th className="px-4 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="glass-panel rounded-2xl">
              <td className="rounded-l-2xl border-y border-l border-slate-800/80 px-4 py-4 text-sm text-white">
                {record.phoneNumber || record.source}
              </td>
              <td className="border-y border-slate-800/80 px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    record.status === "valid"
                      ? "bg-brand-500/15 text-brand-200"
                      : "bg-rose-500/15 text-rose-200"
                  }`}
                >
                  {record.status}
                </span>
              </td>
              <td className="border-y border-slate-800/80 px-4 py-4 text-sm text-slate-300">
                {record.contactName ?? "Not generated"}
              </td>
              <td className="rounded-r-2xl border-y border-r border-slate-800/80 px-4 py-4 text-sm text-slate-400">
                {record.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


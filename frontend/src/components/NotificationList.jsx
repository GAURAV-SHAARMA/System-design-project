import { shortDate } from '../utils/formatters';

export default function NotificationList({ notifications }) {
  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <div key={item.id} className="card-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.message}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{shortDate(item.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

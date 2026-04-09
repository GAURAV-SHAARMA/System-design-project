import Sidebar from '../components/Sidebar';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_1fr]">
        <Sidebar />
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}

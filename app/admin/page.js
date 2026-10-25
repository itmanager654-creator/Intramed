import { isAdmin } from '@/lib/auth';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | IntraMed Solution', robots: { index: false, follow: false } };

export default async function AdminPage() {
  return (await isAdmin()) ? <AdminPanel /> : <AdminLogin />;
}

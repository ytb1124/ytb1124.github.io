import type { Metadata } from 'next';
import { AdminClient } from './admin-client';
import './admin.css';

export const metadata: Metadata = {
  title: 'Portfolio Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminClient />;
}

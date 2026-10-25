import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap section text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">This page does not exist. Browse our device catalogs instead.</p>
      <Link href="/" className="btn btn-primary mt-6">Go to home</Link>
    </div>
  );
}

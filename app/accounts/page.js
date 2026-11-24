import AccountsApp from '@/components/accounts/AccountsApp';

// Private accounts app. Not indexed. Installable from the browser (Add to Home Screen / Install app).
export const metadata = {
  title: 'IntraMed Accounts',
  robots: { index: false, follow: false },
  manifest: '/accounts/manifest.json',
  appleWebApp: { capable: true, title: 'IntraMed Accounts', statusBarStyle: 'default' },
};

export default function AccountsPage() {
  return <AccountsApp />;
}

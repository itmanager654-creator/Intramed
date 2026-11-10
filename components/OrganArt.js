import { ORGANS } from '@/components/organSvgs';

export default function OrganArt({ type, className = '' }) {
  const svg = ORGANS[type] || ORGANS[Object.keys(ORGANS)[0]];
  if (!svg) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

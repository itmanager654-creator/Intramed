// A template re-mounts on every navigation, so this gives a smooth fade/slide when moving between pages.
export default function Template({ children }) {
  return <div className="page-in">{children}</div>;
}

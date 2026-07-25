import { DocsShell } from '@/components/DocsShell'

// Static export writes this to 404.html. On GitHub Pages any deep link that has
// no prebuilt file is served 404.html, which boots the same client shell and
// resolves the requested path from the version JSON.
export default function NotFound() {
  return <DocsShell />
}

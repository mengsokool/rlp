import { unstable_noStore as noStore } from 'next/cache'

const REPO = 'mengsokool/app.beenut'
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`

interface GitHubAsset {
  name: string
  browser_download_url: string
  size: number
  content_type: string
}

interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
  html_url: string
  assets: GitHubAsset[]
}

// Categorise an asset filename into a platform group
function getPlatform(name: string): 'macos' | 'linux' | 'other' {
  const lower = name.toLowerCase()
  if (
    lower.includes('macos') ||
    lower.includes('darwin') ||
    lower.endsWith('.dmg') ||
    lower.endsWith('.app.zip')
  )
    return 'macos'
  if (
    lower.endsWith('.deb') ||
    lower.includes('linux') ||
    lower.includes('amd64') ||
    lower.includes('arm64') ||
    lower.endsWith('.sh')
  )
    return 'linux'
  return 'other'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Icon SVGs (inline to avoid dependency)
const MacOsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.117.779.567 1.563 1.244 2.03l-.242.12c-.406.205-.646.596-.646 1.029 0 .42.225.799.591 1.004l.244.131v.002c-.024.117-.077.293-.165.476-.126.26-.315.561-.491.789-.186.237-.359.443-.427.617-.07.18-.044.35.051.508.079.127.218.239.384.309.167.07.359.095.55.063l.003.001c.175-.028.309-.117.38-.259.072-.144.075-.345-.015-.549-.05-.116-.139-.238-.226-.351l-.006-.009c.133-.02.269-.052.401-.093.206-.063.402-.152.573-.267l.023-.015c.043.027.087.053.132.078.205.116.42.214.641.29.33.114.674.172 1.023.172.348 0 .693-.058 1.022-.171.221-.077.437-.175.642-.291.044-.025.088-.051.131-.077l.024.016c.172.115.367.203.573.266.132.041.268.073.401.093l-.006.009c-.087.113-.176.235-.226.351-.09.204-.087.405-.015.549.071.142.205.231.38.259l.003-.001c.191.032.383.007.55-.063.166-.07.305-.182.384-.309.095-.158.121-.328.051-.508-.068-.174-.241-.38-.427-.617-.177-.228-.365-.528-.491-.789-.088-.183-.141-.359-.165-.476v-.002l.244-.131c.366-.205.591-.584.591-1.004 0-.433-.24-.824-.646-1.029l-.242-.12c.677-.467 1.127-1.251 1.244-2.03.124-.805-.009-1.657-.287-2.489-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.063-1.491 1.057-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm0 .643c.118 0 .238.006.358.016 2.905.228 2.208 3.593 2.192 5.558-.027 3.054-1.555 4.624-1.555 4.624s1.528-1.57 1.555-4.624c.009-1.124-.153-2.487-.396-3.484-.17-.697-.38-1.183-.486-1.267-.066-.052-.134-.079-.204-.079s-.138.027-.204.079c-.106.084-.316.57-.486 1.267-.243.997-.405 2.36-.396 3.484.027 3.054 1.555 4.624 1.555 4.624s-1.528-1.57-1.555-4.624c-.016-1.965-.713-5.33 2.192-5.558.12-.01.24-.016.358-.016h.012zM8.662 17.46c-.082.04-.163.087-.24.141l-.015.009.015-.009c.077-.054.158-.101.24-.141zm6.676 0c.082.04.163.087.24.141l.015.009-.015-.009a2.073 2.073 0 00-.24-.141z" />
  </svg>
)

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ExternalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 }, // cache 1 hr, no rebuild needed
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    return res.json() as Promise<GitHubRelease>
  } catch {
    return null
  }
}

// Single asset download button
function AssetButton({ asset }: { asset: GitHubAsset }) {
  return (
    <a
      href={asset.browser_download_url}
      className="group flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground no-underline transition-colors duration-150 hover:border-primary hover:bg-muted"
      download
    >
      <DownloadIcon />
      <span className="min-w-0 truncate font-mono text-[11px] font-normal">{asset.name}</span>
      <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
        {formatBytes(asset.size)}
      </span>
    </a>
  )
}

export async function LatestRelease() {
  noStore() // prevent static baking — always fetch at request time on first render
  const release = await fetchLatestRelease()

  if (!release) {
    return (
      <div className="not-prose my-4 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
        ⚠️ Could not load latest release. Check{' '}
        <a
          href={`https://github.com/${REPO}/releases`}
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Releases
        </a>{' '}
        directly.
      </div>
    )
  }

  const macAssets = release.assets.filter((a) => getPlatform(a.name) === 'macos')
  const linuxAssets = release.assets.filter((a) => getPlatform(a.name) === 'linux')
  const otherAssets = release.assets.filter((a) => getPlatform(a.name) === 'other')

  return (
    <div className="not-prose my-5 flex flex-col gap-4">
      {/* Version badge row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {release.tag_name}
        </span>
        <span className="text-xs text-muted-foreground">
          Released {formatDate(release.published_at)}
        </span>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground no-underline hover:text-foreground"
        >
          View on GitHub <ExternalIcon />
        </a>
      </div>

      {/* macOS */}
      {macAssets.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MacOsIcon /> macOS
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {macAssets.map((asset) => (
              <AssetButton key={asset.name} asset={asset} />
            ))}
          </div>
        </div>
      )}

      {/* Linux */}
      {linuxAssets.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <LinuxIcon /> Linux
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {linuxAssets.map((asset) => (
              <AssetButton key={asset.name} asset={asset} />
            ))}
          </div>
        </div>
      )}

      {/* Other (source code, checksums, etc.) */}
      {otherAssets.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-foreground">Other</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {otherAssets.map((asset) => (
              <AssetButton key={asset.name} asset={asset} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

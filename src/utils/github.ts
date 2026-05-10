export interface GithubAsset {
  id: number;
  name: string;
  browser_download_url: string;
}

export interface GithubRelease {
  tag_name: string;
  assets: GithubAsset[];
}

export async function getLatestRelease(owner: string, repo: string): Promise<GithubRelease> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "xx-cli",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.statusText}`);
  }
  return await response.json() as GithubRelease;
}

export async function downloadAsset(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download asset: ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

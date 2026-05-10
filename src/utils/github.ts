// Simplified GitHub utils for update
export async function getLatestRelease(owner: string, repo: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.statusText}`);
  }
  return await response.json();
}

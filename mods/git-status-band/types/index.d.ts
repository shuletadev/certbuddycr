export type GitSummary = {
  kind: 'none' | 'synced' | 'dirty' | 'ahead' | 'behind' | 'diverged' | 'no-upstream'
  branch: string
  changed: number
  ahead: number
  behind: number
}

declare module 'claude-code' {
  interface PluginState {
    'git-status-band': { summary: GitSummary | null; isHidden: boolean }
  }
}

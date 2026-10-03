export type Member = {
  id: string
  kind: string
  label: string
  status: 'idle' | 'working' | 'done' | 'failed'
  action: string
  endedAt: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'party-pane': { members: Member[] }
  }
}

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Member } from '../types'
import { NAMES, characterFor, portrait } from './art.js'

const PANE = 'party'
const KEEP_DONE_MS = 30000
const MAX_MEMBERS = 8

const MAIN: Member = {
  id: 'main',
  kind: 'main',
  label: 'Main conversation',
  status: 'idle',
  action: 'Waiting for you',
  endedAt: null,
}

const members = atom({ plugin: 'party-pane', key: 'members' } as const, [MAIN])

// Descriptions of subagents about to start, oldest first, matched to the
// SubagentStart that follows by agent type.
let pending: { type: string; description: string }[] = []

// Changes one member, adding it first if it is new.
async function patch($: EngineInterface, id: string, change: Partial<Member>, fallback?: Member) {
  await update($, members, list => {
    const has = list.some(m => m.id === id)
    const base = has ? list : fallback ? [...list, fallback] : list
    return base.map(m => (m.id === id ? { ...m, ...change } : m)).slice(-MAX_MEMBERS)
  })
}

// Drops finished agents once they have been on show for a while.
async function prune($: EngineInterface) {
  const now = await $.clock.now()
  const list = await read($, members)
  const kept = list.filter(m => m.endedAt === null || now - m.endedAt < KEEP_DONE_MS)
  if (kept.length !== list.length) await update($, members, () => kept)
}

// One short phrase for what a tool call is doing.
function describeCall(call: Record<string, unknown>): string {
  const text = (key: string) => (typeof call[key] === 'string' ? (call[key] as string) : '')
  const base = (path: string) => path.split(/[\\/]/).pop() ?? path
  const clip = (s: string) => (s.length > 48 ? s.slice(0, 47) + '…' : s)
  switch (call.tool) {
    case 'Bash':
      return clip('Running ' + text('command').split('\n')[0])
    case 'Read':
      return 'Reading ' + base(text('file_path'))
    case 'Edit':
    case 'Write':
      return 'Writing ' + base(text('file_path'))
    case 'Grep':
      return clip('Searching for ' + text('pattern'))
    case 'Glob':
      return clip('Finding ' + text('pattern'))
    case 'Agent':
      return 'Calling in help'
    default:
      return String(call.tool ?? 'Working')
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'party', description: 'Open the party pane' })
    void $.ui.open({ id: PANE, title: 'Party' })
    $.clock.every(5000, () => prune($))
    return next(e)
  })

  on('command.run', { command: 'party' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Party' })
    return { text: 'Party pane opened.' }
  })

  on('prompt.submit', async ($, e, next) => {
    await patch($, 'main', { status: 'working', action: 'Thinking', endedAt: null })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    // A subagent's own turn also ends here; the SubagentStop hook handles those.
    if (!(e as { agentId?: string }).agentId) {
      await patch($, 'main', { status: 'idle', action: 'Waiting for you' })
    }
    return next(e)
  })

  on('agent.spawn', async ($, e, next) => {
    pending = [...pending, { type: e.subagentType, description: e.description }]
    return next(e)
  })

  on('classic.SubagentStart', async ($, e, next) => {
    const at = pending.findIndex(p => p.type === e.agent_type)
    const label = at >= 0 ? pending[at].description : e.agent_type
    if (at >= 0) pending = pending.filter((_, i) => i !== at)
    await patch(
      $,
      e.agent_id,
      { status: 'working', action: 'Getting started', endedAt: null },
      { id: e.agent_id, kind: e.agent_type, label, status: 'working', action: '', endedAt: null },
    )
    return next(e)
  })

  on('classic.SubagentStop', async ($, e, next) => {
    await patch($, e.agent_id, { status: 'done', action: 'Finished', endedAt: await $.clock.now() })
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const agentId = (e as { agentId?: string }).agentId
    const id = agentId ?? 'main'
    await patch($, id, { status: 'working', action: describeCall(e as Record<string, unknown>) })
    const result = await next(e)
    return result
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Svg } = $.ui.resolve(e)
    const list = await read($, members)
    const busy = list.filter(m => m.status === 'working').length

    const claudeIsBusy = list.some(m => m.id === 'main' && m.status === 'working')
    // You sit at the top; the ring shows whose turn it is.
    const you: Member = {
      id: 'you',
      kind: 'you',
      label: 'The boss',
      status: claudeIsBusy ? 'idle' : 'working',
      action: claudeIsBusy ? 'Waiting on Claude' : 'Your move',
      endedAt: null,
    }
    const ordered = [
      you,
      ...[...list].sort((a, b) => {
        if (a.id === 'main') return -1
        if (b.id === 'main') return 1
        return a.status === 'working' ? -1 : b.status === 'working' ? 1 : 0
      }),
    ]

    return (
      <Box flexDirection="column" rowGap={1}>
        <Box flexDirection="row" columnGap={2}>
          <Text bold>Party</Text>
          <Text dimColor>{busy === 0 ? 'all quiet' : busy + ' at work'}</Text>
          <Button
            key="clear"
            label="Clear finished"
            onPress={() => update($, members, l => l.filter(m => m.endedAt === null))}
          />
        </Box>
        {ordered.map(m => {
          const kind = m.kind === 'you' ? 'you' : m.kind === 'main' ? 'sage' : characterFor(m.kind)
          const name = m.kind === 'main' ? 'Claude' : NAMES[kind]
          return (
            <Box key={m.id} flexDirection="row" columnGap={1}>
              {Svg ? (
                <Svg
                  alt={name + ' is ' + m.status}
                  width={72}
                  height={76}
                  isInteractive={true}
                  source={portrait(kind, m.status)}
                />
              ) : (
                <Text>{m.status === 'working' ? '●' : m.status === 'done' ? '✓' : '○'}</Text>
              )}
              <Box flexDirection="column">
                <Text bold>{name}</Text>
                <Text dimColor wrap="truncate">{m.label}</Text>
                <Text color={m.status === 'working' ? 'success' : undefined} dimColor={m.status !== 'working'} wrap="truncate">
                  {m.action}
                </Text>
              </Box>
            </Box>
          )
        })}
      </Box>
    )
  })
}

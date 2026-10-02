import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { GitSummary } from '../types'

const summary = atom({ plugin: 'git-status-band', key: 'summary' } as const, null)
const isHidden = atom({ plugin: 'git-status-band', key: 'isHidden' } as const, false)

const REFRESH_MS = 15000

// Turns `git status --porcelain=v1 -b` output into a small summary.
// First line looks like: "## main...origin/main [ahead 1, behind 2]"
function parse(stdout: string): GitSummary {
  const lines = stdout.split('\n').filter(line => line.length > 0)
  const head = lines[0] ?? ''
  const changed = lines.length - 1

  const branch = head.replace(/^## /, '').split('...')[0].replace(/^No commits yet on /, '')
  const hasUpstream = head.includes('...')
  const ahead = Number(/ahead (\d+)/.exec(head)?.[1] ?? 0)
  const behind = Number(/behind (\d+)/.exec(head)?.[1] ?? 0)

  let kind: GitSummary['kind'] = 'synced'
  if (changed > 0) kind = 'dirty'
  else if (ahead > 0 && behind > 0) kind = 'diverged'
  else if (ahead > 0) kind = 'ahead'
  else if (behind > 0) kind = 'behind'
  else if (!hasUpstream) kind = 'no-upstream'

  return { kind, branch, changed, ahead, behind }
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

// The sentence the user sees: plain language, no git jargon.
function describe(s: GitSummary): { icon: string; color: string; text: string } {
  switch (s.kind) {
    case 'dirty':
      return {
        icon: '●',
        color: 'warning',
        text: `${plural(s.changed, 'file has', 'files have')} changes that are not saved yet. Say /save when you are done.`,
      }
    case 'ahead':
      return {
        icon: '↑',
        color: 'warning',
        text: `Saved on this computer, but ${plural(s.ahead, 'update is', 'updates are')} not on GitHub yet. /save sends them.`,
      }
    case 'behind':
      return {
        icon: '↓',
        color: 'warning',
        text: `GitHub has ${plural(s.behind, 'newer update', 'newer updates')} from the other account. Say /start to get them.`,
      }
    case 'diverged':
      return {
        icon: '⇅',
        color: 'error',
        text: 'This computer and GitHub both have new work. Ask Claude to sort it out before continuing.',
      }
    case 'no-upstream':
      return { icon: '○', color: 'warning', text: 'This work is not connected to GitHub yet.' }
    default:
      return { icon: '✓', color: 'success', text: 'Everything is saved and matches GitHub.' }
  }
}

let lastKey = ''
let isRunning = false

async function refresh($: EngineInterface) {
  if (isRunning) return
  isRunning = true
  try {
    const { exitCode, stdout } = await $.process.run(['git', 'status', '--porcelain=v1', '-b'], {
      timeoutMs: 10000,
    })
    const next = exitCode === 0 ? parse(stdout) : null
    const key = JSON.stringify(next)
    if (key !== lastKey) {
      lastKey = key
      await update($, summary, () => next)
    }
  } catch {
    // git missing or not a repo: show nothing
    if (lastKey !== 'null') {
      lastKey = 'null'
      await update($, summary, () => null)
    }
  } finally {
    isRunning = false
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    void refresh($)
    $.clock.every(REFRESH_MS, () => refresh($))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    void refresh($)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await read($, summary)
    if (e.props.hasSurvey || s === null || (await read($, isHidden))) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const { icon, color, text } = describe(s)

    return (
      <Box flexDirection="row" columnGap={1}>
        <Text color={color}>{icon}</Text>
        <Text dimColor>{text}</Text>
        <Button key="refresh" label="Refresh" onPress={() => refresh($)} />
        <Button key="hide" label="Hide" onPress={() => update($, isHidden, () => true)} />
      </Box>
    )
  })
}

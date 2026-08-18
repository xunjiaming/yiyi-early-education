import { generateKeyPairSync } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const base = process.argv[2]
if (!base) {
  console.error('usage: node generate-ssh-key.mjs <keyBase>')
  process.exit(1)
}

mkdirSync(dirname(base), { recursive: true })
const { privateKey, publicKey } = generateKeyPairSync('ed25519')
writeFileSync(base, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 })

const der = publicKey.export({ type: 'spki', format: 'der' })
const raw = der.subarray(der.length - 32)
const sshPrefix = Buffer.from('ssh-ed25519')
const wire = Buffer.concat([
  Buffer.from([0, 0, 0, sshPrefix.length]),
  sshPrefix,
  Buffer.from([0, 0, 0, raw.length]),
  raw
])

writeFileSync(base + '.pub', `ssh-ed25519 ${wire.toString('base64')} codex-deploy\n`)

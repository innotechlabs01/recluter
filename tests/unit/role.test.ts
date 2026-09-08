import test from 'node:test'
import assert from 'node:assert/strict'
import {
  resolveRole,
  roleDashboardPath,
  type RoleUser,
} from '../../src/lib/role.ts'

// Mock Clerk-style user objects — the role lives in unsafeMetadata, not the JWT.
function user(unsafeMetadata?: RoleUser['unsafeMetadata']): RoleUser {
  return { unsafeMetadata }
}

test('resolveRole returns company for a company user', () => {
  assert.equal(resolveRole(user({ role: 'company' })), 'company')
})

test('resolveRole returns candidate for a candidate user', () => {
  assert.equal(resolveRole(user({ role: 'candidate' })), 'candidate')
})

test('resolveRole returns admin for an admin user', () => {
  assert.equal(resolveRole(user({ role: 'admin' })), 'admin')
})

test('resolveRole returns recruiter for a recruiter user', () => {
  assert.equal(resolveRole(user({ role: 'recruiter' })), 'recruiter')
})

test('resolveRole returns null when no user is passed', () => {
  assert.equal(resolveRole(null), null)
  assert.equal(resolveRole(undefined), null)
})

test('resolveRole returns null when unsafeMetadata is absent', () => {
  assert.equal(resolveRole(user(undefined)), null)
  assert.equal(resolveRole({}), null)
})

test('resolveRole returns null for an unknown role (has role truthiness guard)', () => {
  // A truthy role-value check alone would leak unknown roles; we must whitelist.
  assert.equal(resolveRole(user({ role: 'superuser' })), null)
  assert.equal(resolveRole(user({ role: 'staff' })), null)
})

test('resolveRole returns null for a non-string role value', () => {
  assert.equal(resolveRole(user({ role: 42 })), null)
  assert.equal(resolveRole(user({ role: undefined })), null)
})

test('roleDashboardPath maps each role to its portal', () => {
  assert.equal(roleDashboardPath('company'), '/empresa/dashboard')
  assert.equal(roleDashboardPath('candidate'), '/candidato/dashboard')
  assert.equal(roleDashboardPath('admin'), '/admin/dashboard')
  assert.equal(roleDashboardPath('recruiter'), '/reclutador/dashboard')
  assert.equal(roleDashboardPath(null), '/role-selection')
})

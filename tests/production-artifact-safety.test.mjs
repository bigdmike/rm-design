import assert from 'node:assert/strict'
import test from 'node:test'
import { containsLocalOrigin } from './production-artifact-safety.mjs'

test('production artifact guard blocks actual local origins', () => {
  for (const value of [
    'http://localhost:8080/path',
    'https://rm.localhost/',
    '//rm-api.localhost:8081/api',
    'http://127.0.0.1:5173/',
    'https://127.12.34.56/path',
    'http://[::1]:8080/',
  ]) assert.equal(containsLocalOrigin(value), true, value)
})

test('production artifact guard ignores dependency identifiers and public origins', () => {
  for (const value of [
    'LOCALHOST',
    'localhost',
    'const token = `localhost`',
    'https://rm.example.com/',
    'https://rm-api.example.com/api/v1',
  ]) assert.equal(containsLocalOrigin(value), false, value)
})

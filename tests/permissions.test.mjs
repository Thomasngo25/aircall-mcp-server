import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AircallMCPServer } from '../dist/server.js';

const credentials = { apiId: 'offline-test', apiToken: 'offline-test' };
test('default exposes only analytics tools', () => {
  const server = new AircallMCPServer(credentials);
  assert.deepEqual(server.getToolNames().sort(), [
    'aircall_list_calls', 'aircall_get_call', 'aircall_search_calls',
    'aircall_list_users', 'aircall_list_tags'
  ].sort());
});
test('explicit write tool cannot bypass read-only default', () => {
  const server = new AircallMCPServer({...credentials, tools: 'aircall_delete_contact'});
  assert.equal(server.getToolCount(), 0);
});
test('all tools selection excludes known write operations in read-only mode', () => {
  const server = new AircallMCPServer({...credentials, tools: 'all', readOnly: true});
  for (const name of ['aircall_send_message','aircall_start_call','aircall_delete_contact','aircall_add_tags']) {
    assert.ok(!server.getToolNames().includes(name));
  }
});

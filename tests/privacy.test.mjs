import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCallsTools } from '../dist/tools/calls.js';

test('call detail exposes only approved analytics fields', async () => {
  const call = { id: 1, direction: 'outbound', status: 'done', duration: 30,
    started_at: 100, answered_at: 110, ended_at: 140,
    user: { id: 2, name: 'Synthetic Name', email: 'test@example.invalid' },
    tags: [{ id: 3, name: 'Synthetic private tag' }],
    raw_digits: 'private-number', recording: 'private-recording',
    contact: { first_name: 'Private' }, comments: [{ content: 'Private comment' }] };
  const tools = createCallsTools({ get: async () => ({ call }) });
  const result = await tools.aircall_get_call.execute({ call_id: 1 });
  assert.deepEqual(Object.keys(result).sort(), [
    'id','direction','status','duration','started_at','answered_at','ended_at','user_id','tag_ids'
  ].sort());
  assert.equal(result.user_id, 2);
  assert.deepEqual(result.tag_ids, [3]);
});

import { createUsersTools } from '../dist/tools/users.js';
import { createTagsTools } from '../dist/tools/tags.js';
import { AircallMCPServer } from '../dist/server.js';

test('broad tool selection cannot expose sensitive read tools', () => {
 const server = new AircallMCPServer({apiId:'synthetic',apiToken:'synthetic',tools:'all'});
 assert.deepEqual(server.getToolNames().sort(), ['aircall_list_calls','aircall_get_call','aircall_search_calls','aircall_list_users','aircall_list_tags'].sort());
});
test('user and tag lists return IDs only', async () => {
 const client = {get: async () => ({meta:{total:1,current_page:1,per_page:20},users:[{id:2,email:'synthetic@example.invalid'}],tags:[{id:3,name:'private'}]})};
 assert.deepEqual((await createUsersTools(client).aircall_list_users.execute({})).users,[{id:2}]);
 assert.deepEqual((await createTagsTools(client).aircall_list_tags.execute({})).tags,[{id:3}]);
});

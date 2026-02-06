# Aircall MCP Server - Tool Reference

Complete reference for all 73 tools available in the Aircall MCP server.

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| [Calls](#calls) | 15 | Call management and AI insights |
| [Contacts](#contacts) | 10 | Contact CRUD operations |
| [Users](#users) | 10 | User management and availability |
| [Teams](#teams) | 6 | Team management |
| [Numbers](#numbers) | 5 | Phone number configuration |
| [Tags](#tags) | 5 | Call tagging |
| [Webhooks](#webhooks) | 5 | Real-time event notifications |
| [Messages](#messages) | 6 | SMS messaging |
| [Dialer](#dialer) | 7 | Power dialer campaigns |
| [Company](#company) | 4 | Company info and integrations |

---

## Calls

### aircall_list_calls
List calls with optional filters.

**Parameters:**
- `page` (number, optional) - Page number
- `per_page` (number, optional) - Results per page (max 50)
- `order` (string, optional) - "asc" or "desc"
- `from` (number, optional) - Unix timestamp
- `to` (number, optional) - Unix timestamp
- `direction` (string, optional) - "inbound" or "outbound"

### aircall_get_call
Get detailed information about a specific call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_search_calls
Search calls by phone number, tags, user, or number.

**Parameters:**
- `phone_number` (string, optional) - Search by phone number
- `tags` (array, optional) - Filter by tag names
- `user_id` (number, optional) - Filter by user ID
- `number_id` (number, optional) - Filter by Aircall number ID
- `from` (number, optional) - Unix timestamp
- `to` (number, optional) - Unix timestamp

### aircall_get_transcript
Get the transcription of a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_get_realtime_transcript
Get real-time transcription for an ongoing call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_get_summary
Get AI-generated summary of a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_get_sentiments
Get sentiment analysis for a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_get_topics
Get topics discussed during a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_get_action_items
Get AI-detected action items from a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_add_comment
Add a comment to a call.

**Parameters:**
- `call_id` (number, required) - The call ID
- `content` (string, required) - Comment content

### aircall_add_tags
Add tags to a call.

**Parameters:**
- `call_id` (number, required) - The call ID
- `tags` (array, required) - Array of tag IDs

### aircall_archive_call
Archive a call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_transfer_call
Transfer an active call to another user.

**Parameters:**
- `call_id` (number, required) - The call ID
- `user_id` (number, required) - User ID to transfer to

### aircall_pause_recording
Pause recording on an active call.

**Parameters:**
- `call_id` (number, required) - The call ID

### aircall_resume_recording
Resume recording on an active call.

**Parameters:**
- `call_id` (number, required) - The call ID

---

## Contacts

### aircall_list_contacts
List all contacts with pagination.

**Parameters:**
- `page` (number, optional) - Page number
- `per_page` (number, optional) - Results per page
- `order` (string, optional) - "asc" or "desc"

### aircall_search_contacts
Search contacts by phone number or email.

**Parameters:**
- `phone_number` (string, optional) - Search by phone
- `email` (string, optional) - Search by email

### aircall_get_contact
Get detailed contact information.

**Parameters:**
- `contact_id` (number, required) - The contact ID

### aircall_create_contact
Create a new contact.

**Parameters:**
- `first_name` (string, optional)
- `last_name` (string, optional)
- `company_name` (string, optional)
- `information` (string, optional) - Notes
- `phone_numbers` (array, optional) - [{label, value}]
- `emails` (array, optional) - [{label, value}]

### aircall_update_contact
Update an existing contact.

**Parameters:**
- `contact_id` (number, required)
- `first_name` (string, optional)
- `last_name` (string, optional)
- `company_name` (string, optional)
- `information` (string, optional)

### aircall_delete_contact
Delete a contact.

**Parameters:**
- `contact_id` (number, required)

### aircall_add_phone
Add a phone number to a contact.

**Parameters:**
- `contact_id` (number, required)
- `label` (string, required) - e.g., "Work", "Mobile"
- `value` (string, required) - Phone number

### aircall_update_phone
Update a phone number on a contact.

**Parameters:**
- `contact_id` (number, required)
- `phone_id` (number, required)
- `label` (string, optional)
- `value` (string, optional)

### aircall_add_email
Add an email to a contact.

**Parameters:**
- `contact_id` (number, required)
- `label` (string, required)
- `value` (string, required)

### aircall_delete_email
Delete an email from a contact.

**Parameters:**
- `contact_id` (number, required)
- `email_id` (number, required)

---

## Users

### aircall_list_users
List all users.

**Parameters:**
- `page` (number, optional)
- `per_page` (number, optional)
- `order` (string, optional)

### aircall_get_user
Get user details.

**Parameters:**
- `user_id` (number, required)

### aircall_create_user
Create a new user (sends invitation email).

**Parameters:**
- `email` (string, required)
- `first_name` (string, required)
- `last_name` (string, required)
- `role_id` (string, optional)
- `is_admin` (boolean, optional)

### aircall_update_user
Update a user.

**Parameters:**
- `user_id` (number, required)
- `first_name` (string, optional)
- `last_name` (string, optional)
- `role_id` (string, optional)
- `wrap_up_time` (number, optional)

### aircall_delete_user
Delete a user.

**Parameters:**
- `user_id` (number, required)

### aircall_check_availability
Check if a user is available.

**Parameters:**
- `user_id` (number, required)

### aircall_list_availabilities
Get availability status for all users.

**Parameters:** None

### aircall_start_call
Initiate an outbound call.

**Parameters:**
- `user_id` (number, required) - User making the call
- `number_id` (number, required) - Aircall number to call from
- `to` (string, required) - Phone number to call

### aircall_dial
Open the Aircall phone with a number pre-dialed.

**Parameters:**
- `user_id` (number, required)
- `to` (string, required) - Phone number to dial

### aircall_get_user_numbers
Get all phone numbers assigned to a user.

**Parameters:**
- `user_id` (number, required)

---

## Teams

### aircall_list_teams
List all teams.

### aircall_get_team
Get team details.

**Parameters:**
- `team_id` (number, required)

### aircall_create_team
Create a new team.

**Parameters:**
- `name` (string, required)

### aircall_delete_team
Delete a team.

**Parameters:**
- `team_id` (number, required)

### aircall_add_user_to_team
Add a user to a team.

**Parameters:**
- `team_id` (number, required)
- `user_id` (number, required)

### aircall_remove_user_from_team
Remove a user from a team.

**Parameters:**
- `team_id` (number, required)
- `user_id` (number, required)

---

## Numbers

### aircall_list_numbers
List all phone numbers.

### aircall_get_number
Get phone number details.

**Parameters:**
- `number_id` (number, required)

### aircall_update_number
Update phone number configuration.

**Parameters:**
- `number_id` (number, required)
- `name` (string, optional)
- `time_zone` (string, optional)
- `priority` (number, optional)

### aircall_update_messages
Update audio messages for a number.

**Parameters:**
- `number_id` (number, required)
- `welcome` (string, optional) - URL
- `waiting` (string, optional) - URL
- `voicemail` (string, optional) - URL
- ... (other message types)

### aircall_get_registration_status
Get registration status for a number.

**Parameters:**
- `number_id` (number, required)

---

## Tags

### aircall_list_tags
List all tags.

### aircall_get_tag
Get tag details.

**Parameters:**
- `tag_id` (number, required)

### aircall_create_tag
Create a new tag.

**Parameters:**
- `name` (string, required)
- `color` (string, optional) - Hex color
- `description` (string, optional)

### aircall_update_tag
Update a tag.

**Parameters:**
- `tag_id` (number, required)
- `name` (string, optional)
- `color` (string, optional)
- `description` (string, optional)

### aircall_delete_tag
Delete a tag.

**Parameters:**
- `tag_id` (number, required)

---

## Webhooks

### aircall_list_webhooks
List all webhooks.

### aircall_get_webhook
Get webhook details.

**Parameters:**
- `webhook_id` (string, required)

### aircall_create_webhook
Create a new webhook.

**Parameters:**
- `url` (string, required) - URL to receive events
- `events` (array, required) - Event types to subscribe to

**Available events:**
- `call.created`, `call.ringing_on_agent`, `call.answered`, `call.ended`
- `call.voicemail_left`, `call.tagged`, `call.commented`, `call.archived`
- `contact.created`, `contact.updated`, `contact.deleted`
- `user.created`, `user.connected`, `user.disconnected`
- `message.created`, `message.received`

### aircall_update_webhook
Update a webhook.

**Parameters:**
- `webhook_id` (string, required)
- `url` (string, optional)
- `events` (array, optional)
- `active` (boolean, optional)

### aircall_delete_webhook
Delete a webhook.

**Parameters:**
- `webhook_id` (string, required)

---

## Messages

### aircall_list_messages
List SMS messages.

**Parameters:**
- `page` (number, optional)
- `per_page` (number, optional)
- `direction` (string, optional) - "inbound" or "outbound"
- `number_id` (number, optional)

### aircall_send_message
Send an SMS message.

**Parameters:**
- `from` (number, required) - Aircall number ID
- `to` (string, required) - Phone number (E.164 format)
- `body` (string, required) - Message content (max 1600 chars)

### aircall_send_agent_message
Send a message in an existing conversation.

**Parameters:**
- `conversation_id` (number, required)
- `body` (string, required)

### aircall_create_config
Enable SMS on a number.

**Parameters:**
- `number_id` (number, required)
- `webhook_url` (string, optional)

### aircall_get_config
Get SMS configuration for a number.

**Parameters:**
- `number_id` (number, required)

### aircall_delete_config
Disable SMS on a number.

**Parameters:**
- `number_id` (number, required)

---

## Dialer

### aircall_list_campaigns
List power dialer campaigns.

**Parameters:**
- `page` (number, optional)
- `per_page` (number, optional)
- `status` (string, optional) - "active", "paused", "completed"

### aircall_get_campaign
Get campaign details.

**Parameters:**
- `campaign_id` (number, required)

### aircall_create_campaign
Create a new campaign.

**Parameters:**
- `name` (string, required)
- `user_ids` (array, optional) - Users to assign

### aircall_delete_campaign
Delete a campaign.

**Parameters:**
- `campaign_id` (number, required)

### aircall_get_campaign_numbers
Get phone numbers in a campaign.

**Parameters:**
- `campaign_id` (number, required)
- `page` (number, optional)
- `status` (string, optional)

### aircall_add_campaign_numbers
Add numbers to a campaign.

**Parameters:**
- `campaign_id` (number, required)
- `phone_numbers` (array, required) - [{phone_number, contact_id?, notes?}]

### aircall_remove_campaign_number
Remove a number from a campaign.

**Parameters:**
- `campaign_id` (number, required)
- `phone_number_id` (number, required)

---

## Company

### aircall_get_company
Get company information.

**Parameters:** None

### aircall_list_integrations
List all integrations.

**Parameters:** None

### aircall_enable_integration
Enable an integration.

**Parameters:**
- `integration_id` (number, required)

### aircall_disable_integration
Disable an integration.

**Parameters:**
- `integration_id` (number, required)

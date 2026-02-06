// Aircall Messages/SMS Tools
// SMS messaging capabilities

import { z } from 'zod';
import type { AircallClient } from '../utils/auth.js';
import type {
  MessagesListResponse,
  MessageResponse,
  Message,
  MessageConfig,
} from '../types/aircall.js';

// Schema definitions
export const listMessagesSchema = z.object({
  page: z.number().optional().describe('Page number (default: 1)'),
  per_page: z.number().optional().describe('Results per page (default: 20, max: 50)'),
  order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
  direction: z.enum(['inbound', 'outbound']).optional().describe('Filter by message direction'),
  number_id: z.number().optional().describe('Filter by Aircall number ID'),
});

export const sendMessageSchema = z.object({
  from: z.number().describe('Aircall number ID to send from'),
  to: z.string().describe('Phone number to send to (E.164 format)'),
  body: z.string().describe('Message content (max 1600 characters)'),
});

export const sendAgentMessageSchema = z.object({
  conversation_id: z.number().describe('The conversation/thread ID'),
  body: z.string().describe('Message content'),
});

export const createConfigSchema = z.object({
  number_id: z.number().describe('The Aircall number ID'),
  webhook_url: z.string().url().optional().describe('URL to receive message webhooks'),
});

export const getConfigSchema = z.object({
  number_id: z.number().describe('The Aircall number ID'),
});

export const deleteConfigSchema = z.object({
  number_id: z.number().describe('The Aircall number ID'),
});

// Helper to format message for output
function formatMessage(message: Message) {
  return {
    id: message.id,
    direct_link: message.direct_link,
    direction: message.direction,
    status: message.status,
    body: message.body,
    external_number: message.external_number,
    created_at: new Date(message.created_at * 1000).toISOString(),
    number: message.number
      ? {
          id: message.number.id,
          name: message.number.name,
          digits: message.number.digits,
        }
      : null,
    contact: message.contact
      ? {
          id: message.contact.id,
          name: `${message.contact.first_name || ''} ${message.contact.last_name || ''}`.trim(),
        }
      : null,
    user: message.user
      ? {
          id: message.user.id,
          name: message.user.name,
        }
      : null,
    has_media: message.media_urls.length > 0,
    media_count: message.media_urls.length,
  };
}

// Tool implementations
export function createMessagesTools(client: AircallClient) {
  return {
    aircall_list_messages: {
      description: 'List SMS messages with optional filters. Returns message history with content and metadata.',
      parameters: listMessagesSchema,
      execute: async (params: z.infer<typeof listMessagesSchema>) => {
        const result = await client.get<MessagesListResponse>('/messages', params);
        return {
          total: result.meta.total,
          page: result.meta.current_page,
          per_page: result.meta.per_page,
          messages: result.messages.map(formatMessage),
        };
      },
    },

    aircall_send_message: {
      description: 'Send an SMS message from an Aircall number. The number must have SMS capability enabled.',
      parameters: sendMessageSchema,
      execute: async (params: z.infer<typeof sendMessageSchema>) => {
        if (params.body.length > 1600) {
          throw new Error('Message body cannot exceed 1600 characters');
        }

        const result = await client.post<MessageResponse>('/messages', {
          from: params.from,
          to: params.to,
          body: params.body,
        });

        return {
          success: true,
          message: 'SMS sent successfully',
          sms: formatMessage(result.message),
        };
      },
    },

    aircall_send_agent_message: {
      description: 'Send a message in an existing SMS conversation thread. Use this to reply to ongoing conversations.',
      parameters: sendAgentMessageSchema,
      execute: async (params: z.infer<typeof sendAgentMessageSchema>) => {
        const result = await client.post<MessageResponse>(
          `/conversations/${params.conversation_id}/messages`,
          {
            body: params.body,
          }
        );

        return {
          success: true,
          message: 'Message sent successfully',
          sms: formatMessage(result.message),
        };
      },
    },

    aircall_create_config: {
      description: 'Enable SMS on an Aircall number and optionally set a webhook URL for incoming messages.',
      parameters: createConfigSchema,
      execute: async (params: z.infer<typeof createConfigSchema>) => {
        const result = await client.post<{ config: MessageConfig }>(
          `/numbers/${params.number_id}/messages/config`,
          {
            webhook_url: params.webhook_url,
          }
        );

        return {
          success: true,
          message: 'SMS enabled on number',
          config: {
            number_id: result.config.number_id,
            enabled: result.config.enabled,
            webhook_url: result.config.webhook_url,
          },
        };
      },
    },

    aircall_get_config: {
      description: 'Get SMS configuration for an Aircall number.',
      parameters: getConfigSchema,
      execute: async (params: z.infer<typeof getConfigSchema>) => {
        const result = await client.get<{ config: MessageConfig }>(
          `/numbers/${params.number_id}/messages/config`
        );

        return {
          number_id: result.config.number_id,
          enabled: result.config.enabled,
          webhook_url: result.config.webhook_url,
        };
      },
    },

    aircall_delete_config: {
      description: 'Disable SMS on an Aircall number.',
      parameters: deleteConfigSchema,
      execute: async (params: z.infer<typeof deleteConfigSchema>) => {
        await client.delete(`/numbers/${params.number_id}/messages/config`);

        return {
          success: true,
          message: 'SMS disabled on number',
          number_id: params.number_id,
        };
      },
    },
  };
}

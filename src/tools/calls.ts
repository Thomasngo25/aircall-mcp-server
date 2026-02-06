// Aircall Calls Tools
// Full call management including AI insights

import { z } from 'zod';
import type { AircallClient } from '../utils/auth.js';
import type {
  CallsListResponse,
  CallResponse,
  Transcript,
  CallSummary,
  CallSentiment,
  CallTopics,
  CallActionItems,
} from '../types/aircall.js';

// Schema definitions for tool parameters
export const listCallsSchema = z.object({
  page: z.number().optional().describe('Page number (default: 1)'),
  per_page: z.number().optional().describe('Results per page (default: 20, max: 50)'),
  order: z.enum(['asc', 'desc']).optional().describe('Sort order by date'),
  from: z.number().optional().describe('Filter calls from this Unix timestamp'),
  to: z.number().optional().describe('Filter calls to this Unix timestamp'),
  direction: z.enum(['inbound', 'outbound']).optional().describe('Filter by call direction'),
});

export const getCallSchema = z.object({
  call_id: z.number().describe('The call ID'),
});

export const searchCallsSchema = z.object({
  phone_number: z.string().optional().describe('Search by phone number'),
  tags: z.array(z.string()).optional().describe('Filter by tag names'),
  user_id: z.number().optional().describe('Filter by user ID'),
  number_id: z.number().optional().describe('Filter by Aircall number ID'),
  from: z.number().optional().describe('From Unix timestamp'),
  to: z.number().optional().describe('To Unix timestamp'),
});

export const addCommentSchema = z.object({
  call_id: z.number().describe('The call ID'),
  content: z.string().describe('Comment content'),
});

export const addTagsSchema = z.object({
  call_id: z.number().describe('The call ID'),
  tags: z.array(z.number()).describe('Array of tag IDs to add'),
});

export const archiveCallSchema = z.object({
  call_id: z.number().describe('The call ID to archive'),
});

export const transferCallSchema = z.object({
  call_id: z.number().describe('The call ID'),
  user_id: z.number().describe('User ID to transfer to'),
});

export const recordingControlSchema = z.object({
  call_id: z.number().describe('The call ID'),
});

// Tool implementations
export function createCallsTools(client: AircallClient) {
  return {
    aircall_list_calls: {
      description: 'List calls with optional filters. Returns paginated call history with details including direction, status, duration, and associated contacts/users.',
      parameters: listCallsSchema,
      execute: async (params: z.infer<typeof listCallsSchema>) => {
        const result = await client.get<CallsListResponse>('/calls', params);
        return {
          total: result.meta.total,
          page: result.meta.current_page,
          per_page: result.meta.per_page,
          calls: result.calls.map((call) => ({
            id: call.id,
            direction: call.direction,
            status: call.status,
            duration: call.duration,
            started_at: new Date(call.started_at * 1000).toISOString(),
            raw_digits: call.raw_digits,
            user: call.user?.name || null,
            contact: call.contact
              ? `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim() || null
              : null,
            number: call.number?.name || null,
            archived: call.archived,
            has_recording: !!call.recording,
            has_voicemail: !!call.voicemail,
            tags: call.tags.map((t) => t.name),
          })),
        };
      },
    },

    aircall_get_call: {
      description: 'Get detailed information about a specific call including comments, tags, participants, and recording URLs.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<CallResponse>(`/calls/${params.call_id}`);
        const call = result.call;
        return {
          id: call.id,
          direct_link: call.direct_link,
          direction: call.direction,
          status: call.status,
          duration: call.duration,
          started_at: call.started_at ? new Date(call.started_at * 1000).toISOString() : null,
          answered_at: call.answered_at ? new Date(call.answered_at * 1000).toISOString() : null,
          ended_at: call.ended_at ? new Date(call.ended_at * 1000).toISOString() : null,
          raw_digits: call.raw_digits,
          recording_url: call.recording,
          voicemail_url: call.voicemail,
          archived: call.archived,
          missed_call_reason: call.missed_call_reason,
          user: call.user ? { id: call.user.id, name: call.user.name, email: call.user.email } : null,
          contact: call.contact
            ? {
                id: call.contact.id,
                name: `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim(),
                company: call.contact.company_name,
              }
            : null,
          number: call.number ? { id: call.number.id, name: call.number.name, digits: call.number.digits } : null,
          assigned_to: call.assigned_to ? { id: call.assigned_to.id, name: call.assigned_to.name } : null,
          transferred_by: call.transferred_by?.name || null,
          transferred_to: call.transferred_to?.name || null,
          teams: call.teams.map((t) => ({ id: t.id, name: t.name })),
          tags: call.tags.map((t) => ({ id: t.id, name: t.name })),
          comments: call.comments.map((c) => ({
            content: c.content,
            posted_by: c.posted_by.name,
            posted_at: new Date(c.posted_at * 1000).toISOString(),
          })),
          participants: call.participants,
        };
      },
    },

    aircall_search_calls: {
      description: 'Search calls by phone number, tags, user, or number. More flexible than list_calls for finding specific calls.',
      parameters: searchCallsSchema,
      execute: async (params: z.infer<typeof searchCallsSchema>) => {
        // Build search parameters
        const searchParams: Record<string, string | number | boolean | undefined> = {
          from: params.from,
          to: params.to,
        };

        if (params.phone_number) {
          searchParams.phone_number = params.phone_number;
        }

        const result = await client.get<CallsListResponse>('/calls', searchParams);

        // Client-side filtering for tags and user_id (API doesn't support all filters)
        let calls = result.calls;

        if (params.user_id) {
          calls = calls.filter((c) => c.user?.id === params.user_id);
        }

        if (params.number_id) {
          calls = calls.filter((c) => c.number?.id === params.number_id);
        }

        if (params.tags && params.tags.length > 0) {
          calls = calls.filter((c) =>
            params.tags!.some((tagName) =>
              c.tags.some((t) => t.name.toLowerCase() === tagName.toLowerCase())
            )
          );
        }

        return {
          found: calls.length,
          calls: calls.map((call) => ({
            id: call.id,
            direction: call.direction,
            status: call.status,
            duration: call.duration,
            started_at: new Date(call.started_at * 1000).toISOString(),
            raw_digits: call.raw_digits,
            user: call.user?.name || null,
            contact: call.contact
              ? `${call.contact.first_name || ''} ${call.contact.last_name || ''}`.trim() || null
              : null,
            tags: call.tags.map((t) => t.name),
          })),
        };
      },
    },

    aircall_get_transcript: {
      description: 'Get the transcription of a call. Returns speaker-attributed transcript segments with timestamps.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ transcript: Transcript }>(
          `/calls/${params.call_id}/transcript`
        );
        return {
          call_id: params.call_id,
          language: result.transcript.language,
          segments: result.transcript.content.map((seg) => ({
            speaker: seg.speaker,
            text: seg.text,
            start_time: seg.start_time,
            end_time: seg.end_time,
          })),
        };
      },
    },

    aircall_get_realtime_transcript: {
      description: 'Get real-time transcription for an ongoing call. Use this during active calls to see live transcription.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ transcript: Transcript }>(
          `/calls/${params.call_id}/realtime_transcript`
        );
        return {
          call_id: params.call_id,
          language: result.transcript.language,
          segments: result.transcript.content,
        };
      },
    },

    aircall_get_summary: {
      description: 'Get AI-generated summary of a call including key points discussed.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ summary: CallSummary }>(
          `/calls/${params.call_id}/summary`
        );
        return {
          call_id: params.call_id,
          summary: result.summary.summary,
          key_points: result.summary.key_points,
        };
      },
    },

    aircall_get_sentiments: {
      description: 'Get sentiment analysis for a call including overall sentiment and key moments.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ sentiments: CallSentiment }>(
          `/calls/${params.call_id}/sentiments`
        );
        return {
          call_id: params.call_id,
          overall: result.sentiments.overall,
          customer_sentiment: result.sentiments.customer_sentiment,
          agent_sentiment: result.sentiments.agent_sentiment,
          key_moments: result.sentiments.moments,
        };
      },
    },

    aircall_get_topics: {
      description: 'Get topics discussed during a call with confidence scores.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ topics: CallTopics }>(
          `/calls/${params.call_id}/topics`
        );
        return {
          call_id: params.call_id,
          topics: result.topics.topics.map((t) => ({
            name: t.name,
            confidence: t.confidence,
            mentions: t.mentions,
          })),
        };
      },
    },

    aircall_get_action_items: {
      description: 'Get AI-detected action items from a call including assignees and priorities.',
      parameters: getCallSchema,
      execute: async (params: z.infer<typeof getCallSchema>) => {
        const result = await client.get<{ action_items: CallActionItems }>(
          `/calls/${params.call_id}/action_items`
        );
        return {
          call_id: params.call_id,
          action_items: result.action_items.action_items,
        };
      },
    },

    aircall_add_comment: {
      description: 'Add a comment to a call. Comments are visible in the Aircall dashboard.',
      parameters: addCommentSchema,
      execute: async (params: z.infer<typeof addCommentSchema>) => {
        await client.post(`/calls/${params.call_id}/comments`, {
          content: params.content,
        });
        return { success: true, call_id: params.call_id, comment_added: params.content };
      },
    },

    aircall_add_tags: {
      description: 'Add tags to a call. Tags help categorize and filter calls.',
      parameters: addTagsSchema,
      execute: async (params: z.infer<typeof addTagsSchema>) => {
        await client.post(`/calls/${params.call_id}/tags`, {
          tags: params.tags,
        });
        return { success: true, call_id: params.call_id, tags_added: params.tags };
      },
    },

    aircall_archive_call: {
      description: 'Archive a call. Archived calls are hidden from the main call list.',
      parameters: archiveCallSchema,
      execute: async (params: z.infer<typeof archiveCallSchema>) => {
        await client.put(`/calls/${params.call_id}/archive`);
        return { success: true, call_id: params.call_id, archived: true };
      },
    },

    aircall_transfer_call: {
      description: 'Transfer an active call to another user.',
      parameters: transferCallSchema,
      execute: async (params: z.infer<typeof transferCallSchema>) => {
        await client.post(`/calls/${params.call_id}/transfers`, {
          user_id: params.user_id,
        });
        return { success: true, call_id: params.call_id, transferred_to: params.user_id };
      },
    },

    aircall_pause_recording: {
      description: 'Pause recording on an active call. Useful for sensitive information.',
      parameters: recordingControlSchema,
      execute: async (params: z.infer<typeof recordingControlSchema>) => {
        await client.post(`/calls/${params.call_id}/pause_recording`);
        return { success: true, call_id: params.call_id, recording_paused: true };
      },
    },

    aircall_resume_recording: {
      description: 'Resume recording on an active call after it was paused.',
      parameters: recordingControlSchema,
      execute: async (params: z.infer<typeof recordingControlSchema>) => {
        await client.post(`/calls/${params.call_id}/resume_recording`);
        return { success: true, call_id: params.call_id, recording_resumed: true };
      },
    },
  };
}

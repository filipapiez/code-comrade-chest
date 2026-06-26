import * as React from 'react'
import { render } from 'react-email'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Makibaki'
const SENDER_DOMAIN = 'notify.makibaki.com'
const FROM_DOMAIN = 'makibaki.com'
const TEMPLATE_NAME = 'contact-notification'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(255),
  project: z.string().trim().min(1).max(80),
  message: z.string().trim().min(5).max(2000),
  website: z.string().optional(), // honeypot
})

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'Server not configured' }, { status: 500, headers: corsHeaders })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders })
        }

        const parsed = submissionSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400, headers: corsHeaders })
        }

        // Honeypot — silently accept and discard bots
        if (parsed.data.website && parsed.data.website.trim().length > 0) {
          return Response.json({ success: true }, { headers: corsHeaders })
        }

        const { name, phone, email, project, message } = parsed.data
        const submittedAt = new Date().toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          dateStyle: 'medium',
          timeStyle: 'short',
        })

        const template = TEMPLATES[TEMPLATE_NAME]
        if (!template) {
          return Response.json({ error: 'Template not registered' }, { status: 500, headers: corsHeaders })
        }
        const recipient = template.to!
        const supabase = createClient(supabaseUrl, serviceKey)

        // Suppression check
        const { data: suppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', recipient.toLowerCase())
          .maybeSingle()
        if (suppressed) {
          return Response.json({ success: true }, { headers: corsHeaders })
        }

        // Unsubscribe token (one per email)
        let unsubscribeToken: string
        const { data: existing } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', recipient.toLowerCase())
          .maybeSingle()
        if (existing && !existing.used_at) {
          unsubscribeToken = existing.token
        } else {
          unsubscribeToken = generateToken()
          await supabase
            .from('email_unsubscribe_tokens')
            .upsert({ token: unsubscribeToken, email: recipient.toLowerCase() }, { onConflict: 'email', ignoreDuplicates: true })
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', recipient.toLowerCase())
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        const templateData = { name, phone, email, project, message, submittedAt }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function' ? template.subject(templateData) : template.subject

        const messageId = crypto.randomUUID()

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: TEMPLATE_NAME,
          recipient_email: recipient,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            reply_to: email,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text,
            purpose: 'transactional',
            label: TEMPLATE_NAME,
            idempotency_key: messageId,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Failed to enqueue contact email', enqueueError)
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue',
          })
          return Response.json({ error: 'Could not send' }, { status: 500, headers: corsHeaders })
        }

        return Response.json({ success: true }, { headers: corsHeaders })
      },
    },
  },
})

import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  phone?: string
  email?: string
  project?: string
  message?: string
  submittedAt?: string
}

const ContactNotification = ({
  name = '',
  phone = '',
  email = '',
  project = '',
  message = '',
  submittedAt = '',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New estimate request from {name || 'a customer'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Estimate Request</Heading>
        <Text style={lede}>
          A new request just came in through makibaki.com.
        </Text>

        <Section style={card}>
          <Row label="Name" value={name} />
          <Row label="Phone" value={phone} />
          <Row label="Email" value={email} />
          <Row label="Project Type" value={project} />
        </Section>

        <Heading as="h2" style={h2}>Message</Heading>
        <Text style={messageBlock}>{message || '(no message provided)'}</Text>

        <Hr style={hr} />
        <Text style={muted}>
          Submitted {submittedAt || 'just now'} · Reply directly to {email || 'the customer'} to follow up.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={row}>
    <span style={rowLabel}>{label}: </span>
    <span style={rowValue}>{value || '—'}</span>
  </Text>
)

export const template = {
  component: ContactNotification,
  subject: (data: Record<string, any>) =>
    `New Estimate Request — ${data.project || 'Glass'} — ${data.name || 'Customer'}`,
  displayName: 'Contact Form Notification',
  to: 'makibakiglass@gmail.com',
  previewData: {
    name: 'Jane Doe',
    phone: '(224) 555-0100',
    email: 'jane@example.com',
    project: 'Shower Doors',
    message: 'Looking for a frameless shower door for our master bath. Roughly 60x70.',
    submittedAt: 'Jun 26, 2026 10:14 AM',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', color: '#0E1113', margin: '0 0 8px' }
const h2 = { fontSize: '15px', color: '#0E1113', margin: '20px 0 6px' }
const lede = { fontSize: '14px', color: '#6E767C', margin: '0 0 18px' }
const card = {
  backgroundColor: '#F4F6F8',
  borderRadius: '10px',
  padding: '14px 18px',
}
const row = { fontSize: '14px', color: '#0E1113', margin: '4px 0' }
const rowLabel = { color: '#6E767C', fontWeight: 600 }
const rowValue = { color: '#0E1113' }
const messageBlock = {
  fontSize: '14px',
  color: '#0E1113',
  lineHeight: '1.55',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#F4F6F8',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0',
}
const hr = { borderColor: '#E4E7EA', margin: '22px 0 12px' }
const muted = { fontSize: '12px', color: '#8A9094', margin: '0' }

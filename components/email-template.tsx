import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  name,
  email,
  subject,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>New Contact Form Submission</Heading>
          </Section>

          <Section style={content}>
            <Section style={field}>
              <Text style={label}>FROM</Text>
              <Text style={value}>{name}</Text>
            </Section>

            <Section style={field}>
              <Text style={label}>EMAIL</Text>
              <Link href={`mailto:${email}`} style={emailLink}>
                {email}
              </Link>
            </Section>

            <Section style={field}>
              <Text style={label}>SUBJECT</Text>
              <Text style={value}>{subject}</Text>
            </Section>

            <Section style={field}>
              <Text style={label}>MESSAGE</Text>
              <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </Section>
            </Section>

            <Section style={buttonContainer}>
              <Button
                href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`}
                style={replyButton}
              >
                Reply to {name}
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This email was sent from your portfolio website contact form.
            </Text>
            <Text style={footerDate}>
              Sent on {new Date().toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px 8px 0 0',
  padding: '30px',
  textAlign: 'center' as const,
};

const headerTitle = {
  margin: '0',
  fontSize: '24px',
  fontWeight: '600',
  color: '#ffffff',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '0 0 8px 8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const field = {
  marginBottom: '20px',
};

const label = {
  fontWeight: '600',
  color: '#667eea',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 5px 0',
};

const value = {
  color: '#333333',
  fontSize: '16px',
  margin: '5px 0',
  wordWrap: 'break-word' as const,
};

const emailLink = {
  color: '#667eea',
  textDecoration: 'none',
  fontSize: '16px',
};

const messageBox = {
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #667eea',
  padding: '15px',
  borderRadius: '4px',
  marginTop: '10px',
};

const messageText = {
  color: '#333333',
  fontSize: '16px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const replyButton = {
  backgroundColor: '#667eea',
  color: '#ffffff',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  display: 'inline-block',
};

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e0e0e0',
  borderRadius: '0 0 8px 8px',
  marginTop: '20px',
};

const footerText = {
  fontSize: '12px',
  color: '#666666',
  margin: '0',
};

const footerDate = {
  fontSize: '12px',
  color: '#999999',
  margin: '5px 0 0 0',
};

export default ContactEmailTemplate;

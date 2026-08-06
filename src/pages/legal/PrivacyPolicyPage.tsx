import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import {
  EFFECTIVE_DATE,
  PRIVACY_CONTACT_EMAIL,
  BUSINESS_MAILING_ADDRESS,
  PRACTICE_WEBSITE,
} from '@/lib/legal';

const PrivacyPolicyPage: React.FC = () => (
  <LegalPageLayout title="Privacy Policy" version="privacy-v1.0" effectiveDate={EFFECTIVE_DATE}>
    <p>
      Making Meaning Psychology, PLLC ("Making Meaning Psychology," "we," "our," or "us") respects your
      privacy and is committed to protecting the information you share with us through our mobile
      application and related services (collectively, the "App").
    </p>
    <p>
      This Privacy Policy explains how we collect, use, protect, and disclose information when you use
      the App.
    </p>
    <p>
      The App was designed with privacy as a core principle. We aim to provide meaningful mental health
      support tools while giving you control over the information you choose to enter and share.
    </p>
    <p>By creating an account or using the App, you acknowledge that you have reviewed this Privacy Policy.</p>

    <h2>About Making Meaning Psychology, PLLC</h2>
    <p>
      Making Meaning Psychology, PLLC is a mental health practice that developed this App to support
      reflection, therapeutic engagement, and emotional wellness.
    </p>
    <p>
      The App is intended to complement mental health care and personal growth. It is not a replacement
      for psychotherapy, professional clinical judgment, or emergency services.
    </p>

    <h2>Therapeutic Relationship</h2>
    <p>
      Creating an account, downloading the App, or using the App does not, by itself, establish a
      psychologist-patient, therapist-patient, or healthcare provider relationship with Making Meaning
      Psychology, PLLC or any clinician associated with the App.
    </p>
    <p>
      A therapeutic relationship is established only through a separate clinical intake process, informed
      consent, and acceptance into care by a licensed provider.
    </p>
    <p>
      For individuals receiving clinical services, the App may be used as a tool to support ongoing
      treatment. The App does not replace direct communication with your provider or the therapeutic
      relationship itself.
    </p>

    <h2>Information We Collect</h2>
    <h3>Information You Provide</h3>
    <p>You may provide information when using the App, including:</p>
    <ul>
      <li>Name</li>
      <li>Email address</li>
      <li>Account credentials</li>
      <li>Profile information</li>
      <li>Mood tracking entries</li>
      <li>Journal entries</li>
      <li>Gratitude reflections</li>
      <li>Reflection prompts</li>
      <li>CBT exercises</li>
      <li>Exposure exercises</li>
      <li>Mindfulness activities</li>
      <li>Crisis planning information</li>
      <li>Wellness tracking information</li>
      <li>Other information you voluntarily choose to enter</li>
    </ul>
    <p>You control the information you choose to provide.</p>

    <h2>Information Collected Automatically</h2>
    <p>We may collect limited technical information necessary to operate and improve the App, including:</p>
    <ul>
      <li>Device type</li>
      <li>Operating system</li>
      <li>App version</li>
      <li>Authentication events</li>
      <li>Session information</li>
      <li>Error reports</li>
      <li>Performance diagnostics</li>
      <li>Notification preferences</li>
    </ul>
    <p>
      We do not use your information for targeted advertising and do not sell your personal information.
    </p>

    <h2>How We Use Your Information</h2>
    <p>We may use information to:</p>
    <ul>
      <li>Create and manage your account</li>
      <li>Provide App features</li>
      <li>Authenticate users</li>
      <li>Protect account security</li>
      <li>Maintain and improve App performance</li>
      <li>Support your therapeutic experience</li>
      <li>Allow you to share information with your provider when you choose</li>
      <li>Respond to support requests</li>
      <li>Detect security issues or misuse</li>
      <li>Comply with applicable legal requirements</li>
    </ul>

    <h2>Journal Privacy and Sharing</h2>
    <p>Your journal entries are private by default.</p>
    <p>You decide whether to share an individual journal entry with your provider.</p>
    <p>
      Only journal entries that you intentionally choose to share become accessible to your provider
      through the App.
    </p>
    <p>
      Once a journal entry has been shared, it cannot be unshared through the App. This design supports
      the integrity of the therapeutic record and reflects the nature of clinical documentation.
    </p>

    <h2>Provider Access</h2>
    <p>
      If you are receiving care from a participating provider, certain information may be accessible to
      that provider based on your relationship and the permissions you provide.
    </p>
    <p>Providers may only access information made available through authorized features of the App.</p>
    <p>Private journal entries that you have not chosen to share remain private.</p>

    <h2>Data Security</h2>
    <p>
      We use reasonable administrative, technical, and organizational safeguards designed to protect your
      information, including:
    </p>
    <ul>
      <li>Secure authentication</li>
      <li>Encrypted data transmission</li>
      <li>Role-based access controls</li>
      <li>Multi-factor authentication for provider accounts</li>
      <li>Access monitoring</li>
      <li>Session timeout protections</li>
      <li>Private data storage</li>
      <li>Security controls designed to limit unauthorized access</li>
    </ul>
    <p>No electronic system can guarantee complete security. We continuously evaluate and improve our safeguards.</p>

    <h2>Third-Party Services</h2>
    <p>We use trusted service providers to operate and maintain the App. These services may include:</p>
    <ul>
      <li>Secure hosting</li>
      <li>Authentication services</li>
      <li>Database services</li>
      <li>Push notifications</li>
      <li>Error monitoring</li>
      <li>Application performance tools</li>
    </ul>
    <p>
      These providers are selected to support secure operation of the App and are required to protect
      information according to applicable agreements and laws.
    </p>

    <h2>Your Choices and Rights</h2>
    <p>Depending on applicable law, you may have rights regarding your information, including:</p>
    <ul>
      <li>Accessing your information</li>
      <li>Exporting your information</li>
      <li>Requesting account deletion</li>
      <li>Updating account information</li>
      <li>Contacting us with privacy questions</li>
    </ul>
    <p>Certain information may be retained when required by law or professional obligations.</p>

    <h2>Account Deletion</h2>
    <p>You may request deletion of your account through available App features.</p>
    <p>Deletion requests are handled in accordance with applicable legal and regulatory requirements.</p>
    <p>
      Some information may be retained when necessary for legal compliance, professional recordkeeping,
      security purposes, or dispute resolution.
    </p>

    <h2>No Emergency Monitoring</h2>
    <p>The App is not monitored continuously or in real time.</p>
    <p>
      Information entered into the App, including journal entries, mood tracking, crisis plans, or other
      content, may not be reviewed immediately by your provider.
    </p>
    <p>The App is not an emergency service and should not be used to request urgent assistance.</p>
    <p>
      If you are experiencing a mental health emergency, believe you may harm yourself or someone else,
      or require immediate support:
    </p>
    <ul>
      <li>Call 911</li>
      <li>Contact the 988 Suicide &amp; Crisis Lifeline</li>
      <li>Go to the nearest emergency department</li>
    </ul>
    <p>Do not rely on the App to obtain emergency care or crisis intervention.</p>

    <h2>Children's Privacy</h2>
    <p>The App is not intended for children under 13 years of age.</p>
    <p>
      When services are provided to minors by licensed mental health professionals, applicable consent
      requirements and laws will apply.
    </p>

    <h2>Changes to This Privacy Policy</h2>
    <p>We may update this Privacy Policy periodically.</p>
    <p>When changes are made, we will update the Effective Date and provide notice when required.</p>

    <h2>Contact Us</h2>
    <p>Making Meaning Psychology, PLLC</p>
    <p>
      Email: {PRIVACY_CONTACT_EMAIL}
      <br />
      Website:{' '}
      <a href={PRACTICE_WEBSITE} target="_blank" rel="noopener noreferrer">
        {PRACTICE_WEBSITE}
      </a>
      <br />
      Mailing Address: {BUSINESS_MAILING_ADDRESS}
    </p>
  </LegalPageLayout>
);

export default PrivacyPolicyPage;
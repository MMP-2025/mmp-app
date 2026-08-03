import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import {
  EFFECTIVE_DATE,
  PRIVACY_CONTACT_EMAIL,
  BUSINESS_MAILING_ADDRESS,
  PRACTICE_WEBSITE,
  LEGAL_DOCS,
} from '@/lib/legal';

const TermsOfServicePage: React.FC = () => (
  <LegalPageLayout title="Terms of Service" version="tos-v1.0" effectiveDate={EFFECTIVE_DATE}>
    <p>
      These Terms of Service ("Terms") govern your access to and use of the Making Meaning Psychology,
      PLLC mobile application and related services (collectively, the "App").
    </p>
    <p>By creating an account, accessing, or using the App, you agree to these Terms.</p>
    <p>If you do not agree with these Terms, you should not use the App.</p>

    <h2>About the App</h2>
    <p>
      The App is provided by Making Meaning Psychology, PLLC ("Making Meaning Psychology," "we," "our,"
      or "us").
    </p>
    <p>
      The App is designed to support reflection, emotional wellness, therapeutic engagement, and personal
      growth through tools such as:
    </p>
    <ul>
      <li>Journaling</li>
      <li>Mood tracking</li>
      <li>Reflection prompts</li>
      <li>Mindfulness exercises</li>
      <li>Gratitude practices</li>
      <li>Cognitive behavioral exercises</li>
      <li>Exposure exercises</li>
      <li>Wellness tracking tools</li>
      <li>Crisis planning tools</li>
    </ul>
    <p>The App is intended to complement mental health care and personal wellness practices.</p>
    <p>
      The App is not a substitute for psychotherapy, medical care, professional clinical judgment, or
      emergency services.
    </p>

    <h2>No Creation of a Therapeutic Relationship</h2>
    <p>
      Creating an account, downloading the App, or using the App does not establish a
      psychologist-patient, therapist-patient, or healthcare provider relationship with Making Meaning
      Psychology, PLLC or any clinician associated with the App.
    </p>
    <p>
      A therapeutic relationship is established only through a separate clinical intake process, informed
      consent, and acceptance into care by a licensed provider.
    </p>
    <p>
      If you are an existing patient, the App may be incorporated into your treatment experience as a
      supportive tool.
    </p>
    <p>
      Your provider will determine how information from the App may be used within the context of your
      care.
    </p>

    <h2>No Emergency Services or Crisis Monitoring</h2>
    <p>
      The App is not an emergency service and is not monitored continuously or in real time.
    </p>
    <p>
      Information entered into the App, including journal entries, mood tracking, crisis plans, or other
      content, may not be reviewed immediately by a provider.
    </p>
    <p>Do not use the App to seek emergency assistance.</p>
    <p>
      If you are experiencing a mental health emergency, believe you may harm yourself or someone else,
      or require immediate support:
    </p>
    <ul>
      <li>Call 911</li>
      <li>Contact the 988 Suicide &amp; Crisis Lifeline</li>
      <li>Go to the nearest emergency department</li>
    </ul>

    <h2>Eligibility and Account Responsibilities</h2>
    <p>
      You must provide accurate information when creating an account and keep your account information
      current.
    </p>
    <p>You are responsible for:</p>
    <ul>
      <li>Maintaining the confidentiality of your login credentials</li>
      <li>Protecting access to your device</li>
      <li>Not sharing your account with another person</li>
      <li>Notifying us if you believe your account has been accessed without authorization</li>
    </ul>
    <p>You agree to use the App only for lawful purposes and in accordance with these Terms.</p>

    <h2>Provider Accounts</h2>
    <p>
      Provider accounts may require invitation, verification, and additional security requirements.
    </p>
    <p>
      Providers are responsible for maintaining appropriate professional boundaries and complying with
      applicable laws, regulations, and professional obligations.
    </p>
    <p>
      Provider access to patient information is limited according to authorized relationships and
      permissions.
    </p>

    <h2>Patient Information Sharing</h2>
    <p>
      The App allows users to choose whether certain information, including journal entries, is shared
      with a provider.
    </p>
    <p>You are responsible for reviewing information before choosing to share it.</p>
    <p>
      Information shared with a provider may become part of the therapeutic record and may be subject to
      applicable professional recordkeeping requirements.
    </p>

    <h2>Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use the App for unlawful purposes</li>
      <li>Attempt to gain unauthorized access to the App or another user's information</li>
      <li>Interfere with App security or functionality</li>
      <li>Upload malicious code or harmful content</li>
      <li>Impersonate another person</li>
      <li>Misuse provider access features</li>
      <li>Attempt to reverse engineer or copy the App</li>
    </ul>
    <p>
      We reserve the right to restrict access if we believe use of the App violates these Terms or
      creates a security or safety risk.
    </p>

    <h2>Intellectual Property</h2>
    <p>
      The App, including its design, content, features, text, graphics, software, and related materials,
      is owned by or licensed to Making Meaning Psychology, PLLC.
    </p>
    <p>You may use the App only for your personal, non-commercial use.</p>
    <p>
      You may not copy, modify, distribute, sell, or create derivative works from the App without written
      permission.
    </p>

    <h2>User Content</h2>
    <p>You retain ownership of information and content you enter into the App.</p>
    <p>
      By using the App, you provide permission for us to store and process your information only as
      necessary to provide the App, support your use, maintain security, and comply with applicable legal
      obligations.
    </p>
    <p>We do not sell your personal information.</p>

    <h2>Wellness Tools Disclaimer</h2>
    <p>The App includes tools intended to support reflection, awareness, and wellness.</p>
    <p>
      These tools are not intended to diagnose, treat, cure, or prevent any mental health condition.
    </p>
    <p>
      Individual experiences vary, and use of the App does not guarantee specific therapeutic or wellness
      outcomes.
    </p>
    <p>
      Clinical decisions should be made in collaboration with a qualified healthcare professional.
    </p>

    <h2>Availability and Updates</h2>
    <p>We may modify, update, suspend, or discontinue portions of the App at any time.</p>
    <p>We do not guarantee that the App will always be available, uninterrupted, or error-free.</p>
    <p>We may release updates to improve security, functionality, or user experience.</p>

    <h2>Privacy</h2>
    <p>Your use of the App is also governed by:</p>
    <ul>
      <li>
        <a href={LEGAL_DOCS.privacy_policy.route}>Privacy Policy</a>
      </li>
      <li>
        <a href={LEGAL_DOCS.notice_of_privacy_practices.route}>Notice of Privacy Practices</a>
      </li>
    </ul>
    <p>These documents describe how we collect, use, protect, and disclose information.</p>

    <h2>Security</h2>
    <p>We take reasonable steps to protect the App and user information.</p>
    <p>However, no electronic system is completely secure.</p>
    <p>
      You are responsible for protecting your account credentials and maintaining the security of your
      device.
    </p>

    <h2>Account Termination</h2>
    <p>You may stop using the App at any time.</p>
    <p>We may suspend or terminate access if:</p>
    <ul>
      <li>You violate these Terms</li>
      <li>Your use creates a security risk</li>
      <li>Required by law</li>
      <li>Necessary to protect users or the integrity of the App</li>
    </ul>
    <p>Termination does not affect rights or obligations that arose before termination.</p>

    <h2>Limitation of Liability</h2>
    <p>
      To the fullest extent permitted by law, Making Meaning Psychology, PLLC is not responsible for:
    </p>
    <ul>
      <li>Decisions made based solely on information obtained through the App</li>
      <li>Interruptions or errors in App availability</li>
      <li>Unauthorized access resulting from circumstances outside reasonable control</li>
      <li>Outcomes related to use or inability to use the App</li>
    </ul>
    <p>
      The App is provided as a supportive tool and is not a substitute for professional mental health
      care.
    </p>

    <h2>Indemnification</h2>
    <p>You agree to use the App responsibly.</p>
    <p>
      To the extent permitted by law, you agree to be responsible for losses arising from your misuse of
      the App or violation of these Terms.
    </p>

    <h2>Changes to These Terms</h2>
    <p>We may update these Terms periodically.</p>
    <p>When changes are made, we will update the Effective Date.</p>
    <p>
      Your continued use of the App after changes become effective means you accept the updated Terms.
    </p>

    <h2>Governing Law</h2>
    <p>
      These Terms are governed by the laws of the State of New York, without regard to conflict of law
      principles.
    </p>

    <h2>Contact Us</h2>
    <p>Questions regarding these Terms may be directed to:</p>
    <p>
      Making Meaning Psychology, PLLC
      <br />
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

export default TermsOfServicePage;
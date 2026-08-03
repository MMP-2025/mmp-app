import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import {
  EFFECTIVE_DATE,
  PRIVACY_CONTACT_EMAIL,
  BUSINESS_MAILING_ADDRESS,
  PRACTICE_WEBSITE,
} from '@/lib/legal';

const NoticeOfPrivacyPracticesPage: React.FC = () => (
  <LegalPageLayout
    title="Notice of Privacy Practices"
    version="npp-v1.0"
    effectiveDate={EFFECTIVE_DATE}
  >
    <p>
      <strong>
        THIS NOTICE DESCRIBES HOW YOUR PROTECTED HEALTH INFORMATION MAY BE USED AND DISCLOSED AND HOW
        YOU CAN ACCESS THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
      </strong>
    </p>
    <p>
      Making Meaning Psychology, PLLC ("we," "our," or "us") is committed to protecting the privacy and
      confidentiality of your Protected Health Information ("PHI") in accordance with the Health
      Insurance Portability and Accountability Act of 1996 ("HIPAA") and applicable state and federal
      privacy laws.
    </p>
    <p>
      This Notice explains how we may use and disclose your PHI, your rights regarding your PHI, and our
      responsibilities regarding the protection of your health information.
    </p>
    <p>
      This Notice applies when Making Meaning Psychology, PLLC maintains PHI in connection with
      healthcare services, including information collected or maintained through our mobile application
      and related services when applicable.
    </p>
    <p>
      For information about general app data practices, technical information, and application security,
      please review our Privacy Policy.
    </p>

    <h2>Our Responsibilities</h2>
    <p>We are required to:</p>
    <ul>
      <li>Maintain the privacy and security of your PHI.</li>
      <li>Provide you with this Notice describing our privacy practices and legal duties.</li>
      <li>Follow the privacy practices described in this Notice.</li>
      <li>Notify you following a breach of unsecured PHI when required by law.</li>
    </ul>

    <h2>How We May Use and Disclose Your Protected Health Information</h2>

    <h3>Treatment</h3>
    <p>We may use or disclose your PHI to provide, coordinate, or support your mental health care.</p>
    <p>Examples may include:</p>
    <ul>
      <li>Reviewing information you intentionally share through the App.</li>
      <li>Supporting your treatment planning.</li>
      <li>Coordinating care with authorized individuals involved in your treatment when permitted.</li>
    </ul>

    <h3>Payment</h3>
    <p>
      We may use or disclose your PHI as necessary to obtain payment for healthcare services when
      applicable.
    </p>

    <h3>Healthcare Operations</h3>
    <p>
      We may use and disclose PHI for healthcare operations necessary to maintain and improve our
      practice, including:
    </p>
    <ul>
      <li>Quality improvement activities</li>
      <li>Compliance activities</li>
      <li>Clinical supervision and review</li>
      <li>Auditing</li>
      <li>Security monitoring</li>
      <li>Risk management</li>
    </ul>

    <h2>Other Uses and Disclosures Permitted or Required by Law</h2>
    <p>
      We may use or disclose your PHI without your authorization when permitted or required by law,
      including circumstances involving:
    </p>
    <ul>
      <li>Public health activities</li>
      <li>Abuse or neglect reporting</li>
      <li>Serious threats to health or safety</li>
      <li>Court proceedings</li>
      <li>Law enforcement requests</li>
      <li>Health oversight activities</li>
      <li>Workers' compensation claims</li>
      <li>Other situations required or permitted by applicable law</li>
    </ul>

    <h2>Uses Requiring Your Authorization</h2>
    <p>Certain uses and disclosures of your PHI require your written authorization.</p>
    <p>
      You may revoke an authorization at any time in writing, except to the extent that we have already
      relied upon that authorization.
    </p>

    <h2>Journal Entries and Information Sharing Through the App</h2>
    <p>Your journal entries are private by default.</p>
    <p>You decide whether to share individual journal entries with your provider through the App.</p>
    <p>
      Only entries that you intentionally choose to share become accessible to your provider through the
      App.
    </p>
    <p>
      Once shared, a journal entry cannot be removed from the therapeutic record through the App. This
      supports accurate clinical documentation and continuity of care.
    </p>

    <h2>Therapeutic Relationship</h2>
    <p>
      Creating an account, downloading the App, or using the App does not by itself establish a
      psychologist-patient, therapist-patient, or healthcare provider relationship.
    </p>
    <p>
      A therapeutic relationship exists only after completion of the appropriate clinical intake process,
      informed consent, and acceptance into care by a licensed provider.
    </p>
    <p>
      For individuals receiving clinical services, the App may be used as a tool to support treatment but
      does not replace psychotherapy, direct communication with your provider, or clinical judgment.
    </p>

    <h2>Your Rights Regarding Your Protected Health Information</h2>

    <h3>Request Access</h3>
    <p>
      You may request access to your PHI maintained by Making Meaning Psychology, PLLC, subject to
      applicable legal limitations.
    </p>

    <h3>Request an Amendment</h3>
    <p>
      You may request that we correct or amend PHI that you believe is inaccurate or incomplete.
    </p>

    <h3>Request an Accounting of Disclosures</h3>
    <p>
      You may request a list of certain disclosures of your PHI made by us, as required by HIPAA.
    </p>

    <h3>Request Restrictions</h3>
    <p>You may request restrictions on certain uses or disclosures of your PHI.</p>
    <p>
      We are not required to agree to every request, but we will consider reasonable requests.
    </p>

    <h3>Request Confidential Communications</h3>
    <p>You may request that we communicate with you in a specific way or at a specific location.</p>

    <h3>Receive a Copy of This Notice</h3>
    <p>You may request a paper or electronic copy of this Notice at any time.</p>

    <h2>Our Commitment to Protecting Your Information</h2>
    <p>
      We use administrative, technical, and organizational safeguards designed to protect PHI, including:
    </p>
    <ul>
      <li>Secure authentication</li>
      <li>Encryption during transmission</li>
      <li>Role-based access controls</li>
      <li>Multi-factor authentication for provider accounts</li>
      <li>Access monitoring</li>
      <li>Security safeguards designed to limit unauthorized access</li>
    </ul>
    <p>
      While we take reasonable steps to protect your information, no electronic system can guarantee
      complete security.
    </p>

    <h2>No Emergency Monitoring</h2>
    <p>The App is not monitored continuously or in real time.</p>
    <p>
      Information entered into the App, including journal entries, mood tracking information, crisis
      plans, or other content, may not be reviewed immediately by your provider.
    </p>
    <p>The App is not an emergency service and should not be used to request urgent assistance.</p>
    <p>
      If you are experiencing a mental health emergency, believe you may harm yourself or someone else,
      or require immediate assistance:
    </p>
    <ul>
      <li>Call 911</li>
      <li>Contact the 988 Suicide &amp; Crisis Lifeline</li>
      <li>Go to the nearest emergency department</li>
    </ul>
    <p>Do not rely on the App to obtain emergency care or crisis intervention.</p>

    <h2>Breach Notification</h2>
    <p>
      If a breach of unsecured PHI occurs, we will provide notification as required by HIPAA and
      applicable law.
    </p>
    <p>
      Notifications will include information about what occurred, the information involved, steps you may
      take to protect yourself, and actions we are taking in response.
    </p>

    <h2>Complaints</h2>
    <p>
      If you believe your privacy rights have been violated, you may submit a complaint to us.
    </p>
    <p>You will not be penalized or retaliated against for filing a complaint.</p>
    <p>To submit a complaint:</p>
    <p>
      Privacy Officer
      <br />
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
    <p>You may also file a complaint with:</p>
    <p>
      U.S. Department of Health and Human Services
      <br />
      Office for Civil Rights
    </p>
    <p>Filing a complaint will not affect the quality of care you receive.</p>

    <h2>Changes to This Notice</h2>
    <p>We reserve the right to change this Notice at any time.</p>
    <p>
      Any revised Notice will apply to all PHI we maintain and will be made available through appropriate
      channels.
    </p>
    <p>The Effective Date listed above identifies the current version of this Notice.</p>
  </LegalPageLayout>
);

export default NoticeOfPrivacyPracticesPage;
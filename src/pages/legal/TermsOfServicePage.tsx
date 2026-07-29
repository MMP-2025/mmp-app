import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { EFFECTIVE_DATE, PRIVACY_CONTACT_EMAIL } from '@/lib/legal';

const TermsOfServicePage: React.FC = () => (
  <LegalPageLayout title="Terms of Service" version="tos-v1.0" effectiveDate={EFFECTIVE_DATE}>
    <p>
      <em>
        The official text of these Terms of Service is being finalized and will be published here in
        full, without modification, once provided by Making Meaning Psychology, PLLC.
      </em>
    </p>
    <p>For questions about these terms, please contact: {PRIVACY_CONTACT_EMAIL}.</p>
  </LegalPageLayout>
);

export default TermsOfServicePage;
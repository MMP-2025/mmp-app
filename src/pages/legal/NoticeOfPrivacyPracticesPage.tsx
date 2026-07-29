import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { EFFECTIVE_DATE, PRIVACY_CONTACT_EMAIL } from '@/lib/legal';

const NoticeOfPrivacyPracticesPage: React.FC = () => (
  <LegalPageLayout
    title="Notice of Privacy Practices"
    version="npp-v1.0"
    effectiveDate={EFFECTIVE_DATE}
  >
    <p>
      <em>
        The official text of this Notice of Privacy Practices is being finalized and will be published
        here in full, without modification, once provided by Making Meaning Psychology, PLLC.
      </em>
    </p>
    <p>
      For questions about how your protected health information is used or disclosed, please contact:{' '}
      {PRIVACY_CONTACT_EMAIL}.
    </p>
  </LegalPageLayout>
);

export default NoticeOfPrivacyPracticesPage;
export const LEGAL_DOCS = {
  privacy_policy: {
    id: 'privacy-v1.0',
    version: 'v1.0',
    title: 'Privacy Policy',
    route: '/privacy-policy',
  },
  notice_of_privacy_practices: {
    id: 'npp-v1.0',
    version: 'v1.0',
    title: 'Notice of Privacy Practices',
    route: '/notice-of-privacy-practices',
  },
  terms_of_service: {
    id: 'tos-v1.0',
    version: 'v1.0',
    title: 'Terms of Service',
    route: '/terms-of-service',
  },
} as const;

export const EFFECTIVE_DATE = '[Effective Date]';
export const PRIVACY_CONTACT_EMAIL = '[Privacy Contact Email]';

export type ConsentType = keyof typeof LEGAL_DOCS;

export const REQUIRED_SIGNUP_CONSENTS: ConsentType[] = [
  'privacy_policy',
  'terms_of_service',
  'notice_of_privacy_practices',
];
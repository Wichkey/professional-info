const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\d\s./-]{5,25}$/;

export const FIELDS = [
  {
    key: 'name',
    prompt: 'name:',
    label: 'Your name',
    type: 'text',
    autoComplete: 'name',
    maxLength: 120,
    validate: (v) => (v.trim() ? null : 'a name helps, type one and press enter'),
  },
  {
    key: 'email',
    prompt: 'email:',
    label: 'Your email address',
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
    maxLength: 200,
    validate: (v) => (EMAIL_PATTERN.test(v.trim()) ? null : "that doesn't look like an email, try again"),
  },
  {
    key: 'phone',
    prompt: 'phone (optional, enter to skip):',
    label: 'Your phone number, optional',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
    maxLength: 25,
    optional: true,
    validate: (v) => (!v.trim() || PHONE_PATTERN.test(v.trim()) ? null : 'digits, spaces and + only, or leave it empty'),
  },
  {
    key: 'message',
    prompt: 'message:',
    label: 'Your message',
    multiline: true,
    maxLength: 4000,
    validate: (v) => (v.trim().length >= 2 ? null : 'the message is empty, tell me what you have in mind'),
  },
];

export const CONFIRM_STEP = FIELDS.length;

export const EMPTY_VALUES = Object.fromEntries(FIELDS.map((f) => [f.key, '']));

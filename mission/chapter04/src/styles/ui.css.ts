import { style } from '@vanilla-extract/css';

export const home = style({
  minHeight: '100vh',
  padding: '2rem 1.5rem',
  maxWidth: '28rem',
  margin: '0 auto',
});

export const homeTitle = style({
  margin: '0 0 0.75rem',
  fontSize: '1.5rem',
});

export const homeDesc = style({
  margin: '0 0 1.5rem',
  lineHeight: 1.6,
  color: '#4e5968',
});

export const homeSessionCard = style({
  marginBottom: '1.25rem',
  padding: '0.875rem 1rem',
  background: '#fff',
  border: '1px solid #e5e8eb',
  borderRadius: '12px',
});

export const homeSessionTitle = style({
  margin: '0 0 0.5rem',
  fontSize: '0.9rem',
  fontWeight: 700,
});

export const homeSessionMeta = style({
  margin: '0.25rem 0',
  color: '#4e5968',
  fontSize: '0.8125rem',
});

export const homeActionButton = style({
  marginTop: '0.75rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#4e5968',
  cursor: 'pointer',
  background: '#f2f4f6',
  border: '1px solid #d1d6db',
  borderRadius: '8px',
});

export const homeNav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const homeLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 1.25rem',
  fontWeight: 600,
  color: '#fff',
  textDecoration: 'none',
  background: '#3182f6',
  borderRadius: '12px',
  selectors: {
    '&:hover': {
      filter: 'brightness(1.05)',
    },
  },
});

export const homeLinkSecondary = style({
  color: '#3182f6',
  background: '#fff',
  border: '1px solid #d1d6db',
  selectors: {
    '&:hover': {
      background: '#f9fafb',
    },
  },
});

export const login = style({
  minHeight: '100vh',
  background: '#fff',
});

export const loginHeader = style({
  display: 'flex',
  alignItems: 'center',
  height: '3.25rem',
  padding: '0 0.5rem',
  borderBottom: '1px solid #e5e8eb',
});

export const loginBack = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  fontSize: '1.25rem',
  color: '#191f28',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  borderRadius: '8px',
  selectors: {
    '&:hover': {
      background: '#f2f4f6',
    },
  },
});

export const loginMain = style({
  padding: '1.5rem 1.25rem 2rem',
  maxWidth: '22rem',
  margin: '0 auto',
});

export const loginHeading = style({
  margin: '0 0 0.35rem',
  fontSize: '1.375rem',
  fontWeight: 700,
});

export const loginSubtitle = style({
  margin: '0 0 1.75rem',
  fontSize: '0.9375rem',
  color: '#8b95a1',
});

export const loginForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});

export const loginField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const loginLabel = style({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#4e5968',
});

export const loginInput = style({
  width: '100%',
  padding: '0.875rem 1rem',
  fontSize: '1rem',
  color: '#191f28',
  background: '#f9fafb',
  border: '1px solid #e5e8eb',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  selectors: {
    '&::placeholder': {
      color: '#b0b8c1',
    },
    '&:focus': {
      borderColor: '#3182f6',
      boxShadow: '0 0 0 3px rgba(49, 130, 246, 0.15)',
    },
  },
});

export const loginInputError = style({
  borderColor: '#f04452',
  background: '#fff5f5',
  selectors: {
    '&:focus': {
      borderColor: '#f04452',
      boxShadow: '0 0 0 3px rgba(240, 68, 82, 0.12)',
    },
  },
});

export const loginInputRow = style({
  display: 'flex',
  alignItems: 'stretch',
});

export const loginInputWithAction = style({
  flex: 1,
  minWidth: 0,
  paddingRight: '0.5rem',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 'none',
  selectors: {
    [`${loginInputRow}:focus-within &`]: {
      borderColor: '#3182f6',
      boxShadow: 'none',
    },
    [`${loginInputRow}:focus-within &:focus`]: {
      boxShadow: 'none',
    },
    [`${loginInputRow}:focus-within &${loginInputError}`]: {
      borderColor: '#f04452',
    },
  },
});

export const loginVisibilityButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '3rem',
  padding: 0,
  color: '#8b95a1',
  cursor: 'pointer',
  background: '#f9fafb',
  border: '1px solid #e5e8eb',
  borderLeft: 'none',
  borderRadius: '0 10px 10px 0',
  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
  selectors: {
    [`${loginInputRow}:focus-within &`]: {
      borderColor: '#3182f6',
    },
    '&:hover': {
      color: '#4e5968',
      background: '#f2f4f6',
    },
  },
});

export const loginVisibilityButtonError = style({
  borderColor: '#f04452',
  background: '#fff5f5',
});

export const loginError = style({
  margin: 0,
  fontSize: '0.8125rem',
  lineHeight: 1.4,
  color: '#f04452',
});

export const loginSubmit = style({
  marginTop: '0.5rem',
  width: '100%',
  padding: '1rem',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  background: '#3182f6',
  border: 'none',
  borderRadius: '12px',
  transition: 'filter 0.15s, opacity 0.15s',
  selectors: {
    '&:hover:not(:disabled)': {
      filter: 'brightness(1.06)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
  },
});

export const signupEmailSummary = style({
  margin: '0 0 1.25rem',
  padding: '0.65rem 0.85rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#4e5968',
  wordBreak: 'break-all',
  background: '#f2f4f6',
  borderRadius: '10px',
});

export const signupAvatar = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
});

export const signupAvatarCircle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '5.5rem',
  height: '5.5rem',
  fontSize: '1.75rem',
  fontWeight: 300,
  color: '#b0b8c1',
  cursor: 'default',
  background: '#e5e8eb',
  border: '2px dashed #d1d6db',
  borderRadius: '50%',
});

export const signupAvatarIcon = style({
  lineHeight: 1,
});

export const signupAvatarHint = style({
  fontSize: '0.75rem',
  color: '#8b95a1',
});

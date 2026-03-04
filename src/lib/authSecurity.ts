export const OTP_ALLOWED_LENGTHS = [6, 8] as const;
export const OTP_MAX_LENGTH = Math.max(...OTP_ALLOWED_LENGTHS);
export const MIN_SIGNUP_FILL_MS = 3000;
export const SIGNUP_WINDOW_MS = 30 * 60 * 1000;
export const SIGNUP_MAX_ATTEMPTS = 3;
export const RESEND_COOLDOWN_MS = 60 * 1000;

const SIGNUP_ATTEMPTS_STORAGE_KEY = "imobiflow.auth.signup-attempts";
const commonWeakPatterns = /(123456|123123|abcdef|qwerty|password|senha|admin)/i;

type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "Pelo menos 10 caracteres",
    test: (password) => password.length >= 10,
  },
  {
    id: "uppercase",
    label: "Uma letra maiuscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Uma letra minuscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Um numero",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Um caractere especial",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const isBrowser = typeof window !== "undefined";

const readStoredAttempts = () => {
  if (!isBrowser) return [];

  try {
    const storedValue = window.localStorage.getItem(SIGNUP_ATTEMPTS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter((timestamp): timestamp is number => typeof timestamp === "number");
  } catch {
    return [];
  }
};

const persistAttempts = (attempts: number[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(SIGNUP_ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
};

const pruneAttempts = (attempts: number[], now: number) =>
  attempts.filter((timestamp) => now - timestamp < SIGNUP_WINDOW_MS);

export const getSignupRateLimit = (now = Date.now()) => {
  const attempts = pruneAttempts(readStoredAttempts(), now);
  persistAttempts(attempts);

  const remaining = Math.max(0, SIGNUP_MAX_ATTEMPTS - attempts.length);
  const retryAfterMs =
    attempts.length >= SIGNUP_MAX_ATTEMPTS
      ? Math.max(0, SIGNUP_WINDOW_MS - (now - attempts[0]))
      : 0;

  return {
    attempts,
    remaining,
    retryAfterMs,
    blocked: remaining === 0,
  };
};

export const registerSignupAttempt = (now = Date.now()) => {
  const current = pruneAttempts(readStoredAttempts(), now);
  const nextAttempts = [...current, now];
  persistAttempts(nextAttempts);

  return getSignupRateLimit(now);
};

export const resetSignupAttempts = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(SIGNUP_ATTEMPTS_STORAGE_KEY);
};

export const getPasswordRuleResults = (password: string) =>
  passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));

export const getStrongPasswordError = (password: string, email: string) => {
  const failedRule = getPasswordRuleResults(password).find((rule) => !rule.passed);
  if (failedRule) return failedRule.label;

  const emailPrefix = email.trim().split("@")[0]?.toLowerCase();
  if (emailPrefix && emailPrefix.length >= 3 && password.toLowerCase().includes(emailPrefix)) {
    return "A senha nao pode conter o e-mail";
  }

  if (commonWeakPatterns.test(password)) {
    return "Use uma senha menos previsivel";
  }

  return null;
};

export const normalizeOtp = (value: string) => value.replace(/\D/g, "").slice(0, OTP_MAX_LENGTH);

export const isAllowedOtpLength = (value: string) => OTP_ALLOWED_LENGTHS.includes(value.length as (typeof OTP_ALLOWED_LENGTHS)[number]);

export const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.ceil(Math.max(0, milliseconds) / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) {
    return `${minutes}min`;
  }

  return `${minutes}min ${seconds}s`;
};

export const formatAuthError = (message: string) => {
  if (/email not confirmed/i.test(message)) {
    return "Seu e-mail ainda nao foi confirmado. Digite o codigo enviado para concluir o cadastro.";
  }

  if (/invalid login credentials/i.test(message)) {
    return "E-mail ou senha invalidos.";
  }

  if (/token has expired|otp expired|token is invalid|otp is invalid/i.test(message)) {
    return "Codigo invalido ou expirado. Solicite um novo codigo.";
  }

  if (/rate limit/i.test(message)) {
    return "Voce atingiu o limite de tentativas. Aguarde alguns minutos antes de tentar novamente.";
  }

  if (/captcha/i.test(message)) {
    return "A verificacao anti-bot falhou. Recarregue o captcha e tente novamente.";
  }

  return message;
};

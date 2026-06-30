export enum AuthErrorCode {
  RATE_LIMIT_IP = "RATE_LIMIT_IP",
  RATE_LIMIT_ACCOUNT = "RATE_LIMIT_ACCOUNT",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  UNKNOWN = "UNKNOWN",
}

/**
 * 
 * @param code - Error code from AuthErrorCode enum or string from server
 * @returns Localized error message
 */
export function getAuthErrorMessage(code: AuthErrorCode | string): string {
  switch (code) {
    case AuthErrorCode.RATE_LIMIT_IP:
      return "Слишком много попыток входа с вашего IP. Попробуйте позже.";
    case AuthErrorCode.RATE_LIMIT_ACCOUNT:
      return "Слишком много попыток входа для этого аккаунта. Попробуйте позже.";
    case AuthErrorCode.INVALID_CREDENTIALS:
      return "Неверный логин или пароль";
    case AuthErrorCode.UNKNOWN:
    default:
      return "Произошла ошибка. Попробуйте позже.";
  }
}

import { AxiosError } from 'axios';

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as AxiosError<{ message?: string }>;
  if (ax.response?.data?.message) return ax.response.data.message;
  if (ax.code === 'ERR_NETWORK' || !ax.response) {
    return 'Cannot reach the API. On Vercel, set BACKEND_URL to your live Spring API (e.g. Render) and redeploy.';
  }
  return fallback;
}

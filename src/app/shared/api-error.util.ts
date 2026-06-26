import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ApiError } from '../interfaces/api-error.interface';

export function extractErrorMessage(
  error: HttpErrorResponse,
  fallback: string
): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor';
  }
  if (error.status === 429) {
    return error.error?.error || 'Demasiados intentos, intenta más tarde';
  }
  const apiError = error.error as ApiError | undefined;
  return apiError?.error || fallback;
}

export function applyValidationErrors(
  form: FormGroup,
  error: HttpErrorResponse
): boolean {
  const apiError = error.error as ApiError | undefined;
  if (error.status !== 400 || !apiError?.details?.length) {
    return false;
  }
  for (const detail of apiError.details) {
    const control = form.get(detail.path);
    if (control) {
      control.setErrors({ ...control.errors, backend: detail.message });
      control.markAsTouched();
    }
  }
  return true;
}

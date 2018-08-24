export const ENABLE_ONBOARDED = 'ENABLE_ONBOARDED';
export const DISABLE_ONBOARDED = 'DISABLE_ONBOARDED';

export function enableOnboarded(onboarded) {
  return {
    type: ENABLE_ONBOARDED,
    payload: onboarded,
  };
}

export function disableOnboarded(onboarded) {
  return {
    type: DISABLE_ONBOARDED,
    payload: onboarded,
  }
}
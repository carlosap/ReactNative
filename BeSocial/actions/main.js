export const UPDATE_SCREEN = 'UPDATE_SCREEN';

export function updateScreen(screen) {
  return {
    type: UPDATE_SCREEN,
    payload: screen,
  }
}
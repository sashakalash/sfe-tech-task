import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

const SNACK_BAR_DEFAULT_VERTICAL_POSITION: MatSnackBarVerticalPosition = 'top';
const SNACK_BAR_DEFAULT_HORIZONTAL_POSITION: MatSnackBarHorizontalPosition =
  'right';
const SNACK_BAR_DEFAULT_DURATION = 5000;
export const SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
  verticalPosition: SNACK_BAR_DEFAULT_VERTICAL_POSITION,
  horizontalPosition: SNACK_BAR_DEFAULT_HORIZONTAL_POSITION,
  duration: SNACK_BAR_DEFAULT_DURATION,
};

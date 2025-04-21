import { FormControl } from '@angular/forms';

import { userNameValidator } from './user-name.validator';

describe('userNameValidator', () => {
  const validator = userNameValidator();

  it('should return null if value is empty', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return null if value does not contain "test"', () => {
    const control = new FormControl('helloWorld');
    expect(validator(control)).toBeNull();
  });

  it('should return error object if value contains "test"', () => {
    const control = new FormControl('test');
    expect(validator(control)).toEqual({
      containsTest: { value: 'test' },
    });
  });

  it('should be case-insensitive', () => {
    const control = new FormControl('TeSt123');
    expect(validator(control)).toEqual({
      containsTest: { value: 'TeSt123' },
    });
  });
});

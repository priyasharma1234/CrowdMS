import { NumberUnderscorePipe } from './number-underscore.pipe';

describe('NumberUnderscorePipe', () => {
  it('create an instance', () => {
    const pipe = new NumberUnderscorePipe();
    expect(pipe).toBeTruthy();
  });
});

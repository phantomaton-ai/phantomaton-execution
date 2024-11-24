import { expect } from 'lovecraft';
import defaults from './defaults.js';

describe('Execution Defaults', () => {
  it('provides default configuration values', () => {
    expect(defaults.header).to.equal('Command execution');
    expect(defaults.message).to.equal('Executable commands are available in this environment.');
    expect(defaults.symbols.directive.start).to.equal('🪄✨ ');
    expect(defaults.symbols.directive.end).to.equal('⚡️');
  });
});
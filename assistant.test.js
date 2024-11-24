import { expect, stub } from 'lovecraft';
import necronomicon from 'necronomicon';
import Assistant from './assistant.js';

describe('Execution Assistant', () => {
  it('prepends execution results to subsequent messages', async () => {
    const spellbook = {
      execute: (text) => `Preamble: ${text}`
    };
    const assistant = {
      converse: (turns, message) => `Response: ${message}`
    };
    const decorated = new Assistant(spellbook, assistant);

    expect(await decorated.converse(['turn1'], 'Hello'))
      .to.equal('Response: Hello');
    expect(await decorated.converse(['turn1'], 'Hello'))
      .to.equal('Response: Preamble: Response: Hello\n\n---\n\nHello');
  });
});
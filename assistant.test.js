import { expect, stub } from 'chai';
import necronomicon from 'necronomicon';
import Assistant from './assistant.js';

describe('Execution Assistant', () => {
  it('prepends the preamble to the message', async () => {
    const spellbook = {
      execute: (text) => `Preamble: ${text}`
    };
    const assistant = {
      converse: (turns, message) => `Response: ${message}`
    };
    const executionAssistant = new Assistant(spellbook, assistant);

    const response = await executionAssistant.converse(['turn1'], 'Hello');
    expect(response).to.equal('Response: Preamble: Hello');
  });

  it('updates the preamble from the executed response', async () => {
    const spellbookStub = stub(necronomicon.prototype, 'execute').returns('Preamble updated');
    const assistant = {
      converse: (turns, message) => `Response: ${message}`
    };
    const executionAssistant = new Assistant({}, assistant);

    const response = await executionAssistant.converse(['turn1'], 'Hello');
    expect(executionAssistant.preamble).to.equal('Preamble updated');

    spellbookStub.restore();
  });
});
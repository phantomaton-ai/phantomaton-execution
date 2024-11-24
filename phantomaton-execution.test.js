import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';

import plugin from './phantomaton-execution.js';

describe('Phantomaton Execution Plugin', () => {
  it('provides the system prompt from the executioner', () => {
    const container = hierophant.create(phantomaton);
    const [getPrompt] = container.resolve(system.prompt.resolve);
    const prompt = getPrompt();
    expect(prompt).to.contain('# Command execution');
  });

  it('binds the executioner assistant to the conversation', () => {
    const container = hierophant.create(phantomaton);
    const [getAssistant] = container.resolve(conversations.assistant.resolve);
    const assistant = getAssistant();
    const response = assistant.converse([], 'Hello');
    expect(response).to.contain('Response:');
  });
});
import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import conversations from 'phantomaton-conversations';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

import Assistant from './assistant.js';
import execution from './phantomaton-execution.js';

describe('Phantomaton Execution Plugin', () => {
  let container;

  beforeEach(() => {
    container = hierophant();
    container.install(plugins.input.resolver());
    container.install(plugins.input.provider([], () => () => 'test'));
    [conversations, system, execution].forEach(plugin => {
      plugin().install.forEach(c => container.install(c));
    });
  });

  it('provides the system prompt from the executioner', () => {
    const [getPrompt] = container.resolve(system.system.resolve);
    const prompt = getPrompt();
    expect(prompt).to.contain('# Command execution');
  });

  it('binds the executioner assistant to the conversation', () => {
    const [assistant] = container.resolve(conversations.assistant.resolve);
    expect(assistant).instanceOf(Assistant);
  });
});


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

  describe('Command Execution', () => {
    let converse;

    beforeEach(() => {
      converse = stub();
      container.install(conversations.assistant.provider(
        [],
        () => ({converse})
      ));
    });
    
    it('can execute a registered command', async () => {
      container.install(
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      );
      converse.resolves('🪄✨ capitalize(text:hello)')

      const [assistant] = container.resolve(conversations.assistant.resolve);
      const result = await assistant.converse([], 'Hi friend...');

      expect(assistant.preamble).to.contain('HELLO');
    });

    it('can execute multiple registered commands', async () => {
      // Create a mock base assistant that captures the conversation
      container.install(
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      );
      container.install(
        plugins.define(execution.command).as({
          name: 'reverse',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.split('').reverse().join(''),
          example: { attributes: { text: 'hello' } },
          description: 'Reverses text'
        })
      );

      converse.resolves([
        '🪄✨ capitalize(text:hello)',
        '🪄✨ reverse(text:hello)'
      ].join('\n'));

      const [assistant] = container.resolve(conversations.assistant.resolve);
      const result = await assistant.converse([], 'Hi friend...');

      expect(assistant.preamble).to.contain('HELLO');
      expect(assistant.preamble).to.contain('olleh');
    });
  });
});
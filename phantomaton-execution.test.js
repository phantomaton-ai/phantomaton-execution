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
    it('can execute a registered command', async () => {
      // Create a mock base assistant that captures the conversation
      const mockAssistant = {
        async converse(turns, message) {
          return message;
        }
      };

      // Register a command plugin
      const commandPlugin = plugins.create([
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      ]);

      // Resolve the enhanced assistant
      const [decoratedAssistant] = container
        .install(commandPlugin)
        .resolve(conversations.assistant.resolve);

      // Simulate a conversation with a command
      const result = await decoratedAssistant.converse([], 
        'Please capitalize the text: ${capitalize(text: hello)}'
      );

      // Verify the command was executed
      expect(decoratedAssistant.preamble).to.equal('HELLO');
    });

    it('can execute multiple registered commands', async () => {
      // Create a mock base assistant that captures the conversation
      const mockAssistant = {
        async converse(turns, message) {
          return message;
        }
      };

      // Register multiple command plugins
      const multiCommandPlugin = plugins.create([
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        }),
        plugins.define(execution.command).as({
          name: 'reverse',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.split('').reverse().join(''),
          example: { attributes: { text: 'hello' } },
          description: 'Reverses text'
        })
      ]);

      // Resolve the enhanced assistant
      const [decoratedAssistant] = container
        .install(multiCommandPlugin)
        .resolve(conversations.assistant.resolve);

      // Simulate a conversation with multiple commands
      const result = await decoratedAssistant.converse([], 
        'Please process: ${capitalize(text: hello)} and ${reverse(text: world)}'
      );

      // Verify the commands were executed
      expect(decoratedAssistant.preamble).to.equal('HELLO\nworld');
    });
  });
});
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

  describe('Command Registration', () => {
    it('allows registering a single command', () => {
      const commandPlugin = plugins.create([
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      ]);

      const commands = commandPlugin.extensions.commands();
      expect(commands).to.have.lengthOf(1);
      
      const registeredCommand = commands[0]();
      expect(registeredCommand.name).to.equal('capitalize');
      expect(registeredCommand.execute({ text: 'hello' })).to.equal('HELLO');
    });

    it('allows registering multiple commands', () => {
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

      const commands = multiCommandPlugin.extensions.commands();
      expect(commands).to.have.lengthOf(2);
      
      const [capitalizeCommand, reverseCommand] = commands.map(cmd => cmd());
      
      expect(capitalizeCommand.name).to.equal('capitalize');
      expect(reverseCommand.name).to.equal('reverse');
      
      expect(capitalizeCommand.execute({ text: 'hello' })).to.equal('HELLO');
      expect(reverseCommand.execute({ text: 'hello' })).to.equal('olleh');
    });

    it('validates command inputs', () => {
      const validationPlugin = plugins.create([
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      ]);

      const commands = validationPlugin.extensions.commands();
      const command = commands[0]();
      
      expect(() => command.execute({})).to.throw(Error);
    });
  });
});
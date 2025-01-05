import { expect } from 'chai';
import plugins from 'phantomaton-plugins';
import execution from './phantomaton-execution.js';

describe('Phantomaton Execution', () => {
  describe('Command Registration', () => {
    it('should register a single command', () => {
      const singleCommandPlugin = plugins.create([
        plugins.define(execution.command).as({
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        })
      ]);

      const commands = singleCommandPlugin.extensions.commands();
      expect(commands).to.have.lengthOf(1);
      
      const registeredCommand = commands[0]();
      expect(registeredCommand.name).to.equal('capitalize');
      expect(registeredCommand.execute({ text: 'hello' })).to.equal('HELLO');
    });

    it('should register multiple commands', () => {
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

    it('should validate command inputs', () => {
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
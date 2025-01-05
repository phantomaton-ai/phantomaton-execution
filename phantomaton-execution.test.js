import test from 'node:test';
import assert from 'node:assert';
import plugins from 'phantomaton-plugins';
import execution from './phantomaton-execution.js';

test('Phantomaton Execution Command Registration', async (t) => {
  await t.test('Single command registration', () => {
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
    assert.strictEqual(commands.length, 1, 'Should register exactly one command');
    
    const registeredCommand = commands[0]();
    assert.strictEqual(registeredCommand.name, 'capitalize', 'Command name should match');
    assert.strictEqual(
      registeredCommand.execute({ text: 'hello' }), 
      'HELLO', 
      'Command should execute correctly'
    );
  });

  await t.test('Multiple command registration', () => {
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
    assert.strictEqual(commands.length, 2, 'Should register two commands');
    
    const [capitalizeCommand, reverseCommand] = commands.map(cmd => cmd());
    
    assert.strictEqual(capitalizeCommand.name, 'capitalize', 'First command name should match');
    assert.strictEqual(reverseCommand.name, 'reverse', 'Second command name should match');
    
    assert.strictEqual(
      capitalizeCommand.execute({ text: 'hello' }), 
      'HELLO', 
      'First command should execute correctly'
    );
    assert.strictEqual(
      reverseCommand.execute({ text: 'hello' }), 
      'olleh', 
      'Second command should execute correctly'
    );
  });

  await t.test('Command validation', () => {
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
    
    assert.throws(
      () => command.execute({}), 
      Error, 
      'Should throw an error when validation fails'
    );
  });
});
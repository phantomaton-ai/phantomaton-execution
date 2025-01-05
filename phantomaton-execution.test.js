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
    assert.strictEqual(commands.length, 1);
    assert.strictEqual(commands[0]().name, 'capitalize');
  });

  await t.test('Multiple command registration', () => {
    const multiCommandPlugin = plugins.create([
      plugins.define(execution.commands).as([
        {
          name: 'capitalize',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.toUpperCase(),
          example: { attributes: { text: 'Test' } },
          description: 'Capitalizes text'
        },
        {
          name: 'reverse',
          validate: (attributes) => !!attributes.text,
          execute: (attributes) => attributes.text.split('').reverse().join(''),
          example: { attributes: { text: 'hello' } },
          description: 'Reverses text'
        }
      ])
    ]);

    const commands = multiCommandPlugin.extensions.commands();
    assert.strictEqual(commands.length, 2);
    assert.strictEqual(commands[0]().name, 'capitalize');
    assert.strictEqual(commands[1]().name, 'reverse');
  });
});
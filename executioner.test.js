import { expect, stub } from 'chai';
import necronomicon from 'necronomicon';
import Executioner from './executioner.js';
import defaults from './defaults.js';

describe('Executioner', () => {
  it('provides a prompt with documentation', () => {
    const documentStub = stub(necronomicon.prototype, 'document').returns('# Commands\nCommand 1\nCommand 2');
    const executioner = new Executioner(defaults, { commands: [] });
    const prompt = executioner.prompt();

    expect(prompt).to.contain('# Command execution');
    expect(prompt).to.contain('Executable commands are available in this environment.');
    expect(prompt).to.contain('# Commands');
    expect(prompt).to.contain('Command 1');
    expect(prompt).to.contain('Command 2');

    documentStub.restore();
  });

  it('creates an assistant with the executioner context', () => {
    const executioner = new Executioner(defaults, { commands: [] });
    const assistant = executioner.assistant({
      converse: (turns, message) => `Response: ${message}`
    });

    const response = assistant.converse([], 'Hello');
    expect(response).to.equal('Response: Hello');
  });
});
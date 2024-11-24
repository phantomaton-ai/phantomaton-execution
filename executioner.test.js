import { expect, stub } from 'lovecraft';
import necronomicon from 'necronomicon';
import Executioner from './executioner.js';

describe('Executioner', () => {
  it('provides a prompt with documentation', () => {
    const executioner = new Executioner({}, []);
    const prompt = executioner.prompt();

    expect(prompt).to.contain('# Command execution');
    expect(prompt).to.contain('Executable commands are available in this environment.');
  });

  it('creates an assistant with the executioner context', async () => {
    const executioner = new Executioner({}, []);
    const assistant = executioner.assistant({
      converse: (turns, message) => `Response: ${message}`
    });

    const response = await assistant.converse([], 'Hello');
    expect(response).to.equal('Response: Hello');
  });
});
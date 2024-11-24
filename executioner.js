import necronomicon from 'necronomicon';

const defaults = {
  header: 'Command execution',
  message: 'Executable commands are available in this environment.'
}

export default class Executioner {
  constructor({ header, message, symbols }, commands) {
    const { header, message, symbols } = { ...defaults, ...options };
    this.header = header;
    this.message = message;
    this.spellbook = necronomicon({ symbols, commands });
  }

  prompt() {
    const documentation = this.spellbook.document();
    const shifted = documentation.split('\n').map(
      line => line.startsWith('#') ? `#${line}` : line
    ).join('\n');
    return [`# ${this.header}`, this.message, shifted].join('\n\n');
  }
}

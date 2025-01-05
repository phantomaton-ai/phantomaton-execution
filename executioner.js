import necronomicon from 'necronomicon';

import Assistant from './assistant.js';
import defaults from './defaults.js';

export default class Executioner {
  constructor(options, commands) {
    const { header, message, symbols } = { ...defaults, ...options };
    this.header = header;
    this.message = message;
    this.spellbook = necronomicon({ symbols, commands, includes: { text: false } });
  }

  prompt() {
    const documentation = this.spellbook.document();
    const shifted = documentation.split('\n').map(
      line => line.startsWith('#') ? `#${line}` : line
    ).join('\n');
    return [`# ${this.header}`, this.message, shifted].join('\n\n');
  }

  assistant(assistant) {
    return new Assistant(this.spellbook, assistant);
  }
}

export default class Assistant {
  constructor(spellbook, assistant) {
    this.spellbook = spellbook;
    this.assistant = assistant;
    this.preamble = '';
  }

  async converse(turns, message) {
    if (this.preamble.length > 0) {
      message = [this.preamble, message].join('\n\n---\n\n');
    }
    const reply = await this.assistant.converse(turns, message);
    this.preamble = this.spellbook.execute(reply);
    return reply;
  }
}

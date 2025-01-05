import conversations from 'phantomaton-conversations';
import system from 'phantomaton-system';
import plugins from 'phantomaton-plugins';

import Executioner from './executioner.js';

export default plugins.create(
  { command: plugins.composite, executioner: plugins.singleton },
  ({ configuration, extensions, instance }) => [
    extensions.command.aggregator(
      [],
      () => (commands) => [commands]
    ),
    plugins.define(extensions.executioner)
      .with(extensions.command)
      .as(commands => new Executioner(configuration, commands || [])),
    system.system.provider(
      [extensions.executioner.resolve],
      ([executioner]) => () => executioner.prompt()
    ),
    conversations.assistant.decorator(
      [extensions.executioner.resolve],
      ([executioner]) => assistant => executioner.assistant(assistant)
    )
  ]
);

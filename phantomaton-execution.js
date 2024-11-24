import conversations from 'phantomaton-conversations';
import system from 'phantomaton-system';
import plugins from 'phantomaton-plugins';

import Executioner from './executioner.js';

export default plugins.create(
  { commands: plugins.composite, executionor: plugins.singleton },
  ({ configuration, extensions, instance }) => [
    plugins.define(extensions.executionor)
      .with(extensions.commands)
      .as(commands => new Executioner(configuration, commands)),
    plugins.define(system.system).with(extensions.executionor).as(
      executionor => () => executionor.prompt()
    ),
    conversations.assistant.decorator(
      [extensions.executioner.resolve],
      executioner => assistant => executioner.assistant(assistant)
    )
  ]
);

# Phantomaton Execution ⚙️

The Phantomaton Execution module is a plugin for the [Phantomaton](https://github.com/phantomaton-ai/phantomaton) AI framework. It provides a robust and extensible infrastructure for registering and executing commands within the Phantomaton conversational ecosystem.

## Purpose 🎯

Phantomaton is designed to be a highly interactive and responsive AI assistant, capable of performing a variety of tasks beyond just conversing. The Phantomaton Execution plugin enables this by allowing developers to register executable commands that can be invoked by the LLM-powered Assistant.

When a registered command is detected in the user's input, the Phantomaton Execution plugin will execute the corresponding command and prepend the result to the Assistant's response. This allows the Phantomaton system to seamlessly integrate task-oriented functionality directly into the conversational flow.

## Features 🔧

- **Command Registration**: Developers can register commands using the [Phantomaton Plugins](https://github.com/phantomaton-ai/phantomaton-plugins) framework, providing a simple and extensible way to add new capabilities.
- **Command Documentation**: Registered commands are automatically documented and included in the system prompt, making it easy for users to discover and utilize the available functionality.
- **Preamble Injection**: The results of executed commands are prepended to the Assistant's responses, maintaining the conversational context and flow.
- **Sandboxing**: Command execution is performed in a secure sandbox, preventing harmful or unintended behavior from affecting the broader Phantomaton system.

## Usage 🛠️

To use the Phantomaton Execution plugin, you'll need to install it as a dependency in your Phantomaton-based application:

```bash
npm install phantomaton-execution
```

Once installed, you can import and configure the plugin:

```javascript
import execution from 'phantomaton-execution';

const container = execution.create({
  // Provide any necessary configuration options
});

// Resolve the execution-related extension points
const [getPrompt] = container.resolve(system.prompt.resolve);
const [getAssistant] = container.resolve(conversations.assistant.resolve);

// The system prompt will now include documentation for registered commands
const prompt = getPrompt();

// The Assistant will automatically execute registered commands
const response = await getAssistant().converse(['user input'], 'Hello');
```

For more information on extending the Phantomaton Execution plugin, please refer to the [Phantomaton Plugins documentation](https://github.com/phantomaton-ai/phantomaton-plugins#readme).

## Contributing 🤝

We welcome contributions to the Phantomaton Execution project! If you have any ideas, bug reports, or pull requests, please feel free to submit them on the [Phantomaton Execution GitHub repository](https://github.com/phantomaton-ai/phantomaton-execution).

## License 📜

The Phantomaton Execution module is licensed under the [MIT License](LICENSE).
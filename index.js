const { React, WebpackModules, Patcher, DiscordModules, PluginUtilities, Logger, Plugin } = window;
const { Commands, MessageStore } = DiscordModules;

class SentCountPlugin extends Plugin {
  onStart() {
    this.registerCommand();
  }

  onStop() {
    this.unregisterCommand();
  }

  registerCommand() {
    this.command = {
      id: "sent",
      applicationId: "client",
      type: 1,
      name: "sent",
      description: "Count messages sent by a user in this channel",
      displayName: "sent",
      options: [
        {
          name: "by",
          description: "User to count messages for",
          type: 6, // USER type
          required: true,
        },
      ],
      execute: this.handleCommand.bind(this),
    };
    Commands.registerCommand(this.command);
  }

  unregisterCommand() {
    Commands.unregisterCommand(this.command.id);
  }

  async handleCommand({ args, channelId, respond }) {
    const userToCount = args.by;

    // Get cached messages from MessageStore for the current channel
    const messages = MessageStore.getMessages(channelId);

    const count = messages.filter(m => m.author.id === userToCount.id).length;

    respond({
      content: `📊 Messages sent by ${userToCount.username} in this channel: **${count}**`,
      ephemeral: true,
    });
  }
}

module.exports = SentCountPlugin;

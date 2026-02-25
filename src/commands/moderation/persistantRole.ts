import {
  GuildMember,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';
import { PersisantRoles } from '../../constants';
import { persistantRoleHandler } from '../../handlers/persistantRoleHandler';

const PersistantRole: Command = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Set a persistant role to a uyser')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName('user').setDescription('User to set the role on').setRequired(true))
    .addStringOption((option) =>
      option.setName('role')
      .setDescription('Role to assign')
      .setRequired(true)
      .setChoices(
        Object.entries(PersisantRoles).map(([name, id]) => ({
          name: name,
          value: name,
        }))
      )
    )
    .addBooleanOption((option) => option.setName('add').setDescription('Add or Remove the role').setRequired(true)),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', flags: MessageFlags.Ephemeral });
      return;
    }

    const memberOption = interaction.options.getMember('user');
    const member = memberOption as GuildMember | null;

    if (!member) {
      await interaction.reply({ content: 'User not found.', flags: MessageFlags.Ephemeral });
      return;
    }

    const roleOption = interaction.options.getString('role');
    const role = PersisantRoles[roleOption as keyof typeof PersisantRoles];

    if (!role) {
      await interaction.reply({ content: 'Role not found.', flags: MessageFlags.Ephemeral });
      return;
    }

    const addRole = interaction.options.getBoolean('add');

    try {
      await persistantRoleHandler(interaction.guild, member.id, role, addRole ? 'add' : 'remove');
      await interaction.reply({ content: `${member.user.tag} has been ${addRole ? 'added' : 'removed'} the role ${role}` });
    } catch (error) {
      logger.error(error);
      await interaction.reply({ content: 'Failed to set role to user the user.', flags: MessageFlags.Ephemeral });
    }
  },
};

export default PersistantRole;

import { DiscordAPIError, type Guild } from 'discord.js';
import { PersisantRoles } from '../constants';
import logger from '../utils/logger';
import db, { formatDate } from '../utils/db';
import { persistentRoles, user } from '../utils/db/schema';
import { and, eq } from 'drizzle-orm';

export async function persistantRoleHandler(guild: Guild, userid: string, roleKey: keyof typeof PersisantRoles, action: "add" | "remove") {
    const roleId = PersisantRoles[roleKey];
    if (!roleId) {
        throw new Error(`Role ID for key "${roleKey}" not found in constants.`);
    }

    try {
        await db.insert(user)
            .values({
                id: userid,
                warns: 0,
                timeouts: 0,
                joinedAt: formatDate(new Date()), 
            })
            .onDuplicateKeyUpdate({ 
                set: { id: userid }
            });

        if (action === "add") {
            await db.insert(persistentRoles)
                .values({ userId: userid, roleId: roleId })
                .onDuplicateKeyUpdate({ set: { userId: userid } });
        } else {
            await db.delete(persistentRoles)
                .where(and(
                    eq(persistentRoles.userId, userid),
                    eq(persistentRoles.roleId, roleId)
                ));
        }

        try {
            const member = await guild.members.fetch(userid);

            if (action === "add") {
                await member.roles.add(roleId);
            } else {
                await member.roles.remove(roleId);
            }
        } catch (error) {
            if ((error as DiscordAPIError).code === 10007) {
                logger.debug(`User ${userid} not in guild; updated database only.`);
            } else {
                throw error;
            }
        }
    } catch (error) {
        logger.error(`Failed to ${action} persistent role for ${userid}:`, error);
        throw error;
    }
}

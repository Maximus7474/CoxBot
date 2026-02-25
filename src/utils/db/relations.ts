import { relations } from "drizzle-orm/relations";
import { persistentRoles, user, warn } from "./schema";

export const warnRelations = relations(warn, ({one}) => ({
	user: one(user, {
		fields: [warn.targetId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	warns: many(warn),
	persistentRoles: many(persistentRoles),
}));

export const persistentRolesRelations = relations(persistentRoles, ({ one }) => ({
    user: one(user, {
        fields: [persistentRoles.userId],
        references: [user.id],
    }),
}));
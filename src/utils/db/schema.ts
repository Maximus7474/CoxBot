import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, int, text, varchar, timestamp, foreignKey, datetime, primaryKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const ban = mysqlTable("ban", {
	id: int().autoincrement().notNull(),
	reason: text().notNull(),
	issuerId: varchar({ length: 255 }).notNull(),
	targetId: varchar({ length: 255 }).notNull(),
	issuedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	index("Ban_targetId_idx").on(table.targetId),
]);

export const user = mysqlTable("user", {
	id: varchar({ length: 255 }).notNull(),
	warns: int().default(0).notNull(),
	timeouts: int().default(0).notNull(),
	joinedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const warn = mysqlTable("warn", {
	id: int().autoincrement().notNull(),
	reason: text().notNull(),
	issuerId: varchar({ length: 255 }).notNull(),
	targetId: varchar({ length: 255 }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	issuedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	index("Warn_targetId_idx").on(table.targetId),
]);

export const persistentRoles = mysqlTable("persistent_roles", {
    userId: varchar({ length: 255 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    roleId: varchar({ length: 255 }).notNull(),
    assignedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    index("PersistentRoles_userId_idx").on(table.userId),
]);

export const prismaMigrations = mysqlTable("_prisma_migrations", {
	id: varchar({ length: 36 }).notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: datetime("finished_at", { mode: 'string', fsp: 3 }).default('NULL'),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text().default('NULL'),
	rolledBackAt: datetime("rolled_back_at", { mode: 'string', fsp: 3 }).default('NULL'),
	startedAt: datetime("started_at", { mode: 'string', fsp: 3 }).default('current_timestamp(3)').notNull(),
	appliedStepsCount: int("applied_steps_count").default(0).notNull(),
});

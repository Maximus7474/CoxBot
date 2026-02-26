CREATE TABLE `persistent_roles` (
	`userId` varchar(255) NOT NULL,
	`roleId` varchar(255) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `persistent_roles_userId_roleId_pk` PRIMARY KEY(`userId`,`roleId`)
);
--> statement-breakpoint
ALTER TABLE `warn` DROP FOREIGN KEY `Warn_targetId_fkey`;
--> statement-breakpoint
ALTER TABLE `ban` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `ban` MODIFY COLUMN `issuedAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `warns` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `timeouts` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `joinedAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `warn` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `warn` MODIFY COLUMN `issuedAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `_prisma_migrations` MODIFY COLUMN `logs` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `_prisma_migrations` MODIFY COLUMN `applied_steps_count` int NOT NULL;--> statement-breakpoint
ALTER TABLE `persistent_roles` ADD CONSTRAINT `persistent_roles_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `PersistentRoles_userId_idx` ON `persistent_roles` (`userId`);--> statement-breakpoint
ALTER TABLE `warn` ADD CONSTRAINT `warn_targetId_user_id_fk` FOREIGN KEY (`targetId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;
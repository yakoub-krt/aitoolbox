CREATE TABLE `savedItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articleId` int,
	`toolId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `saved_items_user_article_unique` UNIQUE(`userId`,`articleId`),
	CONSTRAINT `saved_items_user_tool_unique` UNIQUE(`userId`,`toolId`)
);
--> statement-breakpoint
CREATE TABLE `toolFaqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`toolId` int NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `toolFaqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitorSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`details` text NOT NULL,
	`category` enum('tool','comparison','article','other') NOT NULL DEFAULT 'tool',
	`status` enum('pending','reviewed','implemented') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitorSuggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `savedItems` ADD CONSTRAINT `savedItems_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `savedItems` ADD CONSTRAINT `savedItems_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `savedItems` ADD CONSTRAINT `savedItems_toolId_tools_id_fk` FOREIGN KEY (`toolId`) REFERENCES `tools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `toolFaqs` ADD CONSTRAINT `toolFaqs_toolId_tools_id_fk` FOREIGN KEY (`toolId`) REFERENCES `tools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `saved_items_user_idx` ON `savedItems` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `tool_faqs_tool_idx` ON `toolFaqs` (`toolId`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `suggestions_status_idx` ON `visitorSuggestions` (`status`,`createdAt`);
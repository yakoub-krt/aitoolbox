CREATE TABLE `newsletterSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resendSegmentId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletterSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` enum('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
	`consentAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`unsubscribeToken` varchar(128) NOT NULL,
	`resendContactId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `subscribers_unsubscribe_token_unique` UNIQUE(`unsubscribeToken`)
);
--> statement-breakpoint
ALTER TABLE `articles` ADD `newsletterSentAt` timestamp;--> statement-breakpoint
CREATE INDEX `subscribers_status_idx` ON `subscribers` (`status`);
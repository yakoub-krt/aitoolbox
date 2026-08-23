CREATE TABLE `prompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`category` enum('image_to_video','image_generation','image_editing','short_video','marketing') NOT NULL,
	`language` enum('ar','en') NOT NULL,
	`useCase` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`promptText` text NOT NULL,
	`toolHint` varchar(180) NOT NULL,
	`isFree` boolean NOT NULL DEFAULT true,
	`isPublished` boolean NOT NULL DEFAULT true,
	`colorTone` varchar(32) NOT NULL DEFAULT 'violet',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `prompts_public_idx` ON `prompts` (`isPublished`,`isFree`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `prompts_filter_idx` ON `prompts` (`category`,`language`);
CREATE TABLE `tools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`category` enum('writing','images','video','productivity','research') NOT NULL,
	`priceModel` enum('free','freemium','paid') NOT NULL DEFAULT 'freemium',
	`arabicSupport` enum('yes','partial','unknown') NOT NULL DEFAULT 'unknown',
	`websiteUrl` varchar(500) NOT NULL,
	`shortDescription` text NOT NULL,
	`bestFor` text NOT NULL,
	`editorialNotes` text NOT NULL,
	`limitations` text NOT NULL,
	`colorTone` varchar(32) NOT NULL DEFAULT 'violet',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tools_id` PRIMARY KEY(`id`),
	CONSTRAINT `tools_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `tools_category_idx` ON `tools` (`category`);--> statement-breakpoint
CREATE INDEX `tools_featured_idx` ON `tools` (`isFeatured`);
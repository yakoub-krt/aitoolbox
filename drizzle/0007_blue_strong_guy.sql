ALTER TABLE `prompts` ADD `copyCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `prompts_popularity_idx` ON `prompts` (`isPublished`,`isFree`,`copyCount`);
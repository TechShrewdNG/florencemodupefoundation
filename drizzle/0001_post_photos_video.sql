ALTER TABLE `posts` ADD `photos` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `video_url` text DEFAULT '' NOT NULL;
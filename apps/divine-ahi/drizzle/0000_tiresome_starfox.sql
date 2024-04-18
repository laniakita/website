CREATE TABLE `authors` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`bio` text,
	`mastodon` text
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`raw_content` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_name` text NOT NULL,
	`date` text NOT NULL,
	`headline` text NOT NULL,
	`subheadline` text,
	`category` text,
	`hero_file` text,
	`hero_credit` text,
	`hero_credit_url` text,
	`hero_credit_url_text` text,
	`hero_alt_text` text,
	`raw_content` text,
	FOREIGN KEY (`author_name`) REFERENCES `authors`(`name`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`category`) REFERENCES `categories`(`title`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_name_unique` ON `authors` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_title_unique` ON `categories` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_headline_unique` ON `posts` (`headline`);
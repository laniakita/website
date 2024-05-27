CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`date` text,
	`name` text,
	`mastodon` text,
	`mastodon_url` text,
	`local_key` text,
	`raw_str` text
);
--> statement-breakpoint
CREATE TABLE `featured_images` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`date` text,
	`title` text,
	`file_location` text,
	`caption` text,
	`credit` text,
	`credit_url_text` text,
	`credit_url` text,
	`local_key` text,
	`alt_text` text,
	`blur` text,
	`height` integer,
	`width` integer,
	`raw_str` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`date` text NOT NULL,
	`slug` text NOT NULL,
	`headline` text NOT NULL,
	`subheadline` text,
	`featured_image_id` text,
	`alt_caption` text,
	`local_key` text,
	`raw_str` text,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`featured_image_id`) REFERENCES `featured_images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `posts_to_tags` (
	`post_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`date` text,
	`title` text,
	`local_key` text,
	`raw_str` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_slug_unique` ON `authors` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `featured_images_slug_unique` ON `featured_images` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_headline_unique` ON `posts` (`headline`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_title_unique` ON `tags` (`title`);
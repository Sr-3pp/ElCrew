ALTER TABLE `students` ADD `user_id` text REFERENCES users(id);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_user_id_unique` ON `students` (`user_id`);

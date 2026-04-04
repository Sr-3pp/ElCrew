ALTER TABLE `appointments` RENAME TO `schedules`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`teacher_id` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`scheduled_time` text NOT NULL,
	`duration_minutes` integer DEFAULT 60 NOT NULL,
	`notes` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_schedules`("id", "teacher_id", "scheduled_date", "scheduled_time", "duration_minutes", "notes", "status", "created_at", "updated_at") SELECT "id", "teacher_id", "scheduled_date", "scheduled_time", "duration_minutes", "notes", "status", "created_at", "updated_at" FROM `schedules`;--> statement-breakpoint
DROP TABLE `schedules`;--> statement-breakpoint
ALTER TABLE `__new_schedules` RENAME TO `schedules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
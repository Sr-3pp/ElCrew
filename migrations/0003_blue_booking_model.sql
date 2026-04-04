CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`class_slot_id` text NOT NULL,
	`student_id` text NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`class_slot_id`) REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_class_slot_student_unique` ON `bookings` (`class_slot_id`,`student_id`);

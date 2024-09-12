DROP DATABASE IF EXISTS lawfirmhp;
CREATE DATABASE lawfirmhp;
Use lawfirmhp;


CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY,
  `user_name` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `badge` varchar(255),
  `role_id` varchar(255)
);

CREATE TABLE `fields` (
  `field_id` integer AUTO_INCREMENT PRIMARY KEY,
  `field_name` varchar(255)
);

CREATE TABLE `cases` (
  `case_id` integer AUTO_INCREMENT PRIMARY KEY,
  `lawyer_id` integer,
  `field_id` integer,
  `url_to_file` varchar(255),
  FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`),
  FOREIGN KEY (`lawyer_id`) REFERENCES `users` (`user_id`)


);

CREATE TABLE `receipts` (
  `receipt_id` integer AUTO_INCREMENT PRIMARY KEY,
  `case_id` integer,
  `url_to_file` varchar(255),
  FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`)

);

CREATE TABLE `specialities` (
  `spec_id` integer AUTO_INCREMENT PRIMARY KEY,
  `lawyer_id` integer,
  `field_id` integer,
  FOREIGN KEY (`lawyer_id`) REFERENCES `users` (`user_id`),
  FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`)
);


CREATE TABLE `cache` (
  `cache_id` integer AUTO_INCREMENT PRIMARY KEY,
  `req` varchar(255) UNIQUE,
  `url_to_file` varchar(255),
  `created_time` DATE DEFAULT CURRENT_DATE
)



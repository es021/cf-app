-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 16, 2018 at 09:24 AM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wp_career_fair`
--

-- --------------------------------------------------------

--
-- Table structure for table `session_ratings`
--

CREATE TABLE `session_ratings` (
  `ID` bigint(20) NOT NULL,
  `session_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `rec_id` bigint(20) NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session_ratings`
--

INSERT INTO `session_ratings` (`ID`, `session_id`, `student_id`, `rec_id`, `category`, `rating`, `created_at`, `updated_at`) VALUES
(1, 4, 136, 137, 'Confidence', 3, '2018-01-16 07:14:25', '2018-01-16 07:14:25'),
(3, 4, 136, 137, 'Knowlegde', 3, '2018-01-16 07:36:26', '2018-01-16 07:40:57'),
(5, 4, 136, 137, 'Swag', 5, '2018-01-16 07:36:54', '2018-01-16 07:36:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `session_ratings`
--
ALTER TABLE `session_ratings`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `session_id` (`session_id`,`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `session_ratings`
--
ALTER TABLE `session_ratings`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

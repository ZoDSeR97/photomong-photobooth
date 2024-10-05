-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2024 at 05:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `photomong_main`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_account`
--

CREATE TABLE `account_account` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` longtext NOT NULL,
  `phone` longtext NOT NULL,
  `address` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add store', 7, 'add_store'),
(26, 'Can change store', 7, 'change_store'),
(27, 'Can delete store', 7, 'delete_store'),
(28, 'Can view store', 7, 'view_store'),
(29, 'Can add device', 8, 'add_device'),
(30, 'Can change device', 8, 'change_device'),
(31, 'Can delete device', 8, 'delete_device'),
(32, 'Can view device', 8, 'view_device'),
(33, 'Can add frame', 9, 'add_frame'),
(34, 'Can change frame', 9, 'change_frame'),
(35, 'Can delete frame', 9, 'delete_frame'),
(36, 'Can view frame', 9, 'view_frame'),
(37, 'Can add layout', 10, 'add_layout'),
(38, 'Can change layout', 10, 'change_layout'),
(39, 'Can delete layout', 10, 'delete_layout'),
(40, 'Can view layout', 10, 'view_layout'),
(41, 'Can add background', 11, 'add_background'),
(42, 'Can change background', 11, 'change_background'),
(43, 'Can delete background', 11, 'delete_background'),
(44, 'Can view background', 11, 'view_background'),
(45, 'Can add filter', 12, 'add_filter'),
(46, 'Can change filter', 12, 'change_filter'),
(47, 'Can delete filter', 12, 'delete_filter'),
(48, 'Can view filter', 12, 'view_filter'),
(49, 'Can add payment', 13, 'add_payment'),
(50, 'Can change payment', 13, 'change_payment'),
(51, 'Can delete payment', 13, 'delete_payment'),
(52, 'Can view payment', 13, 'view_payment'),
(53, 'Can add order', 14, 'add_order'),
(54, 'Can change order', 14, 'change_order'),
(55, 'Can delete order', 14, 'delete_order'),
(56, 'Can view order', 14, 'view_order'),
(57, 'Can add transaction', 15, 'add_transaction'),
(58, 'Can change transaction', 15, 'change_transaction'),
(59, 'Can delete transaction', 15, 'delete_transaction'),
(60, 'Can view transaction', 15, 'view_transaction'),
(61, 'Can add sticker', 16, 'add_sticker'),
(62, 'Can change sticker', 16, 'change_sticker'),
(63, 'Can delete sticker', 16, 'delete_sticker'),
(64, 'Can view sticker', 16, 'view_sticker'),
(65, 'Can add account', 17, 'add_account'),
(66, 'Can change account', 17, 'change_account'),
(67, 'Can delete account', 17, 'delete_account'),
(68, 'Can view account', 17, 'view_account');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$390000$pB2TUGJ2P7ZbXaL6bSuYMR$duY9tdftaOQUsDrSE4Po0lsI55+vRk2+PIY+4onudJ0=', '2024-04-08 02:18:25.768028', 1, 'photomong', '', '', 'admin@photomong.net', 1, 1, '2024-03-30 03:40:30.815595');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `background_background`
--

CREATE TABLE `background_background` (
  `id` bigint(20) NOT NULL,
  `title` longtext NOT NULL,
  `photo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `photo_hover` varchar(100) NOT NULL,
  `position` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `background_background`
--

INSERT INTO `background_background` (`id`, `title`, `photo`, `created_at`, `updated_at`, `photo_hover`, `position`) VALUES
(1, 'Seasons', 'backgrounds/seasons.png', '2024-03-30 06:48:26.051129', '2024-03-30 08:03:20.142581', 'backgrounds/seasons_click.png', 'row-1-1'),
(2, 'Party', 'backgrounds/party.png', '2024-03-30 06:48:55.339055', '2024-03-30 08:04:23.185327', 'backgrounds/party_click.png', 'row-1-2'),
(3, 'Cartoon', 'backgrounds/cartoon.png', '2024-03-30 06:49:42.906969', '2024-03-30 08:04:38.954918', 'backgrounds/cartoon_click.png', 'row-1-3'),
(4, 'Minimalism', 'backgrounds/minimalism.png', '2024-03-30 06:50:08.127495', '2024-03-30 08:04:53.360528', 'backgrounds/minimalism_click.png', 'row-1-4'),
(5, 'Collab', 'backgrounds/collab.png', '2024-03-30 06:50:29.450924', '2024-03-30 08:05:07.723324', 'backgrounds/collab_click.png', 'row-1-5');

-- --------------------------------------------------------

--
-- Table structure for table `device_device`
--

CREATE TABLE `device_device` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` longtext NOT NULL,
  `photo_shooting_time` longtext NOT NULL,
  `photo_suffer_time` longtext NOT NULL,
  `photo_work_time` longtext NOT NULL,
  `product_price` longtext NOT NULL,
  `contact_number` longtext NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `store_id_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device_device`
--

INSERT INTO `device_device` (`id`, `name`, `code`, `photo_shooting_time`, `photo_suffer_time`, `photo_work_time`, `product_price`, `contact_number`, `status`, `created_at`, `updated_at`, `store_id_id`, `user_id`) VALUES
(1, 'DEVICE 1', 'D1', '', '', '08:00', '', '123456789', 'Online', '2024-03-30 03:43:05.043595', '2024-03-30 03:43:05.043595', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(17, 'account', 'account'),
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(11, 'background', 'background'),
(5, 'contenttypes', 'contenttype'),
(8, 'device', 'device'),
(12, 'filter', 'filter'),
(9, 'frame', 'frame'),
(10, 'layout', 'layout'),
(13, 'payment', 'payment'),
(14, 'revenue', 'order'),
(15, 'revenue', 'transaction'),
(6, 'sessions', 'session'),
(16, 'sticker', 'sticker'),
(7, 'store', 'store');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'account', '0001_initial', '2024-03-30 03:37:04.693901'),
(2, 'contenttypes', '0001_initial', '2024-03-30 03:37:04.704280'),
(3, 'auth', '0001_initial', '2024-03-30 03:37:04.723394'),
(4, 'admin', '0001_initial', '2024-03-30 03:37:04.739191'),
(5, 'admin', '0002_logentry_remove_auto_add', '2024-03-30 03:37:04.754765'),
(6, 'admin', '0003_logentry_add_action_flag_choices', '2024-03-30 03:37:04.764790'),
(7, 'contenttypes', '0002_remove_content_type_name', '2024-03-30 03:37:04.786263'),
(8, 'auth', '0002_alter_permission_name_max_length', '2024-03-30 03:37:04.800714'),
(9, 'auth', '0003_alter_user_email_max_length', '2024-03-30 03:37:04.815974'),
(10, 'auth', '0004_alter_user_username_opts', '2024-03-30 03:37:04.826571'),
(11, 'auth', '0005_alter_user_last_login_null', '2024-03-30 03:37:04.839928'),
(12, 'auth', '0006_require_contenttypes_0002', '2024-03-30 03:37:04.845794'),
(13, 'auth', '0007_alter_validators_add_error_messages', '2024-03-30 03:37:04.856122'),
(14, 'auth', '0008_alter_user_username_max_length', '2024-03-30 03:37:04.871974'),
(15, 'auth', '0009_alter_user_last_name_max_length', '2024-03-30 03:37:04.885362'),
(16, 'auth', '0010_alter_group_name_max_length', '2024-03-30 03:37:04.899996'),
(17, 'auth', '0011_update_proxy_permissions', '2024-03-30 03:37:04.911467'),
(18, 'auth', '0012_alter_user_first_name_max_length', '2024-03-30 03:37:04.924712'),
(19, 'store', '0001_initial', '2024-03-30 03:37:04.932341'),
(20, 'device', '0001_initial', '2024-03-30 03:37:04.951415'),
(21, 'frame', '0001_initial', '2024-03-30 03:37:04.969547'),
(22, 'background', '0001_initial', '2024-03-30 03:37:04.988312'),
(23, 'background', '0002_alter_background_photo', '2024-03-30 03:37:05.001024'),
(24, 'background', '0003_background_photo_hover_background_position', '2024-03-30 03:37:05.017144'),
(25, 'background', '0004_alter_background_photo_hover', '2024-03-30 03:37:05.030042'),
(26, 'filter', '0001_initial', '2024-03-30 03:37:05.036936'),
(27, 'frame', '0002_alter_frame_photo', '2024-03-30 03:37:05.050945'),
(28, 'frame', '0003_frame_photo_hover', '2024-03-30 03:37:05.066663'),
(29, 'frame', '0004_frame_position', '2024-03-30 03:37:05.082623'),
(30, 'layout', '0001_initial', '2024-03-30 03:37:05.103607'),
(31, 'layout', '0002_alter_layout_photo', '2024-03-30 03:37:05.116498'),
(32, 'layout', '0003_layout_photo_hover_layout_position', '2024-03-30 03:37:05.134191'),
(33, 'layout', '0004_rename_photo_hover_layout_background', '2024-03-30 03:37:05.146782'),
(34, 'layout', '0005_rename_background_layout_photo_cover', '2024-03-30 03:37:05.157415'),
(35, 'layout', '0006_rename_photo_cover_layout_photo_hover', '2024-03-30 03:37:05.168404'),
(36, 'layout', '0007_rename_photo_hover_layout_photo_cover', '2024-03-30 03:37:05.180388'),
(37, 'layout', '0008_layout_frame', '2024-03-30 03:37:05.198652'),
(38, 'layout', '0009_alter_layout_frame', '2024-03-30 03:37:05.220086'),
(39, 'layout', '0010_alter_layout_frame', '2024-03-30 03:37:05.238562'),
(40, 'layout', '0011_alter_layout_frame', '2024-03-30 03:37:05.257466'),
(41, 'payment', '0001_initial', '2024-03-30 03:37:05.265353'),
(42, 'payment', '0002_remove_payment_secret_key_remove_payment_secret_pass_and_more', '2024-03-30 03:37:05.316718'),
(43, 'revenue', '0001_initial', '2024-03-30 03:37:05.379724'),
(44, 'sessions', '0001_initial', '2024-03-30 03:37:05.390512'),
(45, 'sticker', '0001_initial', '2024-03-30 03:37:05.397035'),
(46, 'sticker', '0002_alter_sticker_photo', '2024-03-30 03:37:05.408431'),
(47, 'background', '0005_remove_background_frame_id', '2024-03-30 06:43:59.511216'),
(48, 'layout', '0012_rename_background_id_layout_background', '2024-03-30 06:43:59.530764'),
(49, 'layout', '0013_layout_photo_full', '2024-03-30 08:14:40.685844'),
(50, 'frame', '0005_alter_frame_price', '2024-03-31 08:19:37.370544');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('1i3f4xr3uo0t5rv2asr6jcpg4lhxg1yt', '.eJxVjMsOwiAQRf-FtSE8Zgp16d5vIANMpWpoUtqV8d-VpAtN7uqek_MSgfathL3xGuYszkKL0-8XKT24dpDvVG-LTEvd1jnKrsiDNnldMj8vh_sXKNRKz6JFZbVTBBDtBD6xh0GRHYAmA-i0MgY9Ykz6u5FGdg4oO_SOkY14fwCnZTaq:1rteaX:T1BPcJyoMSGWJu_ZiwUG4JbyqIyazD1fCE_OGajcs3o', '2024-04-22 02:18:25.802026'),
('dwwb21cqib7xazf1nyl78v56x2oeai2w', '.eJxVjEEOwiAQRe_C2pCBpkBduvcMZIYZpGogKe3KeHdt0oVu_3vvv1TEbS1x67LEmdVZGXX63QjTQ-oO-I711nRqdV1m0ruiD9r1tbE8L4f7d1Cwl2_tgQyMPrDYINkkE4AIxaAjzuQmy-LBupRHF8IgEpKDiREHSR4HcOr9AfZZOIw:1rsxUY:Vu-F6MyzO0IFgnc2XPzi65VU9jfDn-fvzjps8jQWkMI', '2024-04-20 04:17:22.538846'),
('gat08by2ph45d66aj05xq54ar80heg1s', '.eJxVjEEOwiAQRe_C2hCgFBmX7j0DYZhBqgaS0q6Md7dNutDte-__twhxXUpYO89hInERWpx-Gcb05LoLesR6bzK1uswTyj2Rh-3y1ohf16P9Oyixl21tk8OUbSaNgAMo7_VGENgNmlgpywDJOO0pZzYwUlTujJzGbLXhCOLzBf6xOJ0:1rqPbL:aytRgvr0FfaRsv_kcNQoXk90dAYQ3tC1tpKFqzcZ9DE', '2024-04-13 03:41:51.726914'),
('gw1bopx5nn57t5l2ubhlsuakq6exkm1e', '.eJxVjEEOwiAQRe_C2pCBpkBduvcMZIYZpGogKe3KeHdt0oVu_3vvv1TEbS1x67LEmdVZGXX63QjTQ-oO-I711nRqdV1m0ruiD9r1tbE8L4f7d1Cwl2_tgQyMPrDYINkkE4AIxaAjzuQmy-LBupRHF8IgEpKDiREHSR4HcOr9AfZZOIw:1rsg47:1RHaYiqITpuStEghDwKjYFJuMjnjehm9KsZ0X_ZvgnY', '2024-04-19 09:40:55.368030');

-- --------------------------------------------------------

--
-- Table structure for table `filter_filter`
--

CREATE TABLE `filter_filter` (
  `id` bigint(20) NOT NULL,
  `title` longtext NOT NULL,
  `photo` varchar(100) NOT NULL,
  `color_mode` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `frame_frame`
--

CREATE TABLE `frame_frame` (
  `id` bigint(20) NOT NULL,
  `title` longtext NOT NULL,
  `photo` varchar(100) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) NOT NULL,
  `device_id_id` bigint(20) NOT NULL,
  `photo_hover` varchar(100) NOT NULL,
  `position` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `frame_frame`
--

INSERT INTO `frame_frame` (`id`, `title`, `photo`, `price`, `created_at`, `deleted_at`, `device_id_id`, `photo_hover`, `position`) VALUES
(1, 'Stripx2', 'frames/strip.png', 70000, '2024-03-30 06:24:28.713563', '2024-03-30 06:24:28.713563', 1, 'frames/strip_click.png', 'row-1-1'),
(2, '2cut-x2', 'frames/2cut.png', 100000, '2024-03-30 06:25:07.509362', '2024-03-30 06:25:07.509362', 1, 'frames/2cut_click.png', 'row-1-2'),
(3, '3-cutx2', 'frames/3cut.png', 100000, '2024-03-30 06:25:43.657124', '2024-03-30 06:25:43.658055', 1, 'frames/3cut_click.png', 'row-1-3'),
(4, '4-cutx2', 'frames/4cut.png', 100000, '2024-03-30 06:26:41.356490', '2024-03-30 06:26:41.356490', 1, 'frames/4cut_click.png', 'row-2-1'),
(5, '5-cutx2', 'frames/5cut.png', 100000, '2024-03-30 06:27:58.610482', '2024-03-30 06:27:58.610482', 1, 'frames/5cut_click.png', 'row-2-2'),
(6, '6-cutx2', 'frames/6cut.png', 100000, '2024-03-30 06:28:28.943494', '2024-03-30 06:28:28.943494', 1, 'frames/6cut_click.png', 'row-2-3');

-- --------------------------------------------------------

--
-- Table structure for table `layout_layout`
--

CREATE TABLE `layout_layout` (
  `id` bigint(20) NOT NULL,
  `title` longtext NOT NULL,
  `photo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) NOT NULL,
  `background_id` bigint(20) NOT NULL,
  `photo_cover` varchar(100) NOT NULL,
  `position` longtext NOT NULL,
  `frame_id` bigint(20) DEFAULT NULL,
  `photo_full` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_layout`
--

INSERT INTO `layout_layout` (`id`, `title`, `photo`, `created_at`, `deleted_at`, `background_id`, `photo_cover`, `position`, `frame_id`, `photo_full`) VALUES
(1, 'Season-Strip-1', 'layouts/1_BG.png', '2024-03-30 08:16:46.145306', '2024-03-30 08:16:46.145306', 1, 'layouts/1_transparent.png', 'row-1-1', 1, 'layouts/1.png'),
(2, 'Season-Strip-2', 'layouts/2_BG.png', '2024-03-30 08:20:52.737589', '2024-03-30 08:20:52.737589', 1, 'layouts/2_transparent.png', 'row-1-2', 1, 'layouts/2.png'),
(3, 'Season-Strip-3', 'layouts/3_BG.png', '2024-03-30 08:21:55.331093', '2024-03-30 08:21:55.331093', 1, 'layouts/3_transparent.png', 'row-1-3', 1, 'layouts/3.png'),
(4, 'Season-Strip-4', 'layouts/4_BG.png', '2024-03-30 08:25:47.617974', '2024-03-30 08:25:47.617974', 1, 'layouts/4_transparent.png', 'row-1-4', 1, 'layouts/4.png'),
(5, 'Season-Strip-5', 'layouts/5_BG.png', '2024-03-30 08:26:49.630288', '2024-03-30 08:26:49.630288', 1, 'layouts/5_transparent.png', 'row-1-5', 1, 'layouts/5.png'),
(6, 'Party-Strip-1', 'layouts/1_BG_q1VUxFv.png', '2024-03-30 08:39:01.100033', '2024-03-30 08:39:01.100033', 2, 'layouts/1_transparent_FACsSnV.png', 'row-1-1', 1, 'layouts/1_fZ7jlAS.png'),
(7, 'Party-Strip-2', 'layouts/2_BG_K0yzbvS.png', '2024-03-30 08:42:38.701027', '2024-03-30 08:42:38.701027', 2, 'layouts/2_transparent_bcSpFTV.png', 'row-1-2', 1, 'layouts/2_Mmq19Zh.png'),
(8, 'Party-Strip-3', 'layouts/3_BG_sqheFGl.png', '2024-03-30 08:44:55.006444', '2024-03-30 08:44:55.006444', 2, 'layouts/3_transparent_VPMG3uK.png', 'row-1-3', 1, 'layouts/3_DkgN1JZ.png'),
(9, 'Party-Strip-4', 'layouts/4_BG_SbWKXrn.png', '2024-03-30 09:03:52.177168', '2024-03-30 09:03:52.177168', 2, 'layouts/4_transparent_77NJRW9.png', 'row-1-4', 1, 'layouts/4_wt69D6X.png'),
(10, 'Party-Strip-5', 'layouts/5_BG_j8QwxuX.png', '2024-03-30 09:16:11.437135', '2024-03-30 09:16:11.437135', 2, 'layouts/5_transparent_86Ju7EB.png', 'row-1-5', 1, 'layouts/5_5CzVakK.png'),
(11, 'Cartoon-Strip-1', 'layouts/1_BG_mf2Q8H9.png', '2024-03-30 09:38:59.241744', '2024-03-30 09:38:59.241744', 3, 'layouts/1_transparent_jXklffB.png', 'row-1-1', 1, 'layouts/1_UnOhF7u.png'),
(12, 'Cartoon-Strip-2', 'layouts/2_BG_zxbdgjF.png', '2024-03-30 09:40:58.711118', '2024-03-30 09:40:58.711118', 3, 'layouts/2_transparent_5yP2Dwl.png', 'row-1-2', 1, 'layouts/2_WRQa0vX.png'),
(13, 'Cartoon-Strip-3', 'layouts/3_BG_QuNAt3J.png', '2024-03-30 09:45:14.639489', '2024-03-30 09:45:14.639489', 3, 'layouts/3_transparent_LMQaKHR.png', 'row-1-3', 1, 'layouts/3_PMRtehh.png'),
(14, 'Cartoon-Strip-4', 'layouts/4_BG_qdZ6P0F.png', '2024-03-30 09:46:26.399886', '2024-03-30 09:46:26.399886', 3, 'layouts/4_transparent_9aNRM3J.png', 'row-1-4', 1, 'layouts/4_PeJKnJR.png'),
(15, 'Cartoon-Strip-5', 'layouts/5_BG_4TbfmJN.png', '2024-03-30 09:47:17.493432', '2024-03-30 09:47:17.493432', 3, 'layouts/5_transparent_T7t0auF.png', 'row-1-5', 1, 'layouts/5_Nfsk01O.png'),
(16, 'Minimalism-Strip-1', 'layouts/1_BG_u3ZeYNa.png', '2024-03-30 10:11:12.475313', '2024-03-30 10:11:12.475313', 4, 'layouts/1_transparent_A0nT378.png', 'row-1-1', 1, 'layouts/1_QocBFXj.png'),
(17, 'Minimalism-Strip-2', 'layouts/2_BG_dLNHOCs.png', '2024-03-30 10:14:19.453104', '2024-03-30 10:14:19.453104', 4, 'layouts/2_transparent_hIlHbBA.png', 'row-1-2', 1, 'layouts/2_MluUId7.png'),
(18, 'Minimalism-Strip-3', 'layouts/3_BG_Va4PK47.png', '2024-03-30 10:15:35.677962', '2024-03-30 10:15:35.677962', 4, 'layouts/3_transparent_mIlodJm.png', 'row-1-3', 1, 'layouts/3_QvdUDW7.png'),
(19, 'Minimalism-Strip-4', 'layouts/4_BG_RNoCQrC.png', '2024-03-30 10:18:05.475313', '2024-03-30 10:18:05.475313', 4, 'layouts/4_transparent_9LmRHxy.png', 'row-1-4', 1, 'layouts/4_QEZCCVu.png'),
(20, 'Minimalism-Strip-5', 'layouts/7_BG.png', '2024-03-30 10:20:17.269300', '2024-03-30 10:20:17.269300', 4, 'layouts/7_transparent.png', 'row-1-5', 1, 'layouts/7.png'),
(21, 'Season-2cut-1', 'layouts/1_BG_n28YuXl.png', '2024-03-30 10:31:15.813754', '2024-03-30 10:31:15.813754', 1, 'layouts/1_transparent_w0SdSEn.png', 'row-1-1', 2, 'layouts/1_zTuoZYy.png'),
(22, 'Season-2cut-2', 'layouts/2_BG_k3BeaY5.png', '2024-03-30 14:33:10.906662', '2024-03-30 14:33:10.906662', 1, 'layouts/2_transparent_4Oqpdqc.png', 'row-1-2', 2, 'layouts/2_rCS2IhT.png'),
(23, 'Season-2cut-3', 'layouts/3_BG_ceAkAd8.png', '2024-03-30 14:34:46.687760', '2024-03-30 14:34:46.687760', 1, 'layouts/3_transparent_1WSDNAG.png', 'row-1-3', 2, 'layouts/3_LxMGdf6.png'),
(24, 'Season-2cut-4', 'layouts/4_BG_SWDlNZV.png', '2024-03-30 14:36:06.547505', '2024-03-30 14:36:06.547505', 1, 'layouts/4_transparent_d1FRr2f.png', 'row-1-4', 2, 'layouts/4_8OzFVVR.png'),
(25, 'Party-2cut-1', 'layouts/1_BG_n4RXJ85.png', '2024-03-30 15:01:05.276445', '2024-03-30 15:01:05.276445', 2, 'layouts/1_transparent_GuEGJPD.png', 'row-1-1', 2, 'layouts/1_YysTBee.png'),
(26, 'Party-2cut-2', 'layouts/2_BG_PQKA9bw.png', '2024-03-30 15:21:45.421925', '2024-03-30 15:21:45.421925', 2, 'layouts/2_transparent_nqfsvrs.png', 'row-1-2', 2, 'layouts/2_bf0ks74.png'),
(27, 'Party-2cut-3', 'layouts/3_BG_WgTVyuC.png', '2024-03-30 15:23:32.760127', '2024-03-30 15:23:32.760127', 2, 'layouts/3_transparent_NIFRyWu.png', 'row-1-3', 2, 'layouts/3_BrlTiuD.png'),
(28, 'Party-2cut-4', 'layouts/4_BG_obxt4CE.png', '2024-03-30 15:24:25.812447', '2024-03-30 15:24:25.812447', 2, 'layouts/4_transparent_8Yh6YtN.png', 'row-1-4', 2, 'layouts/4_jXiaunu.png'),
(29, 'Party-2cut-5', 'layouts/5_BG_wYGykbk.png', '2024-03-30 15:25:17.942603', '2024-03-30 15:25:17.942603', 2, 'layouts/5_transparent_xosUyIq.png', 'row-1-5', 2, 'layouts/5_ScdKtzq.png'),
(30, 'Cartoon-2cut-1', 'layouts/1_BG_lE5jQtj.png', '2024-03-30 15:26:45.092606', '2024-03-30 15:26:45.092606', 3, 'layouts/1_transparent_rvjXhW5.png', 'row-1-1', 2, 'layouts/1_dHeO7eQ.png'),
(31, 'Cartoon-2cut-2', 'layouts/2_BG_B6eFflS.png', '2024-03-30 15:28:04.401225', '2024-03-30 15:28:04.401225', 3, 'layouts/2_transparent_cWrVmo0.png', 'row-1-2', 2, 'layouts/2_hTqLKrp.png'),
(32, 'Cartoon-2cut-3', 'layouts/3_BG_dwnkPgh.png', '2024-03-30 15:30:10.914807', '2024-03-30 15:30:10.914807', 3, 'layouts/3_transparent_snWBSm6.png', 'row-1-3', 2, 'layouts/3_WnXRmxJ.png'),
(33, 'Cartoon-2cut-4', 'layouts/4_BG_pRyi3bB.png', '2024-03-30 15:31:24.364485', '2024-03-30 15:31:24.364485', 3, 'layouts/4_transparent_yC5iywU.png', 'row-1-4', 2, 'layouts/4_1yEVpoz.png'),
(34, 'Cartoon-2cut-5', 'layouts/5_BG_5lnx8KN.png', '2024-03-30 15:32:44.876484', '2024-03-30 15:32:44.876484', 3, 'layouts/5_transparent_Zb1JHYX.png', 'row-1-5', 2, 'layouts/5_8HNmaXn.png'),
(35, 'Minimalism-2Cut-1', 'layouts/1_BG_UJl5YRQ.png', '2024-03-30 15:33:45.108328', '2024-03-30 15:33:45.108328', 4, 'layouts/1_transparent_12R28t4.png', 'row-1-1', 2, 'layouts/1_9gEp5aA.png'),
(36, 'Minimalism-2Cut-2', 'layouts/2_BG_uCCM9ut.png', '2024-03-30 15:34:22.276787', '2024-03-30 15:34:22.276787', 4, 'layouts/2_transparent_O3nyo4z.png', 'row-1-2', 2, 'layouts/2_cPWnHc1.png'),
(37, 'Minimalism-2Cut-3', 'layouts/3_BG_cLcFdvF.png', '2024-03-30 15:36:13.443687', '2024-03-30 15:36:13.443687', 4, 'layouts/3_transparent_XToqtD3.png', 'row-1-3', 2, 'layouts/3_WxjYpWg.png'),
(38, 'Minimalism-2Cut-4', 'layouts/4_BG_ZIKXFXH.png', '2024-03-30 15:37:04.310539', '2024-03-30 15:37:04.310539', 4, 'layouts/4_transparent_TbkAEFe.png', 'row-1-4', 2, 'layouts/4_PkSqcuk.png'),
(39, 'Minimalism-2Cut-5', 'layouts/5_BG_MxaCq4j.png', '2024-03-30 15:39:05.140519', '2024-03-30 15:39:05.140519', 4, 'layouts/5_transparent_hw1OqUN.png', 'row-1-5', 2, 'layouts/5_soox7ji.png'),
(40, 'Season-3cut-1', 'layouts/1_BG_X7vbUyV.png', '2024-03-30 15:42:54.692710', '2024-03-30 15:42:54.692710', 1, 'layouts/1_transparent_GF0RWsT.png', 'row-1-1', 3, 'layouts/1_cXUY0C1.png'),
(41, 'Season-3cut-2', 'layouts/2_BG_PP50ZZE.png', '2024-03-30 15:44:09.984293', '2024-03-30 15:44:09.984293', 1, 'layouts/2_transparent_1PlU0ef.png', 'row-1-2', 3, 'layouts/2_jTzLsAD.png'),
(42, 'Season-3cut-3', 'layouts/3_BG_76tfSGD.png', '2024-03-30 15:44:53.052226', '2024-03-30 15:44:53.052226', 1, 'layouts/3_transparent_xGsITn8.png', 'row-1-3', 3, 'layouts/3_rFOUPa1.png'),
(43, 'Season-3cut-4', 'layouts/4_BG_TSeFCF7.png', '2024-03-30 15:46:06.772149', '2024-03-30 15:46:06.772149', 1, 'layouts/4_transparent_BH20g6e.png', 'row-1-4', 3, 'layouts/4_9JMYtO2.png'),
(44, 'Season-3cut-5', 'layouts/5_BG_2Qumiks.png', '2024-03-30 15:47:47.554334', '2024-03-30 15:47:47.554334', 1, 'layouts/5_transparent_QiGfGxM.png', 'row-1-5', 3, 'layouts/5_D43GowD.png'),
(45, 'Party-3cut-1', 'layouts/1_BG_YGCZbAB.png', '2024-03-30 15:49:38.358464', '2024-03-30 15:49:38.358464', 2, 'layouts/1_transparent_VodNBXr.png', 'row-1-1', 3, 'layouts/1_O9t1bUm.png'),
(46, 'Party-3cut-2', 'layouts/2_BG_LYguCyZ.png', '2024-03-30 15:50:39.052366', '2024-03-30 15:50:39.052366', 2, 'layouts/2_transparent_O91V5ov.png', 'row-1-2', 3, 'layouts/2_kiiVSya.png'),
(47, 'Party-3cut-3', 'layouts/3_BG_Om6kcwW.png', '2024-03-30 15:59:03.587594', '2024-03-30 15:59:03.587594', 2, 'layouts/3_transparent_uJe3Lzd.png', 'row-1-3', 3, 'layouts/3_Jb32Zgb.png'),
(48, 'Party-3cut-4', 'layouts/4_BG_EQacLsZ.png', '2024-03-30 16:01:19.032847', '2024-03-30 16:01:19.032847', 2, 'layouts/4_transparent_ZTb8ZiX.png', 'row-1-4', 3, 'layouts/4_XL0zM3d.png'),
(49, 'Party-3cut-5', 'layouts/5_BG_aQDZD4m.png', '2024-03-30 16:02:24.072784', '2024-03-30 16:02:24.072784', 2, 'layouts/5_transparent_C7rC8O1.png', 'row-1-5', 3, 'layouts/5_xmUh9sJ.png'),
(50, 'Cartoon-3cut-1', 'layouts/1_BG_hyk68kl.png', '2024-03-30 16:03:25.683745', '2024-03-30 16:03:25.683745', 3, 'layouts/1_transparent_g63VHd7.png', 'row-1-1', 3, 'layouts/1_E1posLE.png'),
(51, 'Cartoon-3cut-2', 'layouts/2_BG_ASexBHd.png', '2024-03-30 16:04:08.300027', '2024-03-30 16:04:08.300027', 3, 'layouts/2_transparent_TQH73x9.png', 'row-1-2', 3, 'layouts/2_Lzu1loQ.png'),
(52, 'Cartoon-3cut-3', 'layouts/3_BG_fBAbr76.png', '2024-03-30 16:05:00.053577', '2024-03-30 16:05:00.053577', 3, 'layouts/3_transparent_EfLfwN5.png', 'row-1-3', 3, 'layouts/3_2hdOIRa.png'),
(53, 'Cartoon-3cut-4', 'layouts/4_BG_zaE9Pn5.png', '2024-03-30 16:05:50.174258', '2024-03-30 16:05:50.174258', 3, 'layouts/4_transparent_7FqGNXP.png', 'row-1-4', 3, 'layouts/4_8qYyQkt.png'),
(54, 'Cartoon-3cut-5', 'layouts/5_BG_BwWDEnB.png', '2024-03-30 16:07:02.193237', '2024-03-30 16:07:02.193237', 3, 'layouts/5_transparent_40WWC9r.png', 'row-1-5', 3, 'layouts/5_HIF58VQ.png'),
(55, 'Minimalism-3cut-1', 'layouts/1_BG_PSKvEWh.png', '2024-03-30 16:08:28.662649', '2024-03-30 16:08:28.662649', 4, 'layouts/1_transparent_WDM60z6.png', 'row-1-1', 3, 'layouts/1_vf2YNXO.png'),
(56, 'Minimalism-3cut-2', 'layouts/2_BG_2lkdi7u.png', '2024-03-30 16:09:22.398560', '2024-03-30 16:09:22.398560', 4, 'layouts/2_transparent_6wsYCbL.png', 'row-1-2', 3, 'layouts/2_8YQY4I8.png'),
(57, 'Minimalism-3cut-3', 'layouts/3_BG_WWAiFHM.png', '2024-03-30 16:10:18.429709', '2024-03-30 16:10:18.429709', 4, 'layouts/3_transparent_dcIcRFa.png', 'row-1-3', 3, 'layouts/3_zUGkR6A.png'),
(58, 'Minimalism-3cut-4', 'layouts/4_BG_jZZiUx0.png', '2024-03-30 16:11:04.384457', '2024-03-30 16:11:04.384457', 4, 'layouts/4_transparent_t3qYMu8.png', 'row-1-4', 3, 'layouts/4_cCdQ0R3.png'),
(59, 'Minimalism-3Cut-5', 'layouts/5_BG_hFwazLz.png', '2024-03-30 16:11:54.142301', '2024-03-30 16:11:54.142301', 4, 'layouts/5_transparent_yd5NAHz.png', 'row-1-5', 3, 'layouts/5_j2iTVcS.png'),
(60, 'Season-4cut-1', 'layouts/1_BG_uzEKW8P.png', '2024-03-30 16:13:00.959193', '2024-03-30 16:13:00.959193', 1, 'layouts/1_transparent_6459kwB.png', 'row-1-1', 4, 'layouts/1_SlONZsr.png'),
(61, 'Season-4cut-2', 'layouts/2_BG_64LfktO.png', '2024-03-31 02:33:10.114701', '2024-03-31 02:33:10.114701', 1, 'layouts/2_transparent_qElvTlH.png', 'row-1-2', 4, 'layouts/2_WwQ5EXu.png'),
(62, 'Season-4cut-3', 'layouts/3_BG_6IClhWn.png', '2024-03-31 02:37:35.780987', '2024-03-31 02:37:35.780987', 1, 'layouts/3_transparent_R1oGLy0.png', 'row-1-3', 4, 'layouts/3_Y9NKDjb.png'),
(63, 'Season-4cut-4', 'layouts/4_BG_DNW8Dov.png', '2024-03-31 02:39:02.249679', '2024-03-31 02:39:02.249679', 1, 'layouts/4_transparent_LK5b7y4.png', 'row-1-4', 4, 'layouts/4_FTCwpjp.png'),
(64, 'Season-4cut-5', 'layouts/5_BG_Mj15Ex2.png', '2024-03-31 02:39:55.418779', '2024-03-31 02:39:55.418779', 1, 'layouts/5_transparent_xQjNiu7.png', 'row-1-5', 4, 'layouts/5_56X8DYa.png'),
(65, 'Party-4cut-1', 'layouts/1_BG_efH7Df7.png', '2024-03-31 02:44:28.741520', '2024-03-31 02:44:28.741520', 2, 'layouts/1_transparent_dOWXELt.png', 'row-1-1', 4, 'layouts/1_Nv5AxHK.png'),
(66, 'Party-4cut-2', 'layouts/2_BG_kPVKmIa.png', '2024-03-31 02:45:07.413326', '2024-03-31 02:45:07.413326', 2, 'layouts/2_transparent_kGIrXds.png', 'row-1-2', 4, 'layouts/2_3o0V15Z.png'),
(67, 'Party-4cut-3', 'layouts/3_BG_EnxO1qV.png', '2024-03-31 02:46:04.620431', '2024-03-31 02:46:04.620431', 2, 'layouts/3_transparent_08dAcHA.png', 'row-1-3', 4, 'layouts/3_hFYbNOR.png'),
(68, 'Party-4cut-4', 'layouts/4_BG_Bz3fT0d.png', '2024-03-31 02:46:50.003043', '2024-03-31 02:46:50.003043', 2, 'layouts/4_transparent_ohldttB.png', 'row-1-4', 4, 'layouts/4_6XuhUMH.png'),
(69, 'Party-4cut-5', 'layouts/5_BG_tknjGuZ.png', '2024-03-31 02:47:32.918388', '2024-03-31 02:47:32.918388', 2, 'layouts/5_transparent_aVu7lAb.png', 'row-1-5', 4, 'layouts/5_g2rLGZf.png'),
(70, 'Cartoon-4cut-1', 'layouts/1_BG_cuzY0je.png', '2024-03-31 02:49:03.756070', '2024-03-31 02:49:03.756070', 3, 'layouts/1_transparent_BXkHC9q.png', 'row-1-1', 4, 'layouts/1_Rcl4eXL.png'),
(71, 'Cartoon-4cut-2', 'layouts/2_BG_JzUNyhw.png', '2024-03-31 02:50:16.970846', '2024-03-31 02:50:16.970846', 3, 'layouts/2_transparent_eHitApJ.png', 'row-1-2', 4, 'layouts/2_ErOh2rL.png'),
(72, 'Cartoon-4cut-3', 'layouts/3_BG_znJUlH9.png', '2024-03-31 02:52:47.482023', '2024-03-31 02:52:47.482023', 3, 'layouts/3_transparent_Na7qHA1.png', 'row-1-3', 4, 'layouts/3_uLMfdeq.png'),
(73, 'Cartoon-4cut-4', 'layouts/4_BG_IYX3XBH.png', '2024-03-31 02:53:24.494209', '2024-03-31 02:53:24.494209', 3, 'layouts/4_transparent_WHDqp6K.png', 'row-1-4', 4, 'layouts/4_nCogEMF.png'),
(74, 'Cartoon-4cut-5', 'layouts/5_BG_1yD5oSo.png', '2024-03-31 02:54:16.271185', '2024-03-31 02:54:16.271185', 3, 'layouts/5_transparent_KUPU11s.png', 'row-1-5', 4, 'layouts/5_zllyEYa.png'),
(75, 'Minimalism-4cut-1', 'layouts/1_BG_sB035GO.png', '2024-03-31 02:55:43.823535', '2024-03-31 02:55:43.823535', 4, 'layouts/1_transparent_AgojdeP.png', 'row-1-1', 4, 'layouts/1_lKZsTZP.png'),
(76, 'Minimalism-4cut-2', 'layouts/2_BG_M1Iyktr.png', '2024-03-31 02:56:26.301172', '2024-03-31 02:56:26.301172', 4, 'layouts/2_transparent_D277Cgi.png', 'row-1-2', 4, 'layouts/2_Dh8csBx.png'),
(77, 'Minimalism-4cut-3', 'layouts/3_BG_ZSUvKcT.png', '2024-03-31 02:57:17.832017', '2024-03-31 02:57:17.832017', 4, 'layouts/3_transparent_Y8H6AnZ.png', 'row-1-3', 4, 'layouts/3_rO42Bgr.png'),
(78, 'Minimalism-4cut-4', 'layouts/4_BG_a9Re5cr.png', '2024-03-31 02:58:42.939897', '2024-03-31 02:58:42.939897', 4, 'layouts/4_transparent_iWAmiOV.png', 'row-1-4', 4, 'layouts/4_1RTi11w.png'),
(79, 'Minimalism-4cut-5', 'layouts/5_BG_J37MObs.png', '2024-03-31 03:00:20.421635', '2024-03-31 03:00:20.421635', 4, 'layouts/5_transparent_XBNgV2x.png', 'row-1-5', 4, 'layouts/5_umhZyuW.png'),
(80, 'Season-5cut-1', 'layouts/3_BG_QIi0olw.png', '2024-03-31 03:02:23.903500', '2024-03-31 03:02:23.903500', 1, 'layouts/3_transparent_W3aic16.png', 'row-1-1', 5, 'layouts/3_0pwUG3B.png'),
(81, 'Season-5cut-2', 'layouts/4_BG_WUczlFC.png', '2024-03-31 03:03:04.470301', '2024-03-31 03:03:04.470301', 1, 'layouts/4_transparent_1DYvfFu.png', 'row-1-2', 5, 'layouts/4_aLkxEki.png'),
(82, 'Season-5cut-3', 'layouts/5_BG_FoGSLGY.png', '2024-03-31 03:03:51.892394', '2024-03-31 03:03:51.892394', 1, 'layouts/5_transparent_wWGU3vb.png', 'row-1-3', 5, 'layouts/5_dCaavkb.png'),
(83, 'Season-5cut-4', 'layouts/6_BG.png', '2024-03-31 03:04:33.131284', '2024-03-31 03:04:33.131284', 1, 'layouts/6_transparent.png', 'row-1-4', 5, 'layouts/6.png'),
(84, 'Season -5cut-5', 'layouts/7_BG_m4Wn6Ma.png', '2024-03-31 03:05:13.236730', '2024-03-31 03:05:13.236730', 1, 'layouts/7_transparent_dhoEWpV.png', 'row-1-5', 5, 'layouts/7_H9rp6gC.png'),
(85, 'Party-5cut-1', 'layouts/1_BG_QkboBvF.png', '2024-03-31 03:13:07.957011', '2024-03-31 03:13:07.957011', 2, 'layouts/1_transparent_A59P9Z5.png', 'row-1-1', 5, 'layouts/1_ZUNSymZ.png'),
(86, 'Party-5cut-2', 'layouts/2_BG_teJ4aAY.png', '2024-03-31 03:15:37.057528', '2024-03-31 03:15:37.057528', 2, 'layouts/2_transparent_ZdfX4wR.png', 'row-1-2', 5, 'layouts/2_Va8SDtz.png'),
(87, 'Party-5cut-3', 'layouts/3_BG_33nhQMY.png', '2024-03-31 03:17:20.435897', '2024-03-31 03:17:20.435897', 2, 'layouts/3_transparent_8jKiVuo.png', 'row-1-3', 5, 'layouts/3_QKpsCgZ.png'),
(88, 'Party-5cut-4', 'layouts/4_BG_tFN3pIn.png', '2024-03-31 03:20:24.053408', '2024-03-31 03:20:24.053408', 2, 'layouts/4_transparent_E7IHYSL.png', 'row-1-4', 5, 'layouts/4_ScWlWuy.png'),
(89, 'Party-5cut-5', 'layouts/5_BG_PHeyBeD.png', '2024-03-31 03:21:14.376938', '2024-03-31 03:21:14.376938', 2, 'layouts/5_transparent_rJ7T2zd.png', 'row-1-5', 5, 'layouts/5_yJlRO6N.png'),
(90, 'Cartoon-5cut-1', 'layouts/1_BG_HEWXCf8.png', '2024-03-31 03:22:04.361346', '2024-03-31 03:22:04.361346', 3, 'layouts/1_transparent_ct9in9Y.png', 'row-1-1', 5, 'layouts/1_ZhJpT1U.png'),
(91, 'Cartoon-5cut-2', 'layouts/2_BG_Ml0DNyY.png', '2024-03-31 03:22:47.347589', '2024-03-31 03:22:47.347589', 3, 'layouts/2_transparent_8OsevYP.png', 'row-1-2', 5, 'layouts/2_cFQmKMo.png'),
(92, 'Cartoon-5cut-3', 'layouts/3_BG_OyF2ivq.png', '2024-03-31 03:23:44.832609', '2024-03-31 03:23:44.832609', 3, 'layouts/3_transparent_ZIsCeOn.png', 'row-1-3', 5, 'layouts/3_yXAZfjL.png'),
(93, 'Cartoon-5cut-4', 'layouts/4_BG_PlWGqBK.png', '2024-03-31 03:31:58.374348', '2024-03-31 03:31:58.374348', 3, 'layouts/4_transparent_Z0lM0Wl.png', 'row-1-4', 4, 'layouts/4_bMYABO4.png'),
(94, 'Cartoon-5cut-5', 'layouts/5_BG_1e398xj.png', '2024-03-31 03:33:30.505423', '2024-03-31 03:33:30.505423', 3, 'layouts/5_transparent_deAmTQL.png', 'row-1-5', 5, 'layouts/5_r9babAL.png'),
(95, 'Minimalism-5cut-1', 'layouts/1_BG_hJC0ssk.png', '2024-03-31 03:35:39.684536', '2024-03-31 03:35:39.684536', 4, 'layouts/1_transparent_fgAXmvY.png', 'row-1-1', 5, 'layouts/1_axEO90N.png'),
(96, 'Minimalism-5cut-2', 'layouts/2_BG_tYSiRSR.png', '2024-03-31 03:39:12.506135', '2024-03-31 03:39:12.506135', 4, 'layouts/2_transparent_MCiL6QZ.png', 'row-1-2', 5, 'layouts/2_rZu7lGP.png'),
(97, 'Minimalism-5cut-3', 'layouts/3_BG_a8gNZfX.png', '2024-03-31 03:40:34.292994', '2024-03-31 03:40:34.293989', 4, 'layouts/3_transparent_B6bT1jY.png', 'row-1-3', 5, 'layouts/3_Rr0yEdM.png'),
(98, 'Minimalism-5cut-4', 'layouts/4_BG_zTq5ACV.png', '2024-03-31 03:43:22.737923', '2024-03-31 03:43:22.737923', 4, 'layouts/4_transparent_Y95iOg6.png', 'row-1-4', 5, 'layouts/4_UzsKRwC.png'),
(99, 'Minimalism-5cut-5', 'layouts/5_BG_2uu1nwX.png', '2024-03-31 03:44:16.519745', '2024-03-31 03:44:16.519745', 4, 'layouts/5_transparent_wSi37A1.png', 'row-1-5', 5, 'layouts/5_hWNwR8W.png'),
(100, 'Season-6cut-1', 'layouts/1_BG_DYTD3Dh.png', '2024-03-31 03:45:20.424344', '2024-03-31 03:45:20.424344', 1, 'layouts/1_transparent_XnZzPy3.png', 'row-1-1', 6, 'layouts/1_thNupqY.png'),
(101, 'Season-6cut-2', 'layouts/2_BG_fgQfWrK.png', '2024-03-31 03:47:39.995345', '2024-03-31 03:47:39.995345', 1, 'layouts/2_transparent_r3Zx9WW.png', 'row-1-2', 6, 'layouts/2_5EFRUnp.png'),
(102, 'Season-6cut-3', 'layouts/3_BG_mjvoknC.png', '2024-03-31 04:00:25.384160', '2024-03-31 04:00:25.384160', 1, 'layouts/3_transparent_s6k7GQC.png', 'row-1-3', 6, 'layouts/3_ftXGrmq.png'),
(103, 'Season-6cut-4', 'layouts/4_BG_EB18Lpe.png', '2024-03-31 04:07:55.986468', '2024-03-31 04:07:55.986468', 1, 'layouts/4_transparent_sQFUMaL.png', 'row-1-4', 6, 'layouts/4_yUnVTfd.png'),
(104, 'Season-6cut-5', 'layouts/5_BG_LbYcu1M.png', '2024-03-31 04:08:34.335933', '2024-03-31 04:08:34.335933', 1, 'layouts/5_transparent_XMMDFiF.png', 'row-1-5', 6, 'layouts/5_c3LJcsU.png'),
(105, 'Party-6cut-1', 'layouts/1_BG_ZesZX81.png', '2024-03-31 04:14:45.507457', '2024-03-31 04:14:45.507457', 2, 'layouts/2_transparent_tg2K9dn.png', 'row-1-1', 6, 'layouts/1_BZcGOS9.png'),
(106, 'Party-6cut-2', 'layouts/2_BG_Fxesn4K.png', '2024-03-31 04:15:27.888475', '2024-03-31 04:15:27.888475', 2, 'layouts/2_transparent_xKO5neS.png', 'row-1-2', 6, 'layouts/2_vKKzCyU.png'),
(107, 'Party-6cut-3', 'layouts/3_BG_UNDaUel.png', '2024-03-31 04:16:30.920220', '2024-03-31 04:16:30.920220', 2, 'layouts/3_transparent_Dka8Kus.png', 'row-1-3', 6, 'layouts/3_iJbJfHj.png'),
(108, 'Party-6cut-4', 'layouts/4_BG_5zuQxyp.png', '2024-03-31 04:17:35.045137', '2024-03-31 04:17:35.045137', 2, 'layouts/4_transparent_zu8Dgfr.png', 'row-1-4', 6, 'layouts/4_PnHCraR.png'),
(109, 'Party-6cut-5', 'layouts/5_BG_YMmpAE9.png', '2024-03-31 04:20:09.825223', '2024-03-31 04:20:09.825223', 2, 'layouts/5_transparent_ts38AUT.png', 'row-1-5', 6, 'layouts/5_xNVZUEh.png'),
(110, 'Cartoon-6cut-1', 'layouts/1_BG_hwn9V1P.png', '2024-03-31 04:22:59.906477', '2024-03-31 04:22:59.906477', 3, 'layouts/1_transparent_ZZaDSxm.png', 'row-1-1', 6, 'layouts/1_AQeiHnY.png'),
(111, 'Cartoon-6cut-2', 'layouts/2_BG_otdZq9q.png', '2024-03-31 04:23:57.400541', '2024-03-31 04:23:57.400541', 3, 'layouts/2_transparent_pACeygb.png', 'row-1-2', 6, 'layouts/2_pPa1Hx7.png'),
(112, 'Cartoon-6cut-3', 'layouts/3_BG_m2zayyc.png', '2024-03-31 04:24:36.571250', '2024-03-31 04:24:36.571250', 3, 'layouts/3_transparent_UJqoDs8.png', 'row-1-3', 6, 'layouts/3_E3Fiy14.png'),
(113, 'Cartoon-6cut-4', 'layouts/4_BG_AmcdoKv.png', '2024-03-31 04:26:06.130213', '2024-03-31 04:26:06.130213', 3, 'layouts/4_transparent_0guJHjG.png', 'row-1-4', 6, 'layouts/4_B71NfuY.png'),
(114, 'Cartoon-6cut-5', 'layouts/5_BG_ik16RvB.png', '2024-03-31 04:28:27.709129', '2024-03-31 04:28:27.709129', 3, 'layouts/5_transparent_ND896mX.png', 'row-1-5', 6, 'layouts/5_eTadC9J.png'),
(115, 'Minimalism-6cut-1', 'layouts/1_BG_WOATO2n.png', '2024-03-31 04:29:58.988833', '2024-03-31 04:29:58.988833', 4, 'layouts/1_transparent_Zryk0VT.png', 'row-1-1', 6, 'layouts/1_Jh6rvDc.png'),
(116, 'Minimalism-6cut-2', 'layouts/2_BG_x4qDDJs.png', '2024-03-31 04:31:53.084510', '2024-03-31 04:31:53.084510', 4, 'layouts/2_transparent_3YxG00X.png', 'row-1-2', 6, 'layouts/2_SYavLJG.png'),
(117, 'Minimalism-6cut-3', 'layouts/3_BG_n0FNTsK.png', '2024-03-31 04:32:36.107543', '2024-03-31 04:32:36.107543', 4, 'layouts/3_transparent_dcqTxCm.png', 'row-1-3', 6, 'layouts/3_4mM180j.png'),
(118, 'Minimalism-6cut-4', 'layouts/4_BG_Jqlh0Cr.png', '2024-03-31 04:33:14.884819', '2024-03-31 04:33:14.884819', 4, 'layouts/4_transparent_mLpfHh4.png', 'row-1-4', 6, 'layouts/4_rORWFG2.png'),
(119, 'Minimalism-6cut-5', 'layouts/5_BG_qPcKLE0.png', '2024-03-31 04:34:55.929530', '2024-03-31 04:34:55.929530', 4, 'layouts/5_transparent_pLyfBps.png', 'row-1-5', 6, 'layouts/5_dCiKSzv.png'),
(120, 'Season-2cut-5', 'layouts/5_BG_SMziSsQ.png', '2024-03-31 06:40:29.848268', '2024-03-31 06:40:29.848268', 1, 'layouts/5_transparent_e8dWL9K.png', 'row-1-5', 2, 'layouts/5_ISBee0t.png');

-- --------------------------------------------------------

--
-- Table structure for table `payment_payment`
--

CREATE TABLE `payment_payment` (
  `id` bigint(20) NOT NULL,
  `method` longtext NOT NULL,
  `name` longtext NOT NULL,
  `token` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `appID` longtext NOT NULL,
  `code` longtext NOT NULL,
  `endpoint_prod` longtext NOT NULL,
  `endpoint_sandbox` longtext NOT NULL,
  `key1` longtext NOT NULL,
  `key2` longtext NOT NULL,
  `password` longtext NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_payment`
--

INSERT INTO `payment_payment` (`id`, `method`, `name`, `token`, `created_at`, `is_active`, `appID`, `code`, `endpoint_prod`, `endpoint_sandbox`, `key1`, `key2`, `password`, `updated_at`, `username`) VALUES
(1, 'QR_CODE', 'Zalopay', '2553', '2024-03-31 07:57:39.051294', 1, '2553', 'zalopay', 'https://sb-openapi.zalopay.vn/v2/create', 'https://sb-openapi.zalopay.vn/v2/create', 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL', 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz', '123', '2024-03-31 07:57:39.051294', 'photomong'),
(2, 'CASH', 'Cash', '1234567890', '2024-04-08 02:19:30.116504', 1, '123', 'Cash', '1111111111', '1111111111', '123a', '123b', '123', '2024-04-08 02:19:30.116504', 'cash');

-- --------------------------------------------------------

--
-- Table structure for table `revenue_order`
--

CREATE TABLE `revenue_order` (
  `id` bigint(20) NOT NULL,
  `order_code` varchar(100) NOT NULL,
  `product_price` double NOT NULL,
  `base_price` double NOT NULL,
  `tax` double NOT NULL,
  `total_price` double NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `device_id_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revenue_order`
--

INSERT INTO `revenue_order` (`id`, `order_code`, `product_price`, `base_price`, `tax`, `total_price`, `status`, `created_at`, `updated_at`, `device_id_id`) VALUES
(1, '240331_127870', 100000, 0, 0, 100000, 'Pending', '2024-03-31 07:57:53.631651', '2024-03-31 07:57:53.631651', 1),
(2, '240331_734193', 100000, 0, 0, 100000, 'Pending', '2024-03-31 07:57:53.633295', '2024-03-31 07:57:53.633295', 1),
(3, '240331_815969', 100000, 0, 0, 100000, 'Pending', '2024-03-31 08:04:03.056775', '2024-03-31 08:04:03.056775', 1),
(4, '240331_8905', 100000, 0, 0, 100000, 'Success', '2024-03-31 08:04:03.102777', '2024-03-31 08:11:08.634625', 1),
(5, '240331_958810', 100000, 0, 0, 100000, 'Pending', '2024-03-31 08:08:18.351593', '2024-03-31 08:08:18.351593', 1),
(6, '240331_901742', 100000, 0, 0, 100000, 'Pending', '2024-03-31 08:22:22.726910', '2024-03-31 08:22:22.726910', 1),
(7, '240331_391690', 100000, 0, 0, 100000, 'Success', '2024-03-31 08:22:23.291216', '2024-03-31 08:22:31.404077', 1),
(8, '240331_492466', 100000, 0, 0, 100000, 'Pending', '2024-03-31 10:25:46.270474', '2024-03-31 10:25:46.270474', 1),
(9, '240331_259200', 100000, 0, 0, 100000, 'Success', '2024-03-31 10:25:46.301380', '2024-03-31 10:25:54.452345', 1),
(10, '240331_796937', 100000, 0, 0, 100000, 'Pending', '2024-03-31 12:50:39.792367', '2024-03-31 12:50:39.792367', 1),
(11, '240331_437171', 100000, 0, 0, 100000, 'Success', '2024-03-31 12:50:39.892459', '2024-03-31 12:50:48.472938', 1),
(12, '240331_976851', 100000, 0, 0, 100000, 'Pending', '2024-03-31 15:19:29.529700', '2024-03-31 15:19:29.529700', 1),
(13, '240331_394052', 100000, 0, 0, 100000, 'Success', '2024-03-31 15:19:29.529700', '2024-03-31 15:19:37.722177', 1),
(14, '240331_708692', 100000, 0, 0, 100000, 'Pending', '2024-03-31 15:35:16.613904', '2024-03-31 15:35:16.613904', 1),
(15, '240331_642629', 100000, 0, 0, 100000, 'Success', '2024-03-31 15:35:16.619971', '2024-03-31 15:35:24.897067', 1),
(16, '240331_311844', 100000, 0, 0, 100000, 'Pending', '2024-03-31 15:54:03.255053', '2024-03-31 15:54:03.255053', 1),
(17, '240331_356233', 100000, 0, 0, 100000, 'Success', '2024-03-31 15:54:04.134649', '2024-03-31 15:54:12.393446', 1),
(18, '240401_842534', 100000, 0, 0, 100000, 'Pending', '2024-04-01 01:25:22.657645', '2024-04-01 01:25:22.657645', 1),
(19, '240401_425549', 100000, 0, 0, 100000, 'Success', '2024-04-01 01:25:22.666643', '2024-04-01 01:25:30.750424', 1),
(20, '240401_676979', 100000, 0, 0, 100000, 'Pending', '2024-04-01 02:19:20.861884', '2024-04-01 02:19:20.861884', 1),
(21, '240401_961545', 100000, 0, 0, 100000, 'Success', '2024-04-01 02:19:20.870886', '2024-04-01 02:19:29.611232', 1),
(22, '240402_231353', 100000, 0, 0, 100000, 'Pending', '2024-04-02 14:53:35.224820', '2024-04-02 14:53:35.224820', 1),
(23, '240402_163155', 100000, 0, 0, 100000, 'Success', '2024-04-02 14:53:35.226010', '2024-04-02 14:53:43.373361', 1),
(24, '240403_127362', 100000, 0, 0, 100000, 'Pending', '2024-04-03 02:24:08.365822', '2024-04-03 02:24:08.365822', 1),
(25, '240403_427319', 100000, 0, 0, 100000, 'Success', '2024-04-03 02:24:09.124431', '2024-04-03 02:24:17.249317', 1),
(26, '240403_30443', 100000, 0, 0, 100000, 'Pending', '2024-04-03 07:32:11.591886', '2024-04-03 07:32:11.591886', 1),
(27, '240403_164289', 100000, 0, 0, 100000, 'Success', '2024-04-03 07:32:13.451614', '2024-04-03 07:32:21.807169', 1),
(28, '240403_219069', 100000, 0, 0, 100000, 'Pending', '2024-04-03 12:24:25.187809', '2024-04-03 12:24:25.188848', 1),
(29, '240403_378845', 100000, 0, 0, 100000, 'Success', '2024-04-03 12:24:25.268368', '2024-04-03 12:24:33.368003', 1),
(30, '240403_908057', 100000, 0, 0, 100000, 'Pending', '2024-04-03 13:10:17.545841', '2024-04-03 13:10:17.545841', 1),
(31, '240403_809295', 100000, 0, 0, 100000, 'Success', '2024-04-03 13:10:17.562126', '2024-04-03 13:10:26.112035', 1),
(32, '240403_942545', 100000, 0, 0, 100000, 'Pending', '2024-04-03 14:44:19.715257', '2024-04-03 14:44:19.715257', 1),
(33, '240403_629876', 100000, 0, 0, 100000, 'Success', '2024-04-03 14:44:19.738328', '2024-04-03 14:44:28.704972', 1),
(34, '240403_634048', 100000, 0, 0, 100000, 'Pending', '2024-04-03 14:50:08.903135', '2024-04-03 14:50:08.903135', 1),
(35, '240403_305589', 100000, 0, 0, 100000, 'Success', '2024-04-03 14:50:09.470824', '2024-04-03 14:50:17.570922', 1),
(36, '240403_641756', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:04:51.900194', '2024-04-03 15:04:51.900194', 1),
(37, '240403_250238', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:04:51.906190', '2024-04-03 15:05:00.588717', 1),
(38, '240403_720938', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:09:51.340948', '2024-04-03 15:09:51.340948', 1),
(39, '240403_295151', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:09:51.369108', '2024-04-03 15:09:59.508284', 1),
(40, '240403_550972', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:12:52.569295', '2024-04-03 15:12:52.569295', 1),
(41, '240403_326358', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:12:56.264281', '2024-04-03 15:13:05.176861', 1),
(42, '240403_322269', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:16:24.039838', '2024-04-03 15:16:24.039838', 1),
(43, '240403_481898', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:16:24.085587', '2024-04-03 15:16:32.564808', 1),
(44, '240403_885406', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:28:04.308661', '2024-04-03 15:28:04.308661', 1),
(45, '240403_328955', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:28:04.308661', '2024-04-03 15:28:12.476766', 1),
(46, '240403_230707', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:37:06.934095', '2024-04-03 15:37:06.934095', 1),
(47, '240403_944989', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:37:06.934095', '2024-04-03 15:37:15.122962', 1),
(48, '240403_37557', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:41:54.878830', '2024-04-03 15:41:54.878830', 1),
(49, '240403_921968', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:41:55.518069', '2024-04-03 15:42:03.684447', 1),
(50, '240403_620289', 100000, 0, 0, 100000, 'Pending', '2024-04-03 15:49:23.387366', '2024-04-03 15:49:23.387366', 1),
(51, '240403_816081', 100000, 0, 0, 100000, 'Success', '2024-04-03 15:49:24.300863', '2024-04-03 15:49:32.488607', 1),
(52, '240404_103845', 100000, 0, 0, 100000, 'Pending', '2024-04-04 01:57:46.435306', '2024-04-04 01:57:46.435306', 1),
(53, '240404_504537', 100000, 0, 0, 100000, 'Success', '2024-04-04 01:57:47.448306', '2024-04-04 01:57:55.560583', 1),
(54, '240404_106680', 100000, 0, 0, 100000, 'Pending', '2024-04-04 03:46:08.805523', '2024-04-04 03:46:08.805523', 1),
(55, '240404_322792', 100000, 0, 0, 100000, 'Success', '2024-04-04 03:46:09.289523', '2024-04-04 03:46:17.406735', 1),
(56, '240405_377006', 100000, 0, 0, 100000, 'Pending', '2024-04-05 08:14:14.092030', '2024-04-05 08:14:14.092030', 1),
(57, '240405_269478', 100000, 0, 0, 100000, 'Success', '2024-04-05 08:14:14.626388', '2024-04-05 08:14:22.970805', 1),
(58, '240406_432767', 100000, 0, 0, 100000, 'Pending', '2024-04-06 04:04:26.261638', '2024-04-06 04:04:26.261638', 1),
(59, '240406_521484', 100000, 0, 0, 100000, 'Success', '2024-04-06 04:04:26.982566', '2024-04-06 04:04:36.015367', 1),
(60, '240406_910365', 100000, 0, 0, 100000, 'Pending', '2024-04-06 04:17:36.085507', '2024-04-06 04:17:36.085507', 1),
(61, '240406_86502', 100000, 0, 0, 100000, 'Success', '2024-04-06 04:17:36.796986', '2024-04-06 04:17:45.031163', 1),
(62, '240406_637475', 100000, 0, 0, 100000, 'Pending', '2024-04-06 08:18:03.063525', '2024-04-06 08:18:03.063525', 1),
(63, '240406_992833', 100000, 0, 0, 100000, 'Success', '2024-04-06 08:18:03.271382', '2024-04-06 08:18:12.099806', 1),
(64, '240406_851300', 100000, 0, 0, 100000, 'Pending', '2024-04-06 13:47:44.209916', '2024-04-06 13:47:44.209916', 1),
(65, '240406_647886', 100000, 0, 0, 100000, 'Success', '2024-04-06 13:47:44.620636', '2024-04-06 13:47:52.834984', 1),
(66, '240406_628195', 100000, 0, 0, 100000, 'Pending', '2024-04-06 14:11:46.626327', '2024-04-06 14:11:46.626327', 1),
(67, '240406_719305', 100000, 0, 0, 100000, 'Success', '2024-04-06 14:11:47.119595', '2024-04-06 14:11:55.924333', 1),
(68, '240406_281483', 100000, 0, 0, 100000, 'Pending', '2024-04-06 14:14:11.188253', '2024-04-06 14:14:11.188386', 1),
(69, '240406_188012', 100000, 0, 0, 100000, 'Success', '2024-04-06 14:14:11.705580', '2024-04-06 14:14:19.849209', 1),
(70, '240406_574851', 100000, 0, 0, 100000, 'Pending', '2024-04-06 14:18:19.719929', '2024-04-06 14:18:19.719929', 1),
(71, '240406_468357', 100000, 0, 0, 100000, 'Success', '2024-04-06 14:18:19.721437', '2024-04-06 14:18:28.033941', 1),
(72, '240406_599849', 100000, 0, 0, 100000, 'Pending', '2024-04-06 14:24:45.484967', '2024-04-06 14:24:45.484967', 1),
(73, '240406_976970', 100000, 0, 0, 100000, 'Success', '2024-04-06 14:24:46.069447', '2024-04-06 14:24:54.233608', 1),
(74, '240407_998423', 100000, 0, 0, 100000, 'Pending', '2024-04-07 02:44:50.116104', '2024-04-07 02:44:50.116104', 1),
(75, '240407_890104', 100000, 0, 0, 100000, 'Success', '2024-04-07 02:44:53.209243', '2024-04-07 02:45:02.316999', 1),
(76, '240407_257553', 100000, 0, 0, 100000, 'Pending', '2024-04-07 07:14:51.395160', '2024-04-07 07:14:51.395160', 1),
(77, '240407_937488', 100000, 0, 0, 100000, 'Success', '2024-04-07 07:14:51.396160', '2024-04-07 07:14:59.490251', 1),
(78, '240407_867782', 100000, 0, 0, 100000, 'Pending', '2024-04-07 07:26:08.226945', '2024-04-07 07:26:08.226945', 1),
(79, '240407_347830', 100000, 0, 0, 100000, 'Pending', '2024-04-07 07:26:08.627986', '2024-04-07 07:26:08.627986', 1),
(80, '240407_199170', 100000, 0, 0, 100000, 'Pending', '2024-04-07 07:33:15.152742', '2024-04-07 07:33:15.152742', 1),
(81, '240407_890960', 100000, 0, 0, 100000, 'Pending', '2024-04-07 07:33:16.210333', '2024-04-07 07:33:16.210333', 1),
(82, '240408_1514', 100000, 0, 0, 100000, 'Pending', '2024-04-08 01:52:39.608137', '2024-04-08 01:52:39.608137', 1),
(83, '240408_39789', 100000, 0, 0, 100000, 'Success', '2024-04-08 01:52:40.089826', '2024-04-08 01:52:48.440997', 1),
(84, '240408_782816', 100000, 0, 0, 100000, 'Pending', '2024-04-08 03:34:54.035387', '2024-04-08 03:34:54.035387', 1),
(85, '240408_286742', 100000, 0, 0, 100000, 'Pending', '2024-04-08 03:34:54.465705', '2024-04-08 03:34:54.465705', 1),
(86, 'utcr9ovyrh', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:26:15.695856', '2024-04-08 07:26:15.695856', 1),
(87, 'mkyh97kthv', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:26:15.743857', '2024-04-08 07:26:15.743857', 1),
(88, 'xjqmss504y', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:28:00.383104', '2024-04-08 07:28:00.383104', 1),
(89, 'frgsgmwtju', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:28:09.389364', '2024-04-08 07:28:09.389364', 1),
(90, 'wvweg5b5xr', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:28:10.393604', '2024-04-08 07:28:10.394603', 1),
(91, 'ytumoa0k3p', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:28:17.456280', '2024-04-08 07:28:17.456280', 1),
(92, 'rxxk8t6kbg', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:28:17.512278', '2024-04-08 07:28:17.512278', 1),
(93, 'ojztbjpmyo', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:29:51.389324', '2024-04-08 07:29:51.389324', 1),
(94, 'icwmqece22', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:30:45.380491', '2024-04-08 07:30:45.380491', 1),
(95, 'td4h6ejnia', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:30:56.981197', '2024-04-08 07:30:56.981197', 1),
(96, '79ppl0fy3x', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:30:57.048197', '2024-04-08 07:30:57.048197', 1),
(97, '7fw56fvxfj', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:32:44.383534', '2024-04-08 07:32:44.383534', 1),
(98, 'k0sj3xhrbn', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:33:03.136268', '2024-04-08 07:33:03.136268', 1),
(99, 'ur2zcw4ncs', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:33:03.181267', '2024-04-08 07:33:03.181267', 1),
(100, 'md55wo1a9s', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:37:02.832137', '2024-04-08 07:37:02.833136', 1),
(101, 'sh57bkqzkx', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:37:02.885138', '2024-04-08 07:37:02.885138', 1),
(102, 'ftct0lg212', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:37:26.360885', '2024-04-08 07:37:26.360885', 1),
(103, '9ylerl7yp2', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:37:26.410883', '2024-04-08 07:37:26.410883', 1),
(104, 'i87stj8gn0', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:38:46.509034', '2024-04-08 07:38:46.509034', 1),
(105, '8l9o5yn2rp', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:38:46.544035', '2024-04-08 07:38:46.544035', 1),
(106, '3ccjt9ww59', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:48:01.369936', '2024-04-08 07:48:01.369936', 1),
(107, '5ddqz8dy99', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:48:01.398942', '2024-04-08 07:48:01.398942', 1),
(108, 'xs3ly8try8', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:50:36.165822', '2024-04-08 07:50:36.165822', 1),
(109, 'expwtiv9a5', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:50:36.195824', '2024-04-08 07:50:36.195824', 1),
(110, '5b2fp70yy6', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:55:27.074182', '2024-04-08 07:55:27.074182', 1),
(111, 'xgpwp22qak', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:55:27.129180', '2024-04-08 07:55:27.129180', 1),
(112, 'jflp41w9x8', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:56:19.252333', '2024-04-08 07:56:19.252333', 1),
(113, '68xvd4grtz', 100000, 0, 0, 100000, 'Success', '2024-04-08 07:56:19.367333', '2024-04-08 07:56:24.286036', 1),
(114, '32w4wmb6f8', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:56:48.009482', '2024-04-08 07:56:48.009482', 1),
(115, 'l8z40mrxgp', 100000, 0, 0, 100000, 'Success', '2024-04-08 07:56:48.052483', '2024-04-08 07:57:42.156473', 1),
(116, 'ds5rwsn9x2', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:58:41.856950', '2024-04-08 07:58:41.856950', 1),
(117, 'p5onubhgju', 100000, 0, 0, 100000, 'Success', '2024-04-08 07:58:41.881950', '2024-04-08 07:59:05.989565', 1),
(118, 'q266iv6pyl', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:59:40.639160', '2024-04-08 07:59:40.639160', 1),
(119, '72m7ygr9c2', 100000, 0, 0, 100000, 'Pending', '2024-04-08 07:59:40.699161', '2024-04-08 07:59:40.699161', 1),
(120, '9linu52552', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:04:35.501541', '2024-04-08 08:04:35.502540', 1),
(121, 'sf027ufnqz', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:04:35.543537', '2024-04-08 08:04:35.543537', 1),
(122, 'd2kuu6o045', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:13:16.226326', '2024-04-08 08:13:16.226326', 1),
(123, 'gepuljgbca', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:13:16.279325', '2024-04-08 08:13:16.279325', 1),
(124, '34n3eh6vf8', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:52:43.531554', '2024-04-08 08:52:43.531554', 1),
(125, 'g0n8awj2wp', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:52:43.562553', '2024-04-08 08:52:43.562553', 1),
(126, '71gfx727yk', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:53:37.185106', '2024-04-08 08:53:37.185106', 1),
(127, '5bjyy6ece9', 100000, 0, 0, 100000, 'Pending', '2024-04-08 08:53:37.224105', '2024-04-08 08:53:37.224105', 1),
(128, 'c4eq6odpqo', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:20.909675', '2024-04-08 09:27:20.909675', 1),
(129, 'rs6zewca5s', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:20.967692', '2024-04-08 09:27:20.967692', 1),
(130, '76wkjwwkxt', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:27.507997', '2024-04-08 09:27:27.507997', 1),
(131, 'li748w1pd4', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:27.558996', '2024-04-08 09:27:27.558996', 1),
(132, 'b8fe4o4qbs', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:29.025742', '2024-04-08 09:27:29.025742', 1),
(133, 'yo03qx7il6', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:27:29.060531', '2024-04-08 09:27:29.060531', 1),
(134, 'wbmmb6n4g9', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:28:56.595036', '2024-04-08 09:28:56.596034', 1),
(135, 'jnwm0xozsw', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:28:56.652035', '2024-04-08 09:28:56.652035', 1),
(136, 'kbv11ahm6i', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:29:17.230545', '2024-04-08 09:29:17.230545', 1),
(137, '230daqr9h5', 100000, 0, 0, 100000, 'Pending', '2024-04-08 09:29:17.277544', '2024-04-08 09:29:17.277544', 1),
(138, 'lzz700h6k9', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:50:21.245366', '2024-04-08 10:50:21.245366', 1),
(139, 'yehegjb4ez', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:50:21.302078', '2024-04-08 10:50:21.302078', 1),
(140, '43i047z8vo', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:50:58.612812', '2024-04-08 10:50:58.612812', 1),
(141, '6tvouvx6rz', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:50:58.647809', '2024-04-08 10:50:58.647809', 1),
(142, 'gzuftov0w2', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:51:44.480832', '2024-04-08 10:51:44.480832', 1),
(143, '55h57ikx5l', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:51:44.516833', '2024-04-08 10:51:44.516833', 1),
(144, 'mv97w7twmr', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:52:47.208970', '2024-04-08 10:52:47.208970', 1),
(145, 'b7xr7i0gaq', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:52:47.257969', '2024-04-08 10:52:47.257969', 1),
(146, 'g8g3akidt2', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:56:20.223691', '2024-04-08 10:56:20.223691', 1),
(147, 'v24uvlvd82', 100000, 0, 0, 100000, 'Pending', '2024-04-08 10:56:20.247652', '2024-04-08 10:56:20.247652', 1),
(148, 'ob0xs6x5cm', 100000, 0, 0, 100000, 'Pending', '2024-04-08 11:00:22.337373', '2024-04-08 11:00:22.337373', 1),
(149, 'd95zcc4nop', 100000, 0, 0, 100000, 'Pending', '2024-04-08 11:00:22.367372', '2024-04-08 11:00:22.367372', 1),
(150, '08aaey0u51', 100000, 0, 0, 100000, 'Pending', '2024-04-08 11:01:40.418094', '2024-04-08 11:01:40.418094', 1),
(151, 'yl3mqp8n54', 100000, 0, 0, 100000, 'Pending', '2024-04-08 11:01:40.525095', '2024-04-08 11:01:40.525095', 1),
(152, '240408_51053', 100000, 0, 0, 100000, 'Pending', '2024-04-08 11:02:32.721768', '2024-04-08 11:02:32.721768', 1),
(153, '240408_939401', 100000, 0, 0, 100000, 'Success', '2024-04-08 11:02:33.371496', '2024-04-08 11:02:41.497590', 1),
(154, '240409_921915', 100000, 0, 0, 100000, 'Pending', '2024-04-09 01:27:34.092588', '2024-04-09 01:27:34.092588', 1),
(155, '240409_595545', 100000, 0, 0, 100000, 'Pending', '2024-04-09 01:27:35.233644', '2024-04-09 01:27:35.233644', 1),
(156, 'h2fl9v2593', 100000, 0, 0, 100000, 'Pending', '2024-04-09 01:27:45.939220', '2024-04-09 01:27:45.939220', 1),
(157, 'kd1zjs930b', 100000, 0, 0, 100000, 'Pending', '2024-04-09 01:27:45.981551', '2024-04-09 01:27:45.981551', 1),
(158, 'ih39gihdq5', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:20:30.968690', '2024-04-09 03:20:30.968690', 1),
(159, '848k4d3xoh', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:20:30.997691', '2024-04-09 03:20:30.997691', 1),
(160, '823b9r6d6j', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:22:43.846581', '2024-04-09 03:22:43.846581', 1),
(161, '32vvvxpxsy', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:22:43.885579', '2024-04-09 03:22:43.885579', 1),
(162, 'q1ydfizngm', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:26:48.695197', '2024-04-09 03:26:48.695197', 1),
(163, 'ym24f5ciea', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:26:48.744197', '2024-04-09 03:26:48.744197', 1),
(164, '4f9mm7m472', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:29:50.574960', '2024-04-09 03:29:50.574960', 1),
(165, '7uq9v93ul2', 100000, 0, 0, 100000, 'Pending', '2024-04-09 03:29:50.610959', '2024-04-09 03:29:50.611960', 1),
(166, 'm1mhrfzf4g', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:35:52.225225', '2024-04-09 03:35:52.226224', 1),
(167, 'uej49l5421', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:35:52.283167', '2024-04-09 03:35:52.283167', 1),
(168, 'kq67i28z0l', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:36:33.424097', '2024-04-09 03:36:33.424097', 1),
(169, 'hgczaug2no', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:36:33.474960', '2024-04-09 03:36:33.474960', 1),
(170, 'cffzd4tcck', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:37:15.701980', '2024-04-09 03:37:15.701980', 1),
(171, '38brl3ejmk', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:37:15.731979', '2024-04-09 03:37:15.731979', 1),
(172, 'y2omqfezs9', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:37:53.047307', '2024-04-09 03:37:53.047307', 1),
(173, 'y97qb15dpd', 70000, 0, 0, 70000, 'Pending', '2024-04-09 03:37:53.099307', '2024-04-09 03:37:53.099307', 1),
(174, 'cdy2np7v9b', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:17:23.703203', '2024-04-09 04:17:23.703203', 1),
(175, 'p50jpcd4p2', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:17:23.747742', '2024-04-09 04:17:23.747742', 1),
(176, 'wcbjtv90p1', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:19:28.414965', '2024-04-09 04:19:28.414965', 1),
(177, 'gobq7c0ki8', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:19:28.450732', '2024-04-09 04:19:28.450732', 1),
(178, '32zv2xsht0', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:22:46.806582', '2024-04-09 04:22:46.806582', 1),
(179, '41wm03m9xt', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:22:46.837247', '2024-04-09 04:22:46.837247', 1),
(180, 'h3f10hmjfd', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:25:55.189036', '2024-04-09 04:25:55.189036', 1),
(181, 'lwr6o4j8qi', 70000, 0, 0, 70000, 'Pending', '2024-04-09 04:25:55.215159', '2024-04-09 04:25:55.215159', 1),
(182, 'rdx5nsmf9m', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:07:21.779376', '2024-04-09 06:07:21.779376', 1),
(183, 't4r78zua5m', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:07:21.807375', '2024-04-09 06:07:21.807375', 1),
(184, '52upo46lq7', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:16:11.101948', '2024-04-09 06:16:11.101948', 1),
(185, 'cdgdmvtyup', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:16:11.136947', '2024-04-09 06:16:11.136947', 1),
(186, '4jz2gbkxey', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:35:30.067919', '2024-04-09 06:35:30.067919', 1),
(187, 'rbpc0qhuk1', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:35:30.096930', '2024-04-09 06:35:30.096930', 1),
(188, '0z1bc4897j', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:39:09.004371', '2024-04-09 06:39:09.004371', 1),
(189, 'jrqwkmnrlg', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:39:09.034372', '2024-04-09 06:39:09.034372', 1),
(190, 'rx7zjgnk3d', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:42:57.410038', '2024-04-09 06:42:57.410038', 1),
(191, 'y4yq0onzug', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:42:57.449739', '2024-04-09 06:42:57.449739', 1),
(192, '1f9huufuk6', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:44:23.560987', '2024-04-09 06:44:23.560987', 1),
(193, 'ta19ix1e0w', 100000, 0, 0, 100000, 'Pending', '2024-04-09 06:44:23.595013', '2024-04-09 06:44:23.595013', 1),
(194, '240409_799826', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:32:20.357275', '2024-04-09 07:32:20.357275', 1),
(195, '240409_949555', 100000, 0, 0, 100000, 'Success', '2024-04-09 07:32:21.379731', '2024-04-09 07:32:29.537306', 1),
(196, '240409_387956', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:32:37.224251', '2024-04-09 07:32:37.224251', 1),
(197, '240409_234326', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:32:47.389015', '2024-04-09 07:32:47.389015', 1),
(198, '240409_245709', 100000, 0, 0, 100000, 'Success', '2024-04-09 07:32:57.532245', '2024-04-09 07:33:05.649143', 1),
(199, '240409_107438', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:33:07.673855', '2024-04-09 07:33:07.673855', 1),
(200, '240409_253235', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:33:23.229318', '2024-04-09 07:33:23.229318', 1),
(201, '240409_429367', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:33:33.435077', '2024-04-09 07:33:33.435077', 1),
(202, '240409_580574', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:33:43.609000', '2024-04-09 07:33:43.609000', 1),
(203, '240409_910971', 100000, 0, 0, 100000, 'Success', '2024-04-09 07:33:45.156994', '2024-04-09 07:33:53.453973', 1),
(204, '240409_690814', 100000, 0, 0, 100000, 'Success', '2024-04-09 07:34:43.667451', '2024-04-09 07:34:51.788974', 1),
(205, '240409_665582', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:34:53.842998', '2024-04-09 07:34:53.842998', 1),
(206, '240409_988487', 100000, 0, 0, 100000, 'Success', '2024-04-09 07:35:02.076798', '2024-04-09 07:35:10.209480', 1),
(207, '240409_882018', 100000, 0, 0, 100000, 'Pending', '2024-04-09 07:35:12.254044', '2024-04-09 07:35:12.254044', 1),
(208, '94m1ka2lr2', 70000, 0, 0, 70000, 'Pending', '2024-04-11 03:35:11.521941', '2024-04-11 03:35:11.521941', 1);

-- --------------------------------------------------------

--
-- Table structure for table `revenue_transaction`
--

CREATE TABLE `revenue_transaction` (
  `id` bigint(20) NOT NULL,
  `amount` double NOT NULL,
  `transaction_status` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id_id` bigint(20) NOT NULL,
  `payment_id_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revenue_transaction`
--

INSERT INTO `revenue_transaction` (`id`, `amount`, `transaction_status`, `created_at`, `updated_at`, `order_id_id`, `payment_id_id`) VALUES
(1, 100000, 'Success', '2024-03-31 08:22:31.410083', '2024-03-31 08:22:31.410083', 7, 1),
(2, 100000, 'Success', '2024-03-31 10:25:54.467246', '2024-03-31 10:25:54.467246', 9, 1),
(3, 100000, 'Success', '2024-03-31 12:50:48.492357', '2024-03-31 12:50:48.492357', 11, 1),
(4, 100000, 'Success', '2024-03-31 15:19:37.734420', '2024-03-31 15:19:37.734420', 13, 1),
(5, 100000, 'Success', '2024-03-31 15:35:24.906276', '2024-03-31 15:35:24.906276', 15, 1),
(6, 100000, 'Success', '2024-03-31 15:54:12.401809', '2024-03-31 15:54:12.401809', 17, 1),
(7, 100000, 'Success', '2024-04-01 01:25:30.755424', '2024-04-01 01:25:30.755424', 19, 1),
(8, 100000, 'Success', '2024-04-01 02:19:29.615232', '2024-04-01 02:19:29.615232', 21, 1),
(9, 100000, 'Success', '2024-04-02 14:53:43.387957', '2024-04-02 14:53:43.387957', 23, 1),
(10, 100000, 'Success', '2024-04-03 02:24:17.279317', '2024-04-03 02:24:17.279317', 25, 1),
(11, 100000, 'Success', '2024-04-03 07:32:21.812902', '2024-04-03 07:32:21.812902', 27, 1),
(12, 100000, 'Success', '2024-04-03 12:24:33.373988', '2024-04-03 12:24:33.373988', 29, 1),
(13, 100000, 'Success', '2024-04-03 13:10:26.119401', '2024-04-03 13:10:26.120400', 31, 1),
(14, 100000, 'Success', '2024-04-03 14:44:28.711477', '2024-04-03 14:44:28.711477', 33, 1),
(15, 100000, 'Success', '2024-04-03 14:50:17.577834', '2024-04-03 14:50:17.577834', 35, 1),
(16, 100000, 'Success', '2024-04-03 15:05:00.598691', '2024-04-03 15:05:00.598691', 37, 1),
(17, 100000, 'Success', '2024-04-03 15:09:59.513976', '2024-04-03 15:09:59.513976', 39, 1),
(18, 100000, 'Success', '2024-04-03 15:13:05.186204', '2024-04-03 15:13:05.186204', 41, 1),
(19, 100000, 'Success', '2024-04-03 15:16:32.570717', '2024-04-03 15:16:32.570717', 43, 1),
(20, 100000, 'Success', '2024-04-03 15:28:12.488911', '2024-04-03 15:28:12.488911', 45, 1),
(21, 100000, 'Success', '2024-04-03 15:37:15.126807', '2024-04-03 15:37:15.126807', 47, 1),
(22, 100000, 'Success', '2024-04-03 15:42:03.692405', '2024-04-03 15:42:03.692405', 49, 1),
(23, 100000, 'Success', '2024-04-03 15:49:32.492614', '2024-04-03 15:49:32.492614', 51, 1),
(24, 100000, 'Success', '2024-04-04 01:57:55.590583', '2024-04-04 01:57:55.590583', 53, 1),
(25, 100000, 'Success', '2024-04-04 03:46:17.434735', '2024-04-04 03:46:17.434735', 55, 1),
(26, 100000, 'Success', '2024-04-05 08:14:22.976049', '2024-04-05 08:14:22.976049', 57, 1),
(27, 100000, 'Success', '2024-04-06 04:04:36.022735', '2024-04-06 04:04:36.022735', 59, 1),
(28, 100000, 'Success', '2024-04-06 04:17:45.046789', '2024-04-06 04:17:45.046789', 61, 1),
(29, 100000, 'Success', '2024-04-06 08:18:12.117493', '2024-04-06 08:18:12.117493', 63, 1),
(30, 100000, 'Success', '2024-04-06 13:47:52.839432', '2024-04-06 13:47:52.839432', 65, 1),
(31, 100000, 'Success', '2024-04-06 14:11:55.936028', '2024-04-06 14:11:55.936028', 67, 1),
(32, 100000, 'Success', '2024-04-06 14:14:19.854032', '2024-04-06 14:14:19.854032', 69, 1),
(33, 100000, 'Success', '2024-04-06 14:18:28.049990', '2024-04-06 14:18:28.049990', 71, 1),
(34, 100000, 'Success', '2024-04-06 14:24:54.258257', '2024-04-06 14:24:54.258257', 73, 1),
(35, 100000, 'Success', '2024-04-07 02:45:02.324810', '2024-04-07 02:45:02.324810', 75, 1),
(36, 100000, 'Success', '2024-04-07 07:14:59.495712', '2024-04-07 07:14:59.495712', 77, 1),
(37, 100000, 'Success', '2024-04-08 01:52:48.473998', '2024-04-08 01:52:48.473998', 83, 1),
(38, 100000, 'Success', '2024-04-08 07:56:51.821426', '2024-04-08 07:56:51.821426', 115, 2),
(39, 100000, 'Success', '2024-04-08 07:57:20.871233', '2024-04-08 07:57:20.871233', 115, 2),
(40, 100000, 'Success', '2024-04-08 07:57:28.572868', '2024-04-08 07:57:28.572868', 115, 2),
(41, 100000, 'Success', '2024-04-08 07:57:42.184127', '2024-04-08 07:57:42.184127', 115, 2),
(42, 100000, 'Success', '2024-04-08 07:58:53.510221', '2024-04-08 07:58:53.510221', 117, 2),
(43, 100000, 'Success', '2024-04-08 07:59:06.017643', '2024-04-08 07:59:06.017643', 117, 2),
(44, 100000, 'Success', '2024-04-08 11:02:41.524668', '2024-04-08 11:02:41.524668', 153, 1),
(45, 70000, 'Success', '2024-04-09 04:27:41.443649', '2024-04-09 04:27:41.443649', 181, 2),
(46, 70000, 'Success', '2024-04-09 04:28:11.497093', '2024-04-09 04:28:11.497093', 181, 2),
(47, 100000, 'Success', '2024-04-09 06:16:40.669256', '2024-04-09 06:16:40.669256', 185, 2),
(48, 100000, 'Success', '2024-04-09 06:17:17.801743', '2024-04-09 06:17:17.801743', 185, 2),
(49, 100000, 'Success', '2024-04-09 06:17:32.846296', '2024-04-09 06:17:32.846296', 185, 2),
(50, 100000, 'Success', '2024-04-09 06:18:00.690272', '2024-04-09 06:18:00.690272', 185, 2),
(51, 100000, 'Success', '2024-04-09 06:18:15.680622', '2024-04-09 06:18:15.680622', 185, 2),
(52, 100000, 'Success', '2024-04-09 06:18:30.683278', '2024-04-09 06:18:30.683278', 185, 2),
(53, 100000, 'Success', '2024-04-09 06:44:53.646222', '2024-04-09 06:44:53.646222', 193, 2),
(54, 100000, 'Success', '2024-04-09 07:32:29.564144', '2024-04-09 07:32:29.564144', 195, 1),
(55, 100000, 'Success', '2024-04-09 07:33:05.670454', '2024-04-09 07:33:05.670454', 198, 1),
(56, 100000, 'Success', '2024-04-09 07:33:53.493982', '2024-04-09 07:33:53.493982', 203, 1),
(57, 100000, 'Success', '2024-04-09 07:34:51.841440', '2024-04-09 07:34:51.841440', 204, 1),
(58, 100000, 'Success', '2024-04-09 07:35:10.235509', '2024-04-09 07:35:10.235509', 206, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sticker_sticker`
--

CREATE TABLE `sticker_sticker` (
  `id` bigint(20) NOT NULL,
  `category` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sticker_sticker`
--

INSERT INTO `sticker_sticker` (`id`, `category`, `title`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'MOOD', 'Did My Best', 'stickers/mood-01.png', '2024-04-05 09:41:35.990631', '2024-04-05 09:41:35.990631'),
(2, 'MOOD', 'Smile More', 'stickers/mood-02.png', '2024-04-05 09:41:51.010814', '2024-04-05 09:41:51.010814'),
(3, 'MOOD', 'Send Love', 'stickers/mood-03.png', '2024-04-05 09:42:01.412376', '2024-04-05 09:42:01.412376'),
(4, 'MOOD', 'Ok', 'stickers/mood-04.png', '2024-04-05 09:42:11.945844', '2024-04-05 09:42:11.945844'),
(5, 'MOOD', 'Victory', 'stickers/mood-05.png', '2024-04-05 09:42:22.800646', '2024-04-05 09:42:22.800646'),
(6, 'MOOD', 'High Five', 'stickers/mood-06.png', '2024-04-05 09:43:12.277448', '2024-04-05 09:43:12.277448'),
(7, 'MOOD', 'You Did Great', 'stickers/mood-07.png', '2024-04-05 09:43:34.366542', '2024-04-05 09:43:34.366542'),
(8, 'MOOD', 'Cloud', 'stickers/mood-08.png', '2024-04-05 09:44:50.770895', '2024-04-05 09:44:50.770895'),
(9, 'MOOD', 'Ban Tim', 'stickers/mood-09.png', '2024-04-05 09:45:07.002593', '2024-04-05 09:45:07.002593'),
(10, 'MOOD', 'Heart', 'stickers/mood-10.png', '2024-04-05 09:45:17.632135', '2024-04-05 09:45:17.632135'),
(11, 'MOOD', 'Give Heart', 'stickers/mood-11.png', '2024-04-05 09:45:36.886113', '2024-04-05 09:45:36.886113'),
(12, 'MOOD', 'Send Heart', 'stickers/mood-12.png', '2024-04-05 09:45:48.180141', '2024-04-05 09:45:48.180141'),
(13, 'MOOD', 'Love Mail', 'stickers/mood-13.png', '2024-04-05 09:45:57.854973', '2024-04-05 09:45:57.854973'),
(14, 'MOOD', 'Smily', 'stickers/mood-14.png', '2024-04-05 09:46:08.640370', '2024-04-05 09:46:08.640370'),
(15, 'MOOD', 'Star Face', 'stickers/mood-15.png', '2024-04-05 09:46:18.247655', '2024-04-05 09:46:18.247655'),
(16, 'MOOD', 'Blue Heart', 'stickers/mood-16.png', '2024-04-05 09:46:33.440429', '2024-04-05 09:46:33.440429'),
(17, 'MOOD', 'Play Game', 'stickers/mood-17.png', '2024-04-05 09:46:44.311775', '2024-04-05 09:46:44.311775'),
(18, 'MOOD', 'Lightning', 'stickers/mood-18.png', '2024-04-05 09:47:03.160824', '2024-04-05 09:47:03.160824'),
(19, 'MOOD', 'Rainbow', 'stickers/mood-19.png', '2024-04-05 09:47:11.569475', '2024-04-05 09:47:11.569475'),
(20, 'MOOD', 'Sun', 'stickers/mood-20.png', '2024-04-05 09:47:18.948172', '2024-04-05 09:47:18.948172');

-- --------------------------------------------------------

--
-- Table structure for table `store_store`
--

CREATE TABLE `store_store` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_store`
--

INSERT INTO `store_store` (`id`, `name`, `address`, `created_at`, `updated_at`) VALUES
(1, 'STORE', '123 Test, HCM, Viet Nam', '2024-03-30 03:42:22.240594', '2024-03-30 03:42:22.240594');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_account`
--
ALTER TABLE `account_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `background_background`
--
ALTER TABLE `background_background`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `device_device`
--
ALTER TABLE `device_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_device_store_id_id_006e4721_fk_store_store_id` (`store_id_id`),
  ADD KEY `device_device_user_id_f5cc8c87_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `filter_filter`
--
ALTER TABLE `filter_filter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `frame_frame`
--
ALTER TABLE `frame_frame`
  ADD PRIMARY KEY (`id`),
  ADD KEY `frame_frame_device_id_id_6d2577db_fk_device_device_id` (`device_id_id`);

--
-- Indexes for table `layout_layout`
--
ALTER TABLE `layout_layout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_layout_frame_id_24f46f3c_fk_frame_frame_id` (`frame_id`),
  ADD KEY `layout_layout_background_id_9e839ebc_fk_background_background_id` (`background_id`);

--
-- Indexes for table `payment_payment`
--
ALTER TABLE `payment_payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`) USING HASH;

--
-- Indexes for table `revenue_order`
--
ALTER TABLE `revenue_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `revenue_order_device_id_id_faf433a9_fk_device_device_id` (`device_id_id`);

--
-- Indexes for table `revenue_transaction`
--
ALTER TABLE `revenue_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `revenue_transaction_order_id_id_db8bafb0_fk_revenue_order_id` (`order_id_id`),
  ADD KEY `revenue_transaction_payment_id_id_dfb6cabc_fk_payment_payment_id` (`payment_id_id`);

--
-- Indexes for table `sticker_sticker`
--
ALTER TABLE `sticker_sticker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_store`
--
ALTER TABLE `store_store`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_account`
--
ALTER TABLE `account_account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `background_background`
--
ALTER TABLE `background_background`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `device_device`
--
ALTER TABLE `device_device`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `filter_filter`
--
ALTER TABLE `filter_filter`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `frame_frame`
--
ALTER TABLE `frame_frame`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `layout_layout`
--
ALTER TABLE `layout_layout`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `payment_payment`
--
ALTER TABLE `payment_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `revenue_order`
--
ALTER TABLE `revenue_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `revenue_transaction`
--
ALTER TABLE `revenue_transaction`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `sticker_sticker`
--
ALTER TABLE `sticker_sticker`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `store_store`
--
ALTER TABLE `store_store`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `device_device`
--
ALTER TABLE `device_device`
  ADD CONSTRAINT `device_device_store_id_id_006e4721_fk_store_store_id` FOREIGN KEY (`store_id_id`) REFERENCES `store_store` (`id`),
  ADD CONSTRAINT `device_device_user_id_f5cc8c87_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `frame_frame`
--
ALTER TABLE `frame_frame`
  ADD CONSTRAINT `frame_frame_device_id_id_6d2577db_fk_device_device_id` FOREIGN KEY (`device_id_id`) REFERENCES `device_device` (`id`);

--
-- Constraints for table `layout_layout`
--
ALTER TABLE `layout_layout`
  ADD CONSTRAINT `layout_layout_background_id_9e839ebc_fk_background_background_id` FOREIGN KEY (`background_id`) REFERENCES `background_background` (`id`),
  ADD CONSTRAINT `layout_layout_frame_id_24f46f3c_fk_frame_frame_id` FOREIGN KEY (`frame_id`) REFERENCES `frame_frame` (`id`);

--
-- Constraints for table `revenue_order`
--
ALTER TABLE `revenue_order`
  ADD CONSTRAINT `revenue_order_device_id_id_faf433a9_fk_device_device_id` FOREIGN KEY (`device_id_id`) REFERENCES `device_device` (`id`);

--
-- Constraints for table `revenue_transaction`
--
ALTER TABLE `revenue_transaction`
  ADD CONSTRAINT `revenue_transaction_order_id_id_db8bafb0_fk_revenue_order_id` FOREIGN KEY (`order_id_id`) REFERENCES `revenue_order` (`id`),
  ADD CONSTRAINT `revenue_transaction_payment_id_id_dfb6cabc_fk_payment_payment_id` FOREIGN KEY (`payment_id_id`) REFERENCES `payment_payment` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

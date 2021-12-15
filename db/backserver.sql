/*
 Navicat Premium Data Transfer

 Source Server         : database
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : backserver

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 15/12/2021 09:49:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `cat_id` int(0) NOT NULL,
  `cat_pid` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL,
  `cat_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `cat_level` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `cat_deleted` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  PRIMARY KEY (`cat_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (201, '0', '大家电', '0', 'false');
INSERT INTO `goods` VALUES (202, '0', '热门推荐', '0', 'false');
INSERT INTO `goods` VALUES (203, '0', '海外购', '0', 'false');
INSERT INTO `goods` VALUES (204, '0', '手机相机', '0', 'false');
INSERT INTO `goods` VALUES (205, '0', '笔记本', '0', 'false');
INSERT INTO `goods` VALUES (206, '0', '台式机', '0', 'false');
INSERT INTO `goods` VALUES (207, '0', '扫地机器人', '0', 'false');
INSERT INTO `goods` VALUES (301, '201', '电视', '1', 'false');
INSERT INTO `goods` VALUES (302, '201', '冰箱', '1', 'false');
INSERT INTO `goods` VALUES (303, '201', '洗衣机', '1', 'false');
INSERT INTO `goods` VALUES (304, '201', '空调', '1', 'false');
INSERT INTO `goods` VALUES (305, '202', '热门家具', '1', 'false');
INSERT INTO `goods` VALUES (306, '202', '热门地板', '1', 'false');
INSERT INTO `goods` VALUES (307, '202', '热门沙发', '1', 'false');
INSERT INTO `goods` VALUES (308, '203', '亚马逊', '1', 'false');
INSERT INTO `goods` VALUES (309, '203', 'ebay', '1', 'false');
INSERT INTO `goods` VALUES (310, '203', 'supreme', '1', 'false');
INSERT INTO `goods` VALUES (311, '204', '苹果', '1', 'false');
INSERT INTO `goods` VALUES (312, '204', '三星', '1', 'false');
INSERT INTO `goods` VALUES (313, '204', '华为', '1', 'false');
INSERT INTO `goods` VALUES (314, '204', '魅族', '1', 'false');
INSERT INTO `goods` VALUES (315, '205', '苹果', '1', 'false');
INSERT INTO `goods` VALUES (316, '205', '联想', '1', 'false');
INSERT INTO `goods` VALUES (317, '205', '戴尔', '1', 'false');
INSERT INTO `goods` VALUES (318, '206', '惠普', '1', 'false');
INSERT INTO `goods` VALUES (319, '206', '宏基', '1', 'false');
INSERT INTO `goods` VALUES (320, '206', '神舟', '1', 'false');
INSERT INTO `goods` VALUES (321, '207', '地宝', '1', 'false');
INSERT INTO `goods` VALUES (322, '207', '科沃斯', '1', 'false');
INSERT INTO `goods` VALUES (323, '207', '小米', '1', 'false');
INSERT INTO `goods` VALUES (401, '301', '夏普', '2', 'false');
INSERT INTO `goods` VALUES (402, '301', '索尼', '2', 'false');
INSERT INTO `goods` VALUES (403, '301', '小米', '2', 'false');
INSERT INTO `goods` VALUES (404, '302', '海尔', '2', 'false');
INSERT INTO `goods` VALUES (405, '302', '西门子', '2', 'false');
INSERT INTO `goods` VALUES (406, '302', '海尔', '2', 'false');
INSERT INTO `goods` VALUES (407, '303', '小天鹅', '2', 'false');
INSERT INTO `goods` VALUES (408, '303', '飞利浦', '2', 'false');
INSERT INTO `goods` VALUES (409, '303', '海尔', '2', 'false');
INSERT INTO `goods` VALUES (410, '304', '格力', '2', 'false');
INSERT INTO `goods` VALUES (411, '304', '美的', '2', 'false');
INSERT INTO `goods` VALUES (412, '304', '海尔', '2', 'false');
INSERT INTO `goods` VALUES (413, '305', '沙发', '2', 'false');
INSERT INTO `goods` VALUES (414, '305', '茶几', '2', 'false');
INSERT INTO `goods` VALUES (415, '305', '餐桌', '2', 'false');
INSERT INTO `goods` VALUES (416, '306', '圣象', '2', 'false');
INSERT INTO `goods` VALUES (417, '306', '伯爵地板', '2', 'false');
INSERT INTO `goods` VALUES (418, '306', '多乐', '2', 'false');
INSERT INTO `goods` VALUES (419, '307', '全友', '2', 'false');
INSERT INTO `goods` VALUES (420, '307', '红星美凯龙', '2', 'false');
INSERT INTO `goods` VALUES (421, '307', '爱家', '2', 'false');
INSERT INTO `goods` VALUES (422, '308', '服装', '2', 'false');
INSERT INTO `goods` VALUES (423, '308', '美食', '2', 'false');
INSERT INTO `goods` VALUES (424, '308', '日用', '2', 'false');
INSERT INTO `goods` VALUES (425, '309', '每日淘', '2', 'false');
INSERT INTO `goods` VALUES (426, '309', 'eday', '2', 'false');
INSERT INTO `goods` VALUES (427, '309', '精品推荐', '2', 'false');
INSERT INTO `goods` VALUES (428, '310', '帽子', '2', 'false');
INSERT INTO `goods` VALUES (429, '310', '卫衣', '2', 'false');
INSERT INTO `goods` VALUES (430, '310', '裤子', '2', 'false');
INSERT INTO `goods` VALUES (431, '311', 'iPhoneX', '2', 'false');
INSERT INTO `goods` VALUES (432, '311', 'iPhone12', '2', 'false');
INSERT INTO `goods` VALUES (433, '311', 'iPhone13', '2', 'false');
INSERT INTO `goods` VALUES (434, '312', 'Glaxy系列', '2', 'false');
INSERT INTO `goods` VALUES (435, '312', '创世翻盖系列', '2', 'false');
INSERT INTO `goods` VALUES (436, '312', 'Glaxy Note', '2', 'false');
INSERT INTO `goods` VALUES (437, '313', '荣耀', '2', 'false');
INSERT INTO `goods` VALUES (438, '313', 'nova', '2', 'false');
INSERT INTO `goods` VALUES (439, '313', 'Mate', '2', 'false');
INSERT INTO `goods` VALUES (440, '314', 'MX2', '2', 'false');
INSERT INTO `goods` VALUES (441, '314', 'MX5', '2', 'false');
INSERT INTO `goods` VALUES (442, '314', 'MX2巅峰创世版', '2', 'false');
INSERT INTO `goods` VALUES (443, '315', 'MacBook Air', '2', 'false');
INSERT INTO `goods` VALUES (444, '315', 'MacBook Pro', '2', 'false');
INSERT INTO `goods` VALUES (445, '315', 'iPad', '2', 'false');
INSERT INTO `goods` VALUES (446, '316', '小新', '2', 'false');
INSERT INTO `goods` VALUES (447, '316', '拯救者', '2', 'false');
INSERT INTO `goods` VALUES (448, '316', 'Idea', '2', 'false');
INSERT INTO `goods` VALUES (449, '317', '灵越', '2', 'false');
INSERT INTO `goods` VALUES (450, '317', '成就', '2', 'false');
INSERT INTO `goods` VALUES (451, '317', '3510', '2', 'false');
INSERT INTO `goods` VALUES (452, '318', '战系列', '2', 'false');
INSERT INTO `goods` VALUES (453, '318', '星系列', '2', 'false');
INSERT INTO `goods` VALUES (454, '318', '暗夜精灵', '2', 'false');
INSERT INTO `goods` VALUES (455, '319', '墨舞', '2', 'false');
INSERT INTO `goods` VALUES (456, '319', '暗影骑士', '2', 'false');
INSERT INTO `goods` VALUES (457, '319', '新蜂鸟', '2', 'false');
INSERT INTO `goods` VALUES (458, '320', '炫龙', '2', 'false');
INSERT INTO `goods` VALUES (459, '320', '战神', '2', 'false');
INSERT INTO `goods` VALUES (460, '320', '优雅', '2', 'false');
INSERT INTO `goods` VALUES (461, '321', 'X1', '2', 'false');
INSERT INTO `goods` VALUES (462, '321', 'X2', '2', 'false');
INSERT INTO `goods` VALUES (463, '321', 'X3', '2', 'false');
INSERT INTO `goods` VALUES (464, '322', 'T9', '2', 'false');
INSERT INTO `goods` VALUES (465, '322', 'T9Pro', '2', 'false');
INSERT INTO `goods` VALUES (466, '322', 'DGN22', '2', 'false');
INSERT INTO `goods` VALUES (467, '323', '1S', '2', 'false');
INSERT INTO `goods` VALUES (468, '323', '2S', '2', 'false');
INSERT INTO `goods` VALUES (469, '323', '2C', '2', 'false');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int(0) NOT NULL,
  `pid` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL,
  `authName` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `level` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `path` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (101, '0', '商品管理', '0', 'goods');
INSERT INTO `menu` VALUES (102, '0', '订单管理', '0', 'orders');
INSERT INTO `menu` VALUES (103, '0', '权限管理', '0', 'rights');
INSERT INTO `menu` VALUES (104, '101', '商品列表', '1', 'list');
INSERT INTO `menu` VALUES (105, '101', '分类参数', '1', 'data');
INSERT INTO `menu` VALUES (106, '101', '商品分类', '1', 'part');
INSERT INTO `menu` VALUES (110, '125', '用户列表', '1', 'users');
INSERT INTO `menu` VALUES (121, '102', '订单修改', '1', 'orderChange');
INSERT INTO `menu` VALUES (125, '0', '用户管理', '0', 'users');
INSERT INTO `menu` VALUES (131, '103', '角色列表', '1', 'roles');
INSERT INTO `menu` VALUES (132, '103', '权限列表', '1', 'rights');
INSERT INTO `menu` VALUES (145, '0', '数据统计', '0', 'dataStatistics');
INSERT INTO `menu` VALUES (146, '145', '数据修改', '1', 'dataModify');
INSERT INTO `menu` VALUES (1001, '131', '订单配置', '2', 'asd');
INSERT INTO `menu` VALUES (1002, '121', '订单产地', '2', '123');
INSERT INTO `menu` VALUES (1003, '121', '子菜单', '2', '123');
INSERT INTO `menu` VALUES (1004, '131', '角色信息', '2', '132');
INSERT INTO `menu` VALUES (1005, '132', '权限详情', '2', '123');
INSERT INTO `menu` VALUES (1006, '104', '商品详情', '2', '43213');
INSERT INTO `menu` VALUES (1007, '105', '分类详情', '2', '1233');
INSERT INTO `menu` VALUES (1008, '106', '商品规划', '2', '123');
INSERT INTO `menu` VALUES (1009, '146', '修改设置', '2', '123');
INSERT INTO `menu` VALUES (1010, '105', '分类配置', '2', '1');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `roleId` int(0) NOT NULL,
  `order` varchar(10) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `roleName` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `roleDesc` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '1', '系统管理员', '系统管理员');
INSERT INTO `role` VALUES (2, '2', '管理员', '普通管理员');
INSERT INTO `role` VALUES (3, '3', '用户', '系统用户');

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `id` int(0) NOT NULL,
  `role_id` int(0) NULL DEFAULT NULL,
  `menu_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES (1, 1, 101);
INSERT INTO `role_menu` VALUES (2, 1, 102);
INSERT INTO `role_menu` VALUES (3, 2, 101);
INSERT INTO `role_menu` VALUES (4, 3, 104);
INSERT INTO `role_menu` VALUES (5, 1, 145);
INSERT INTO `role_menu` VALUES (6, 2, 103);

-- ----------------------------
-- Table structure for role_user
-- ----------------------------
DROP TABLE IF EXISTS `role_user`;
CREATE TABLE `role_user`  (
  `id` bigint(0) NOT NULL,
  `user_id` bigint(0) NULL DEFAULT NULL,
  `role_id` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_user
-- ----------------------------
INSERT INTO `role_user` VALUES (1, 1, 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL,
  `id` int(0) NOT NULL,
  `sex` varchar(5) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `email` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `create_time` varchar(30) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `mg_state` tinyint(0) NULL DEFAULT NULL,
  `job` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `tel` varchar(20) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `pwd` varchar(10) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  `role` varchar(10) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_czech_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('shady', 1, '男', '1159361asd@qq.com', '2021-9-20', 1, 'rapper', '1865449961', '123456', '超级管理员');
INSERT INTO `user` VALUES ('liaochen', 2, '男', '37614811sd@qq.com', '2021-9-20', 1, 'it民工', '17866622231', '971118', '超级管理员');
INSERT INTO `user` VALUES ('duly', 3, '女', '4622@163.com', '2021-9-20', 1, '无业游民', '15866992031', '123456', 'vip用户');
INSERT INTO `user` VALUES ('lucy', 4, '女', 'yahu@wesfdk', '2021-9-20', 0, '公务员', '13555982203', '123456', '普通用户');
INSERT INTO `user` VALUES ('21312', 7, NULL, '1231231231', NULL, NULL, NULL, '17899964879', '213123', '普通用户');
INSERT INTO `user` VALUES ('123', 26, NULL, '1231239', NULL, NULL, NULL, '12312312310', '123123', '普通用户');

SET FOREIGN_KEY_CHECKS = 1;

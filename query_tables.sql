-- Crear la base de datos --
CREATE DATABASE TikTok;

-- Para que los querys se hagan en la base de datos que creamos recién
USE TikTok;

-- Para que la base de datos acepte emojis --
ALTER DATABASE TikTok CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- QUERIES --
CREATE TABLE IF NOT EXISTS `queries` (
    `idQuery` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`idQuery`),
    KEY `idQuery` (`idQuery`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PERFIL --
CREATE TABLE IF NOT EXISTS `perfiles` (
    `idPerfil` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `url` VARCHAR(60) NOT NULL,
    `nombre_cuenta` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(100),
    `links` VARCHAR(255),
    PRIMARY KEY (`idPerfil`),
    KEY `idPerfil` (`idPerfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- DATA PERFIL --
CREATE TABLE IF NOT EXISTS `data_perfil` (
    `idData` INT(11) NOT NULL AUTO_INCREMENT,
    `idPerfil` INT(11) NOT NULL,
    `date` DATETIME NOT NULL,
    `dia` DATE NOT NULL,
    `siguiendo` BIGINT NOT NULL,
    `seguidores` BIGINT NOT NULL,
    `me_gusta` BIGINT NOT NULL,
    `videos` BIGINT NOT NULL,
    `img_url` VARCHAR(255),
    `ready` INT(1), -- 0 -> Listo, 1 -> Scroll, 2 -> Preparandose, 3 -> Error
    `loopVideo` BIGINT NOT NULL, -- En que n° de video esta obteniendo info actualmente
    PRIMARY KEY (`idData`),
    KEY `date` (`date`),
    FOREIGN KEY (idPerfil) REFERENCES perfiles(idPerfil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- VIDEOS --
CREATE TABLE IF NOT EXISTS `videos` (
    `idVideo` INT (11) NOT NULL AUTO_INCREMENT,
    `date` DATETIME NOT NULL,
    `dia` DATE NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `idPerfil` INT(11) NOT NULL,
    `video_n` INT NOT NULL,
    `url` VARCHAR(200) NOT NULL,
    `vistas` BIGINT NOT NULL,
    `descripcion` VARCHAR(255),
    `fecha` DATETIME NOT NULL,
    `musica` VARCHAR(150),
    `me_gusta` BIGINT NOT NULL,
    `comentarios` BIGINT NOT NULL,
    `engagement` DOUBLE NOT NULL,
    PRIMARY KEY (`idVideo`),
    KEY `date` (`date`),
    FOREIGN KEY (idPerfil) REFERENCES perfiles(idPerfil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

/*
mysql> describe queries; describe perfiles; describe data_perfil; describe videos;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| idQuery  | int         | NO   | PRI | NULL    | auto_increment |
| username | varchar(25) | NO   |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
2 rows in set (0.01 sec)

+---------------+--------------+------+-----+---------+----------------+
| Field         | Type         | Null | Key | Default | Extra          |
+---------------+--------------+------+-----+---------+----------------+
| idPerfil      | int          | NO   | PRI | NULL    | auto_increment |
| username      | varchar(25)  | NO   |     | NULL    |                |
| url           | varchar(60)  | NO   |     | NULL    |                |
| nombre_cuenta | varchar(50)  | NO   |     | NULL    |                |
| descripcion   | varchar(100) | YES  |     | NULL    |                |
| links         | varchar(255) | YES  |     | NULL    |                |
+---------------+--------------+------+-----+---------+----------------+
6 rows in set (0.00 sec)

+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| idData     | int          | NO   | PRI | NULL    | auto_increment |
| idPerfil   | int          | NO   | MUL | NULL    |                |
| date       | datetime     | NO   | MUL | NULL    |                |
| dia        | date         | NO   |     | NULL    |                |
| siguiendo  | bigint       | NO   |     | NULL    |                |
| seguidores | bigint       | NO   |     | NULL    |                |
| me_gusta   | bigint       | NO   |     | NULL    |                |
| videos     | bigint       | NO   |     | NULL    |                |
| img_url    | varchar(255) | YES  |     | NULL    |                |
| ready      | int          | YES  |     | NULL    |                |
| loopVideo  | bigint       | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
11 rows in set (0.00 sec)

+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| idVideo     | int          | NO   | PRI | NULL    | auto_increment |
| date        | datetime     | NO   | MUL | NULL    |                |
| dia         | date         | NO   |     | NULL    |                |
| username    | varchar(25)  | NO   |     | NULL    |                |
| idPerfil    | int          | NO   | MUL | NULL    |                |
| video_n     | int          | NO   |     | NULL    |                |
| url         | varchar(200) | NO   |     | NULL    |                |
| vistas      | bigint       | NO   |     | NULL    |                |
| descripcion | varchar(255) | YES  |     | NULL    |                |
| fecha       | datetime     | NO   |     | NULL    |                |
| musica      | varchar(150) | YES  |     | NULL    |                |
| me_gusta    | bigint       | NO   |     | NULL    |                |
| comentarios | bigint       | NO   |     | NULL    |                |
| engagement  | double       | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
14 rows in set (0.01 sec)

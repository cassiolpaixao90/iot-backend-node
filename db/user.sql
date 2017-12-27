CREATE TABLE `iot-db`.`users` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `instalacao`    VARCHAR(100) NOT NULL,
  `nome_cliente`  VARCHAR(200) NOT NULL,
  `email`         VARCHAR(100) NOT NULL,
  `senha`         VARCHAR(200) NOT NULL,
  `salt`          VARCHAR(200) NOT NULL,
  `updated_at`    DATETIME     NOT NULL,
  `created_at`    DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `instalacao_UNIQUE` (`instalacao` ASC));

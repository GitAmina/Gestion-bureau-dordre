-- CreateTable
CREATE TABLE `Courrier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `expediteur` VARCHAR(191) NOT NULL,
    `destinataire` VARCHAR(191) NOT NULL,
    `sujet` VARCHAR(191) NULL,
    `contenu` VARCHAR(191) NULL,
    `etat` VARCHAR(191) NOT NULL DEFAULT 'En attente',
    `date_reception` DATETIME(3) NULL,
    `date_envoi` DATETIME(3) NULL,
    `fichier_numerise` VARCHAR(191) NULL,
    `departement_id` INTEGER NULL,

    UNIQUE INDEX `Courrier_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_update` DATETIME(3) NOT NULL,
    `cree_par_id` INTEGER NULL,
    `update_par_id` INTEGER NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `responsable_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Archive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courrier_id` INTEGER NOT NULL,
    `fichier_numerise` VARCHAR(191) NOT NULL,
    `categorie` VARCHAR(191) NULL,
    `date_archivage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rapport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `date_generation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `donnees` JSON NOT NULL,
    `format` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Courrier` ADD CONSTRAINT `Courrier_departement_id_fkey` FOREIGN KEY (`departement_id`) REFERENCES `Departement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_cree_par_id_fkey` FOREIGN KEY (`cree_par_id`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_update_par_id_fkey` FOREIGN KEY (`update_par_id`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departement` ADD CONSTRAINT `Departement_responsable_id_fkey` FOREIGN KEY (`responsable_id`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Archive` ADD CONSTRAINT `Archive_courrier_id_fkey` FOREIGN KEY (`courrier_id`) REFERENCES `Courrier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

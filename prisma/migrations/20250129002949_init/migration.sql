-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdate` DATETIME(3) NOT NULL,
    `creeParId` INTEGER NULL,
    `updateParId` INTEGER NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `responsableId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `dateReception` DATETIME(3) NULL,
    `dateEnvoi` DATETIME(3) NULL,
    `fichierNumerise` VARCHAR(191) NULL,
    `departementId` INTEGER NULL,

    UNIQUE INDEX `Courrier_reference_key`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Archive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courrierId` INTEGER NOT NULL,
    `fichierNumerise` VARCHAR(191) NOT NULL,
    `categorie` VARCHAR(191) NULL,
    `dateArchivage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rapport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `dateGeneration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `donnees` JSON NOT NULL,
    `format` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_creeParId_fkey` FOREIGN KEY (`creeParId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_updateParId_fkey` FOREIGN KEY (`updateParId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departement` ADD CONSTRAINT `Departement_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Courrier` ADD CONSTRAINT `Courrier_departementId_fkey` FOREIGN KEY (`departementId`) REFERENCES `Departement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Archive` ADD CONSTRAINT `Archive_courrierId_fkey` FOREIGN KEY (`courrierId`) REFERENCES `Courrier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

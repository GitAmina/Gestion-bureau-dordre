-- DropIndex
DROP INDEX `Archive_courrier_id_fkey` ON `archive`;

-- DropIndex
DROP INDEX `Courrier_departement_id_fkey` ON `courrier`;

-- DropIndex
DROP INDEX `Departement_responsable_id_fkey` ON `departement`;

-- DropIndex
DROP INDEX `Utilisateur_cree_par_id_fkey` ON `utilisateur`;

-- DropIndex
DROP INDEX `Utilisateur_update_par_id_fkey` ON `utilisateur`;

-- AlterTable
ALTER TABLE `utilisateur` ADD COLUMN `prenom` VARCHAR(191) NOT NULL DEFAULT 'Inconnu';

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

-- Script de création des tables HotelPro
-- Exécutez ce script UNE SEULE FOIS dans phpMyAdmin

-- Table Clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `telephone` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `codePostal` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `statut` enum('nouveau','regulier','vip') NOT NULL DEFAULT 'nouveau',
  `depensesTotales` decimal(10,2) NOT NULL DEFAULT 0.00,
  `nombreReservations` int(11) NOT NULL DEFAULT 0,
  `dateCreation` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `dateModification` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Chambres
CREATE TABLE IF NOT EXISTS `chambres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) NOT NULL UNIQUE,
  `type` enum('standard','double','deluxe','suite','suite_presidentielle') NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `capacite` int(11) NOT NULL,
  `etage` int(11) NOT NULL,
  `superficie` decimal(5,2) NOT NULL,
  `description` text DEFAULT NULL,
  `statut` enum('disponible','occupee','maintenance') NOT NULL DEFAULT 'disponible',
  `equipements` json DEFAULT NULL,
  `dateCreation` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `dateModification` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Réservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateDebut` date NOT NULL,
  `dateFin` date NOT NULL,
  `heureArrivee` time DEFAULT NULL,
  `heureDepart` time DEFAULT NULL,
  `nombreAdultes` int(11) NOT NULL,
  `nombreEnfants` int(11) NOT NULL DEFAULT 0,
  `statut` enum('en_attente','confirmee','en_cours','terminee','annulee') NOT NULL DEFAULT 'en_attente',
  `prixTotal` decimal(10,2) NOT NULL,
  `demandesSpeciales` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `dateCreation` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `dateModification` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `clientId` int(11) NOT NULL,
  `chambreId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_client` (`clientId`),
  KEY `FK_chambre` (`chambreId`),
  CONSTRAINT `FK_client` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_chambre` FOREIGN KEY (`chambreId`) REFERENCES `chambres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Paiements
CREATE TABLE IF NOT EXISTS `paiements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `montant` decimal(10,2) NOT NULL,
  `methode` enum('carte_bancaire','especes','virement','paypal') NOT NULL,
  `statut` enum('en_attente','valide','rembourse','echoue') NOT NULL DEFAULT 'en_attente',
  `notes` text DEFAULT NULL,
  `datePaiement` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `reservationId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservation` (`reservationId`),
  CONSTRAINT `FK_reservation` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
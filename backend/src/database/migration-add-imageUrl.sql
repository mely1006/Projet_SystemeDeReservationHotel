-- Migration: Ajouter la colonne imageUrl aux chambres
-- Exécutez ce script pour mettre à jour votre base de données

-- Ajouter la colonne imageUrl si elle n'existe pas
ALTER TABLE `chambres` ADD COLUMN `imageUrl` varchar(255) NULL DEFAULT NULL AFTER `equipements`;

-- Ajouter quelques données de test
INSERT INTO `chambres` (`numero`, `type`, `prix`, `capacite`, `etage`, `superficie`, `description`, `statut`, `equipements`, `imageUrl`, `dateCreation`, `dateModification`) VALUES
('101', 'standard', 5000, 2, 1, 25.00, 'Chambre Standard confortable avec vue sur la cour', 'disponible', '["WiFi", "TV", "Climatisation"]', '/uploads/chambres/101.jpg', NOW(), NOW()),
('102', 'standard', 5000, 2, 1, 25.00, 'Chambre Standard avec salle de bain privée', 'disponible', '["WiFi", "TV", "Climatisation", "Minibar"]', '/uploads/chambres/102.jpg', NOW(), NOW()),
('201', 'double', 8000, 4, 2, 35.00, 'Chambre Double spacieuse avec lit king size', 'disponible', '["WiFi", "TV", "Climatisation", "Minibar", "Douche"]', '/uploads/chambres/201.jpg', NOW(), NOW()),
('202', 'double', 8000, 4, 2, 35.00, 'Chambre Double avec balcon', 'disponible', '["WiFi", "TV", "Climatisation", "Balcon", "Coffre-fort"]', '/uploads/chambres/202.jpg', NOW(), NOW()),
('301', 'deluxe', 12000, 2, 3, 40.00, 'Suite Deluxe avec jacuzzi', 'disponible', '["WiFi", "TV", "Climatisation", "Jacuzzi", "Minibar", "Vue panoramique"]', '/uploads/chambres/301.jpg', NOW(), NOW()),
('302', 'suite', 15000, 4, 3, 50.00, 'Suite avec salon séparé', 'disponible', '["WiFi", "TV", "Climatisation", "Salon", "2 salles de bain"]', '/uploads/chambres/302.jpg', NOW(), NOW()),
('303', 'suite_presidentielle', 25000, 6, 3, 80.00, 'Suite Présidentielle luxe avec tous les équipements', 'disponible', '["WiFi", "TV", "Climatisation", "Salon", "Cuisine", "3 salles de bain", "Terrasse"]', '/uploads/chambres/303.jpg', NOW(), NOW());

-- Ajouter quelques clients de test
INSERT INTO `clients` (`prenom`, `nom`, `email`, `telephone`, `adresse`, `ville`, `codePostal`, `pays`, `statut`, `depensesTotales`, `nombreReservations`, `dateCreation`, `dateModification`) VALUES
('Jean', 'Dupont', 'jean.dupont@email.com', '0123456789', '123 Rue de Paris', 'Paris', '75001', 'France', 'regulier', 45000, 3, NOW(), NOW()),
('Marie', 'Martin', 'marie.martin@email.com', '0234567890', '456 Rue de Lyon', 'Lyon', '69001', 'France', 'vip', 120000, 8, NOW(), NOW()),
('Pierre', 'Bernard', 'pierre.bernard@email.com', '0345678901', '789 Rue de Marseille', 'Marseille', '13001', 'France', 'nouveau', 8000, 1, NOW(), NOW());

COMMIT;

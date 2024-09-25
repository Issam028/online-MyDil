<?php
$servername = "10.0.0.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

// Dossier de destination pour les images
$targetDir = "./assets/img/depot/";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nom_materiel = $_POST['nom_materiel'];
        $quantite = $_POST['quantite'];
        $reserver = $_POST['reserver'];
        $indisponible = $_POST['indisponible'];

        // Gestion des fichiers d'images
        $images = [];
        if (!empty($_FILES['images_materiel']['name'][0])) {
            foreach ($_FILES['images_materiel']['tmp_name'] as $key => $tmp_name) {
                $fileName = basename($_FILES['images_materiel']['name'][$key]);
                $targetFilePath = $targetDir . $fileName;

                // Déplacer le fichier dans le dossier de destination
                if (move_uploaded_file($tmp_name, $targetFilePath)) {
                    $images[] = $targetFilePath; // Enregistrer le chemin de l'image
                }
            }
        }

        // Convertir les chemins d'images en une chaîne séparée par des virgules pour les enregistrer
        $imagePaths = implode(',', $images);

        // Insertion du matériel avec le chemin des images
        $stmt = $conn->prepare("INSERT INTO materiel (nom_materiel, quantite, reserver, indisponible, img) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$nom_materiel, $quantite, $reserver, $indisponible, $imagePaths]);

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn = null;
?>

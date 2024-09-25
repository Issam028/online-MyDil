<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $nom = $_POST['nom'];
    $quantite = $_POST['quantite'];
    $reserve = $_POST['reserve'];
    $indisponible = $_POST['indisponible'];

    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'L\'ID du matériel est manquant.']);
        exit;
    }

    try {
        // Connexion à la base de données avec PDO
        $dsn = 'mysql:host=10.10.10.3;dbname=my_dil;charset=utf8';
        $username = 'root';
        $password = 'root';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        $pdo = new PDO($dsn, $username, $password, $options);

        // Prépare et exécute la requête de mise à jour
        $sql = 'UPDATE materiel SET nom_materiel = ?, quantite = ?, reserver = ?, indisponible = ? WHERE id_materiel = ?';
        $stmt = $pdo->prepare($sql);

        $stmt->execute([$nom, $quantite, $reserve, $indisponible, $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'success', 'message' => 'Aucune mise à jour effectuée.']);
        }
    } catch (PDOException $e) {
        // Gestion des erreurs
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour du matériel : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Méthode de requête invalide.']);
}
?>

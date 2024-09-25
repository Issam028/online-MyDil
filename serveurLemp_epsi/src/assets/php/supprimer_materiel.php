<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];

    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'L\'ID du mat�riel est manquant.']);
        exit;
    }

    try {
        // Connexion � la base de donn�es avec PDO
        $dsn = 'mysql:host=10.10.10.3;dbname=my_dil;charset=utf8';
        $username = 'root';
        $password = 'root';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        $pdo = new PDO($dsn, $username, $password, $options);

        // Pr�pare et ex�cute la requ�te de suppression
        $sql = 'DELETE FROM materiel WHERE id_materiel = ?';
        $stmt = $pdo->prepare($sql);

        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Aucun mat�riel correspondant � cet ID n\'a �t� trouv�.']);
        }
    } catch (PDOException $e) {
        // Gestion des erreurs
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la suppression du mat�riel : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'M�thode de requ�te invalide.']);
}
?>

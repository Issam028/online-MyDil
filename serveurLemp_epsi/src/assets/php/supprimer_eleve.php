<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

// V�rification de la m�thode de la requ�te
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // R�cup�ration de l'ID � supprimer
    $id = isset($_POST['id']) ? $_POST['id'] : null;

    if ($id !== null) {
        try {
            // Connexion � la base de donn�es
            $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Pr�paration de la requ�te de suppression
            $stmt = $conn->prepare("DELETE FROM eleve WHERE id_eleve = ?");
            $stmt->execute([$id]);

            // V�rification de la suppression r�ussie
            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Aucun enregistrement supprim�.']);
            }
        } catch (PDOException $e) {
            // Gestion des erreurs PDO
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la suppression de l\'�l�ve: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'L\'ID de l\'�l�ve � supprimer est manquant.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'M�thode de requ�te invalide.']);
}
?>

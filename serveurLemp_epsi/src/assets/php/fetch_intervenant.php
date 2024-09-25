<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

try {
    // Connexion � la base de donn�es
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pr�paration de la requ�te de s�lection pour les professeurs
    $stmt = $conn->prepare("
        SELECT id_enseignant, nom, prenom
        FROM enseignant
    ");
    if (!$stmt->execute()) {
        $errorInfo = $stmt->errorInfo();
        echo json_encode(['status' => 'error', 'message' => 'Erreur SQL: ' . $errorInfo[2]]);
        exit;
    }

    // R�cup�ration des r�sultats
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch (PDOException $e) {
    // Gestion des erreurs PDO
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la r�cup�ration des donn�es des professeurs: ' . $e->getMessage()]);
}
$conn = null;
?>

<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

try {
    // Connexion � la base de donn�es
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pr�paration de la requ�te de s�lection avec jointure
    $stmt = $conn->prepare("
        SELECT eleve.id_eleve, eleve.nom, eleve.prenom, eleve.identifiant, classe.nom_classe AS classe
        FROM eleve
        JOIN classe ON eleve.id_classe = classe.id_classe
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
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la r�cup�ration des donn�es des �l�ves: ' . $e->getMessage()]);
}
$conn = null;
?>

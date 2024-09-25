<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if(isset($_POST['nom_professeur']) && isset($_POST['prenom_professeur']) && isset($_POST['identifiant_Professeur']) && isset($_POST['password'])) {
            $nom = $_POST['nom_professeur'];
            $prenom = $_POST['prenom_professeur'];
            $identifiant = $_POST['identifiant_Professeur'];
            $mot_de_passe = $_POST['password'];

            // �crire les param�tres dans le fichier journal des erreurs
            error_log("Nom: $nom, Pr�nom: $prenom,identifiant: $identifiant Mot de passe: $mot_de_passe");

            $stmt = $conn->prepare("INSERT INTO enseignant (nom, prenom, mot_de_passe, identifiant) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nom, $prenom, $mot_de_passe, $identifiant]);

            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }
} catch (PDOException $e) {
    // �crire l'erreur dans le fichier journal des erreurs
    error_log("Erreur PDO: " . $e->getMessage());

    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn = null;
?>

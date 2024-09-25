<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if(isset($_POST['nom']) && isset($_POST['prenom']) && isset($_POST['identifiant']) && isset($_POST['password']) && isset($_POST['classe'])) {
            $nom = $_POST['nom'];
            $prenom = $_POST['prenom'];
            $identifiant = $_POST['identifiant'];
            $mot_de_passe = $_POST['password'];
            $classe = $_POST['classe'];

            $stmt = $conn->prepare("INSERT INTO eleve (nom, prenom, identifiant, mot_de_passe, id_classe) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$nom, $prenom, $identifiant, $mot_de_passe, $classe]);

            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn = null;
?>

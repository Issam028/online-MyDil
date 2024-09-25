<?php
$servername = "10.10.10.3";
$username = "root";
$password = "root";
$dbname = "my_dil";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nom_classe = $_POST['nom_classe'];

        $stmt = $conn->prepare("INSERT INTO classe (nom_classe) VALUES (?)");
        $stmt->execute([$nom_classe]);

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn = null;
?>
<?php
if (isset($_FILES['csvFile']) && $_FILES['csvFile']['error'] === UPLOAD_ERR_OK) {
    $csvFile = $_FILES['csvFile']['tmp_name'];

    // Connexion à la base de données
    $connexion = new PDO('mysql:host=10.10.10.3;dbname=my_dil;charset=utf8', 'root', 'root');
    
    if ($connexion === false) {
        die("La connexion a échoué.");
    }

    // Ouvrir le fichier CSV
    if (($handle = fopen($csvFile, "r")) !== false) {
        // Lire chaque ligne du fichier
        while (($data = fgetcsv($handle, 1000, ",")) !== false) {
            // Assurez-vous que votre CSV a les colonnes dans l'ordre correct
            list($prenom, $nom, $identifiant, $mot_de_passe, $role) = $data;

            // Requête d'insertion
            $requeteInsertion = "INSERT INTO utilisateur (prenom, nom, identifiant, mot_de_passe, role) VALUES (:prenom, :nom, :identifiant, :mot_de_passe, :role)";
            $statement = $connexion->prepare($requeteInsertion);
            $statement->execute([
                'prenom' => $prenom,
                'nom' => $nom,
                'identifiant' => $identifiant,
                'mot_de_passe' => $mot_de_passe,
                'role' => $role
            ]);
        }
        fclose($handle);
    }

    // Redirection vers la page principale après l'importation
    header('Location: page_ajout_suppression_14.php');
    exit;
} else {
    echo "Erreur lors du téléchargement du fichier.";
}
?>

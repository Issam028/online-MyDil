<?php
session_start(); // Démarre la session

// Récupérer les données POST du formulaire HTML
$username = isset($_POST['email']) ? $_POST['email'] : null;
$plainPassword = isset($_POST['password']) ? $_POST['password'] : null;

// Débogage des données reçues
error_log("username: " . print_r($username, true));

if ($username && $plainPassword) {
    try {
        $bdd = new PDO('mysql:host=10.10.10.3;dbname=my_dil;charset=utf8', 'root', 'root');
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Rechercher l'utilisateur dans la table des utilisateurs
        $stmt = $bdd->prepare("SELECT * FROM utilisateurs WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($plainPassword, $user['mot_de_passe'])) {
            // Mot de passe correct
            $_SESSION['user_authenticated'] = true;
            $_SESSION['user_authenticated_time'] = time();

            // Vérifier si l'ID de l'utilisateur est défini avant de l'assigner
            $userId = isset($user['id_utilisateur']) ? $user['id_utilisateur'] : null;
            $_SESSION['user_id'] = $userId;

            // Récupérer le rôle de l'utilisateur
            $role = $user['role'];
            $_SESSION['user_role'] = $role;

            // Définir l'URL de redirection en fonction du rôle de l'utilisateur
            switch ($role) {
                case '0':
                    $redirectUrl = 'page_reservation.html';
                    break;
                case '1':
                    $redirectUrl = 'page_reservation.html';
                    break;
                case '2':
                    $redirectUrl = 'page_gestionBdd.html';
                    break;
                default:
                    $redirectUrl = 'login.html';
                    break;
            }

            echo json_encode(['success' => true, 'redirect' => $redirectUrl]);
        } else {
            // Mot de passe incorrect
            echo json_encode(['success' => false, 'message' => 'Nom d\'utilisateur ou mot de passe incorrect']);
            echo json_encode($username . $plainPassword . $user['mot_de_passe']);
        }
    } catch (PDOException $e) {
        error_log("Erreur PDO : " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
}

// Vérifier si la session a expiré après 5 minutes d'inactivité
if (isset($_SESSION['user_authenticated_time']) && $_SESSION['user_authenticated_time'] + 300 <= time()) {
    session_unset();
    session_destroy();
}
?>

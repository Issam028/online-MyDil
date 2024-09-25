<?php
// Connexion à la base de données
try {
    $bdd = new PDO('mysql:host=10.10.10.3;dbname=my_dil;charset=utf8', 'root', 'root');
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
date_default_timezone_set('Europe/Paris');
$debut_semaine = new DateTime($_GET['start_date']);
$fin_semaine = new DateTime($_GET['end_date']);
$start_date = $debut_semaine->format('Y-m-d');
$end_date = $fin_semaine->format('Y-m-d');

// Requête pour obtenir les réservations avec jointures
$sql = "
    SELECT
        reservation.id_reservation,
        salle.nom_salle,
        enseignant.nom,
        classe.nom_classe,
        reservation.id_activite,
        reservation.id_materiel,
        reservation.jour,
        reservation.horaire_debut,
        reservation.horaire_fin
    FROM reservation
    JOIN salle ON reservation.id_salle = salle.id_salle
    JOIN enseignant ON reservation.id_enseignant = enseignant.id_enseignant
    JOIN classe ON reservation.id_classe = classe.id_classe
    WHERE reservation.jour BETWEEN :start_date AND :end_date
";

$stmt = $bdd->prepare($sql);
$stmt->bindParam(':start_date', $start_date, PDO::PARAM_STR);
$stmt->bindParam(':end_date', $end_date, PDO::PARAM_STR);
$stmt->execute();
$reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Plages horaires
$plages_horaires = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00'
];
?>

<div class="table">
    <div class="header">
        <div class="cell">Heure</div>
        <div class="cell">Lundi</div>
        <div class="cell">Mardi</div>
        <div class="cell">Mercredi</div>
        <div class="cell">Jeudi</div>
        <div class="cell">Vendredi</div>
    </div>
    <?php foreach ($plages_horaires as $plage_horaire): ?>
        <div class="row">
            <div class="cell"><?= $plage_horaire ?></div>
            <?php foreach (['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'] as $jour): ?>
                <div class="cell"></div>
            <?php endforeach; ?>
        </div>
    <?php endforeach; ?>
    
    <?php foreach ($reservations as $reservation): 
        $heure_debut = substr($reservation['horaire_debut'], 0, 5);
        $heure_fin = substr($reservation['horaire_fin'], 0, 5);
        $jour_numero = date('N', strtotime($reservation['jour']));
        
        switch ($jour_numero) {
            case 1: $jour = 'lundi'; break;
            case 2: $jour = 'mardi'; break;
            case 3: $jour = 'mercredi'; break;
            case 4: $jour = 'jeudi'; break;
            case 5: $jour = 'vendredi'; break;
            default: continue 2;
        }
        
        $index_debut = array_search($heure_debut, $plages_horaires);
        $index_fin = array_search($heure_fin, $plages_horaires);
        $duration = ($index_fin - $index_debut + 1);
    ?>
        <div class="reservation" style="top: calc(30px * <?= $index_debut ?> + 30px); left: calc(16.66% * <?= $jour_numero ?>); height: calc(30px * <?= $duration-1 ?>); width: 16.66%;">
            <?= $reservation['nom'] . " - " . $reservation['nom_salle'] ?>
        </div>
    <?php endforeach; ?>
</div>

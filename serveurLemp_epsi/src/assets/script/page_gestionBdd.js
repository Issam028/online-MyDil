document.addEventListener("DOMContentLoaded", function () {

    const materielBtn = document.getElementById('materielBtn');
    const classeBtn = document.getElementById('classeBtn');
    const eleveBtn = document.getElementById('eleveBtn');
    const professeurBtn = document.getElementById('professeurBtn');
    const activiteBtn = document.getElementById('activiteBtn');

    const ajoutMaterielForm = document.getElementById('ajoutMaterielForm');
    const ajoutClasseForm = document.getElementById('ajoutClasseForm');
    const ajoutEleveForm = document.getElementById('ajoutEleveForm');
    const ajoutProfesseurForm = document.getElementById('ajoutProfesseurForm');
    const ajoutActiviteForm = document.getElementById('ajoutActiviteForm');

    const genererMotDePasseBtn = document.getElementById('genererMotDePasse');

    const materielSection = document.getElementById('materielSection');
    const classeSection = document.getElementById('classeSection');
    const eleveSection = document.getElementById('eleveSection');
    const professeurSection = document.getElementById('professeurSection');
    const activiteSection = document.getElementById('activiteSection');

    const classeSelect = document.getElementById('classe');

    // Pour le bouton de génération de mot de passe pour les élèves
    document.getElementById('genererMotDePasseEleve').addEventListener('click', function() {
        const motDePasse = genererMotDePasse();
        document.getElementById('mot_de_passe_eleve').value = motDePasse;
    });

    // Pour le bouton de génération de mot de passe pour les professeurs
    document.getElementById('genererMotDePasseProfesseur').addEventListener('click', function() {
        const motDePasse = genererMotDePasse();
        document.getElementById('mot_de_passe_professeur').value = motDePasse;
    });


    classeSelect.addEventListener('change', function () {
        const selectedOption = classeSelect.value; 
        console.log("Option sélectionnée :", selectedOption);
    });

    materielBtn.addEventListener('click', () => {
        afficherSection('materiel');
        fetchMaterielData();
    });


    classeBtn.addEventListener('click', () => {
        afficherSection('classe');
        fetchClasseData();
    });

    eleveBtn.addEventListener('click', () => {
        afficherSection('eleve');
        fetchEleveData();
    });

    professeurBtn.addEventListener('click', () => {
        afficherSection('professeur');
        fetchProfesseurData();
    });

    activiteBtn.addEventListener('click', () => {
        afficherSection('activite');
        fetchActiviteData();
    });

    ajoutMaterielForm.addEventListener('submit', ajouterMateriel);
    ajoutClasseForm.addEventListener('submit', ajouterClasse);
    ajoutEleveForm.addEventListener('submit', ajouterEleve);
    ajoutProfesseurForm.addEventListener('submit', ajouterProfesseur);
    // ajoutActiviteForm.addEventListener('submit', ajouterActivite);

    // Fonction pour afficher ou masquer les sections en fonction du bouton cliqué
    function afficherSection(section) {
        materielSection.style.display = 'none';
        classeSection.style.display = 'none';
        eleveSection.style.display = 'none';
        professeurSection.style.display = 'none';
        activiteSection.style.display = 'none';

        if (section === 'materiel') {
            materielSection.style.display = 'block';
        } else if (section === 'eleve') {
            eleveSection.style.display = 'block';
        } else if (section === 'professeur') {
            professeurSection.style.display = 'block';
        } else if (section === 'classe') {
            classeSection.style.display = 'block';
        } else if (section === 'activite') {
            activiteSection.style.display = 'block';
        }
    }

    // Fonction pour trier le tableau par colonne
    function sortTableByColumn(tableId, columnIndex) {
        const table = document.getElementById(tableId);
        const rows = Array.from(table.querySelectorAll('tr'));

        // Supprimer l'en-tête du tableau des données à trier
        rows.shift();

        rows.sort((a, b) => {
            const aValue = a.querySelectorAll('td')[columnIndex].textContent.trim();
            const bValue = b.querySelectorAll('td')[columnIndex].textContent.trim();
            return aValue.localeCompare(bValue);
        });

        // Réordonner les lignes dans le tableau
        table.innerHTML = '';
        rows.forEach(row => {
            table.appendChild(row);
        });
    }

    function fetchMaterielData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const materielData = JSON.parse(xhr.responseText);
                    if (materielData.error) {
                        console.error('Erreur:', materielData.error);
                    } else {
                        displayMaterielData(materielData);
                    }
                } else {
                    console.error('Erreur lors du chargement des données du matériel');
                }
            }
        };

        xhr.open('GET', 'assets/php/fetch_materiel.php');
        xhr.send();
    }

    function displayMaterielData(data) {
        const table = document.getElementById('materielTable');
        table.innerHTML = `
            <tr>
                <th>Nom du matériel</th>
                <th>Quantité</th>
                <th>Réservé</th>
                <th>Indisponible</th>
                <th>Action</th>
            </tr>
        `;

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nom_materiel}</td>
                <td>${item.quantite}</td>
                <td>${item.reserver}</td>
                <td>${item.indisponible}</td>
                <td><button class="edit-btn" data-id="${item.id_materiel}">Modifier</button></td>
            `;
            table.appendChild(row);
        });

        // Ajoute des écouteurs d'événements pour les boutons "Modifier"
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', editRow);
        });
    }

    function ajouterMateriel(event) {
        event.preventDefault();

        const formData = new FormData(ajoutMaterielForm);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        fetchMaterielData(); // Rafraîchir la table des matériels
                        ajoutMaterielForm.reset(); // Réinitialiser le formulaire
                    } else {
                        console.error('Erreur:', response.message);
                    }
                } else {
                    console.error('Erreur lors de l\'ajout du matériel');
                }
            }
        };

        xhr.open('POST', 'assets/php/ajout_materiel.php');
        xhr.send(formData);
    }

    function deleteRow(event) {
        const id = event.target.getAttribute('data-id');
        console.log('Bouton Supprimer cliqué, ID récupéré:', id);

        if (!id) {
            console.error('ID is undefined');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel?')) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'assets/php/supprimer_materiel.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            console.log('Requête AJAX pour suppression préparée.');

            xhr.onload = function () {
                console.log('Requête AJAX terminée, statut:', xhr.status);

                if (xhr.status === 200) {
                    console.log('Réponse reçue:', xhr.responseText);
                    var response = JSON.parse(xhr.responseText);

                    if (response.status === 'success') {
                        alert('Matériel supprimé avec succès');
                        console.log('Matériel supprimé, suppression de la ligne.');

                        // Assurez-vous que vous ciblez la ligne correcte
                        var row = event.target.closest('tr');
                        console.log('Élément cible (bouton):', event.target);
                        console.log('Ligne parente trouvée:', row);

                        if (row) {
                            row.parentNode.removeChild(row);
                            console.log('Ligne supprimée avec succès.');
                        } else {
                            console.error('Impossible de trouver la ligne parente.');
                        }
                    } else {
                        alert('Erreur: ' + response.message);
                        console.error('Erreur de réponse:', response.message);
                    }
                } else {
                    alert('Erreur lors de la suppression');
                    console.error('Erreur lors de la requête AJAX, statut:', xhr.status);
                }
            };

            xhr.onerror = function () {
                console.error('Erreur réseau lors de la requête AJAX.');
            };

            var postData = `id=${encodeURIComponent(id)}`;
            console.log('Données envoyées pour suppression:', postData);
            xhr.send(postData);
        }
    }

    function editRow(event) {
        const id = event.target.getAttribute('data-id');
        console.log('Bouton Modifier cliqué, ID récupéré:', id);

        if (!id) {
            console.error('ID is undefined');
            return;
        }
        var row = event.target.closest('tr');
        console.log('Ligne récupérée:', row);

        var cells = row.getElementsByTagName('td');
        console.log('Cellules de la ligne:', cells);

        if (event.target.textContent === 'Enregistrer') {
            console.log('Mode édition détecté, préparation de l\'envoi des données.');

            var data = {
                id: id,
                nom: cells[0].firstElementChild.value,
                quantite: parseInt(cells[1].firstElementChild.value, 10),
                reserve: parseInt(cells[2].firstElementChild.value, 10),
                indisponible: parseInt(cells[3].firstElementChild.value, 10),
            };
            console.log('Données préparées pour l\'envoi:', data);

            if (isNaN(data.quantite) || isNaN(data.reserve) || isNaN(data.indisponible)) {
                alert('Veuillez entrer des valeurs numériques valides pour quantité, réservé, et indisponible.');
                console.error('Valeurs non numériques détectées:', data);
                return;
            }

            if (data.quantite < data.reserve + data.indisponible) {
                alert('Erreur: La quantité doit être supérieure ou égale à la somme de réservé et indisponible.');
                console.error('Vérification échouée:', data);
                return;
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'assets/php/modif_materiel.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            console.log('Requête AJAX préparée.');

            xhr.onload = function () {
                console.log('Requête AJAX terminée, statut:', xhr.status);

                if (xhr.status === 200) {
                    console.log('Réponse reçue:', xhr.responseText);
                    var response = JSON.parse(xhr.responseText);

                    if (response.status === 'success') {
                        alert(response.message || 'Modification réussie');
                        console.log('Modification réussie, mise à jour de la ligne.');

                        cells[0].innerHTML = data.nom;
                        cells[1].innerHTML = data.quantite;
                        cells[2].innerHTML = data.reserve;
                        cells[3].innerHTML = data.indisponible;
                        event.target.textContent = 'Modifier';

                        var deleteButton = row.querySelector('.delete-button');
                        if (deleteButton) {
                            deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
                            deleteButton.remove();
                        }
                    } else {
                        alert('Erreur: ' + response.message);
                        console.error('Erreur de réponse:', response.message);
                    }
                } else {
                    alert('Erreur lors de la modification');
                    console.error('Erreur lors de la requête AJAX, statut:', xhr.status);
                }
            };

            var postData = `id=${encodeURIComponent(data.id)}&nom=${encodeURIComponent(data.nom)}&quantite=${encodeURIComponent(data.quantite)}&reserve=${encodeURIComponent(data.reserve)}&indisponible=${encodeURIComponent(data.indisponible)}`;
            console.log('Données envoyées:', postData);
            xhr.send(postData);
        } else {
            console.log('Mode affichage, transformation des cellules en champs de texte.');

            for (var i = 0; i < cells.length - 1; i++) {
                var value = cells[i].textContent;
                console.log('Valeur de la cellule:', value);
                cells[i].innerHTML = `<input type="text" value="${value}">`;
            }
            event.target.textContent = 'Enregistrer';
            console.log('Mode édition activé.');

            var deleteCell = document.createElement('td');
            deleteCell.className = 'delete-cell';

            if (!row.querySelector('.delete-button')) {
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.className = 'delete-button';
                deleteButton.setAttribute('data-id', id);
                deleteButton.onclick = deleteRow;
                deleteCell.appendChild(deleteButton);
                console.log('Bouton de suppression ajouté.');
            }

            row.appendChild(deleteCell);
        }
    }

    function fetchClasseData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const classeData = JSON.parse(xhr.responseText);
                    if (classeData.error) {
                        console.error('Erreur:', classeData.error);
                    } else {
                        displayClasseData(classeData);
                    }
                } else {
                    console.error('Erreur lors du chargement des données des classe');
                }
            }
        };

        xhr.open('GET', 'assets/php/fetch_classes.php');
        xhr.send();
    }

    function displayClasseData(data) {
        const table = document.getElementById('classeTable');
        table.innerHTML = `
            <tr>
                <th>Nom de la classe</th>
                <th>Action</th>
            </tr>
        `;

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nom_classe}</td>
                <td><button class="supprimerClasseBtn" data-id="${item.id_classe}">Supprimer</button></td>
            `;
            table.appendChild(row);
        });

        document.querySelectorAll('.supprimerClasseBtn').forEach(button => {
            button.addEventListener('click', supprimerClasse);
        });
    }

    function ajouterClasse(event) {
        event.preventDefault();

        const formData = new FormData(ajoutClasseForm);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        fetchClasseData(); // pour Rafraîchir le taleau des Classes
                        fetchClasses(); // pour Rafraîchir la liste dans eleves 
                        ajoutClasseForm.reset(); // pour Réinitialiser le formulaire
                    } else {
                        console.error('Erreur:', response.message);
                    }
                } else {
                    console.error('Erreur lors de l\'ajout de la Classe');
                }
            }
        };

        xhr.open('POST', 'assets/php/ajout_classe.php');
        xhr.send(formData);
    }

    function supprimerClasse(event) {
        const id = event.target.getAttribute('data-id');

        if (!id) {
            console.error('ID is undefined');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            fetchClasseData(); // Rafraîchir la table des Classes
                            fetchClasses(); // pour changer le tableau chez les eleves
                        } else {
                            console.error('Erreur:', response.message);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing JSON:', e);
                    }
                } else {
                    console.error('Erreur lors de la suppression de la Classe');
                }
            }
        };

        xhr.open('POST', 'assets/php/supprimer_Classe.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`id=${id}`);
    }

    function fetchEleveData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const eleveData = JSON.parse(xhr.responseText);
                    if (eleveData.error) {
                        console.error('Erreur:', eleveData.error);
                    } else {
                        displayEleveData(eleveData);
                    }
                } else {
                    console.error('Erreur lors du chargement des données des élèves');
                }
            }
        };

        xhr.open('GET', 'assets/php/fetch_eleve.php');
        xhr.send();
    }

    function displayEleveData(data) {
        const table = document.getElementById('eleveTable');
        table.innerHTML = `
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Identifiant</th>
                <th>Classe</th>
                <th>Action</th>
            </tr>
        `;

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nom}</td>
                <td>${item.prenom}</td>
                <td>${item.identifiant}</td>
                <td>${item.classe}</td> <!-- Ajout de la colonne "Classe" -->
                <td><button class="supprimerEleveBtn" data-id="${item.id_eleve}">Supprimer</button></td>
            `;
            table.appendChild(row);
        });

        document.querySelectorAll('.supprimerEleveBtn').forEach(button => {
            button.addEventListener('click', supprimerEleve);
        });
    }

    async function ajouterEleve(event) {
        event.preventDefault();
        const formData = new FormData(ajoutEleveForm);

        // Obtenir le mot de passe de l'élève
        const password = formData.get('password'); // Assurez-vous que le nom du champ de mot de passe est correct

        // Hasher le mot de passe en utilisant la fonction hashPassword()
        const hashedPassword = await hashPassword(password);

        // Remplacer le mot de passe en clair par le mot de passe hashé dans FormData
        formData.set('password', hashedPassword);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log('Response:', xhr.responseText); // Vérifiez la réponse brute
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            fetchEleveData(); // Rafraîchir la table des élèves
                            ajoutEleveForm.reset(); // Réinitialiser le formulaire
                        } else {
                            console.error('Erreur:', response.message);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing JSON:', e);
                    }
                } else {
                    console.error('Erreur lors de l\'ajout de l\'élève');
                }
            }
        };

        xhr.open('POST', 'assets/php/ajout_eleve.php');
        xhr.send(formData);
    }

    // Exemple de fonction de hachage utilisant crypto.subtle
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function supprimerEleve(event) {
        const id = event.target.getAttribute('data-id');

        if (!id) {
            console.error('ID is undefined');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            fetchEleveData(); // Rafraîchir la table des élèves
                        } else {
                            console.error('Erreur:', response.message);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing JSON:', e);
                    }
                } else {
                    console.error('Erreur lors de la suppression de l\'élève');
                }
            }
        };

        xhr.open('POST', 'assets/php/supprimer_eleve.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`id=${id}`);
    }

    function fetchProfesseurData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const professeurData = JSON.parse(xhr.responseText);
                    if (professeurData.error) {
                        console.error('Erreur:', professeurData.error);
                    } else {
                        displayProfesseurData(professeurData);
                    }
                } else {
                    console.error('Erreur lors du chargement des données des professeurs');
                }
            }
        };

        xhr.open('GET', 'assets/php/fetch_professeur.php');
        xhr.send();
    }

    function displayProfesseurData(data) {
        const table = document.getElementById('professeurTable');
        table.innerHTML = `
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Action</th>
            </tr>
        `;

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nom}</td>
                <td>${item.prenom}</td>
                <td><button class="supprimerProfesseurBtn" data-id="${item.id_enseignant}">Supprimer</button></td>
            `;
            table.appendChild(row);
        });

        document.querySelectorAll('.supprimerProfesseurBtn').forEach(button => {
            button.addEventListener('click', supprimerProfesseur);
        });
    }

    async function ajouterProfesseur(event) {
        event.preventDefault();
        const formData = new FormData(ajoutProfesseurForm);

        // Récupérer le mot de passe du formulaire
        const password = formData.get('password'); // Assurez-vous que le champ du mot de passe est nommé "password"

        // Hasher le mot de passe
        const hashedPassword = await hashPassword(mot_de_passe_professeur);

        // Remplacer le mot de passe en clair par le mot de passe hashé
        formData.set('password', hashedPassword);

        console.log(formData);
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log('Response:', xhr.responseText); // Vérifiez la réponse brute
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            fetchProfesseurData(); // Rafraîchir la table des professeurs
                            ajoutProfesseurForm.reset(); // Réinitialiser le formulaire
                        } else {
                            console.error('Erreur:', response.message);
                        }
                    } catch (e) {
                        console.error('Erreur de parsin JSON:', e);
                    }
                } else {
                    console.error('Erreur lors de l\'ajout du professeur');
                }
            }
        };

        xhr.open('POST', 'assets/php/ajout_professeur.php');
        xhr.send(formData);
    }


    function supprimerProfesseur(event) {
        const id = event.target.getAttribute('data-id');

        if (!id) {
            console.error('ID is undefined');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            fetchProfesseurData(); // Rafraîchir la table des professeurs
                        } else {
                            console.error('Erreur:', response.message);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing JSON:', e);
                    }
                } else {
                    console.error('Erreur lors de la suppression du professeur');
                }
            }
        };

        xhr.open('POST', 'assets/php/supprimer_professeur.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`id=${id}`);
    }

    function genererMotDePasse() {
        const lettres = 'abcdefghijklmnopqrstuvwxyz';
        const chiffres = '0123456789';
        let motDePasse = '';
        for (let i = 0; i < 5; i++) {
            motDePasse += lettres[Math.floor(Math.random() * lettres.length)];
        }
        for (let i = 0; i < 2; i++) {
            motDePasse += chiffres[Math.floor(Math.random() * chiffres.length)];
        }
        return motDePasse;
    }

    if (classeSelect) {
        fetchClasses();
    } else {
        console.error('Élément avec ID "classe" introuvable dans le DOM');
    }


    async function hashPassword(password) {
        // Convertir le mot de passe en Uint8Array
        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        // Hasher le mot de passe en utilisant l'API Web Crypto
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Convertir le buffer en tableau d'octets
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Convertir chaque octet en chaîne hexadécimale et joindre tous les octets
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetchActiviteData();
    });

    function fetchActiviteData() {
        fetch('assets/php/fetch_activite.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayActiviteData(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function displayActiviteData(data) {
        const container = document.querySelector('#activiteContainer');
        container.innerHTML = ''; // Clear existing content
        console.log("commencer le display");
        data.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.classList.add('activity');

            const title = document.createElement('h3');
            title.textContent = activity.title;
            activityDiv.appendChild(title);

            const description = document.createElement('p');
            description.textContent = activity.description;
            activityDiv.appendChild(description);

            const professor = document.createElement('p');
            professor.textContent = `Professeur : ${activity.professor_name}`;
            activityDiv.appendChild(professor);

            const classList = document.createElement('p');
            classList.textContent = `Classe : ${activity.class_name}`;
            activityDiv.appendChild(classList);

            const documents = document.createElement('div');
            documents.classList.add('documents');
            activity.documents.forEach(doc => {
                const a = document.createElement('a');
                a.href = doc.file_path;
                a.textContent = `Document: ${doc.file_path.split('/').pop()}`;
                a.target = '_blank';
                documents.appendChild(a);
                documents.appendChild(document.createElement('br'));
            });
            activityDiv.appendChild(documents);

            const videos = document.createElement('div');
            videos.classList.add('videos');
            activity.videos.forEach(video => {
                const videoElement = document.createElement('video');
                videoElement.src = video.file_path;
                videoElement.controls = true; // Add video controls (play, pause, etc.)
                videoElement.width = 320; // Optional: set a width for the video
                videoElement.height = 240; // Optional: set a height for the video
                videos.appendChild(videoElement);
                videos.appendChild(document.createElement('br'));
            });
            activityDiv.appendChild(videos);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.classList.add('delete-button');
            // Ajouter un event listener pour gérer la suppression ici, si nécessaire
            // deleteButton.addEventListener('click', function() {
            //     deleteActivity(activity.id);
            // });
            activityDiv.appendChild(deleteButton);

            container.appendChild(activityDiv);
        });
    }



    // Fonction pour récupérer et afficher les classes disponibles
    function fetchClasses() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const classes = JSON.parse(xhr.responseText);
                    displayClasses(classes);
                } else {
                    console.error('Erreur lors du chargement des classes');
                }
            }
        };

        xhr.open('GET', 'assets/php/fetch_classes.php');
        xhr.send();
    }

    // Fonction pour afficher les classes dans le menu déroulant
    function displayClasses(classes) {
        classeSelect.innerHTML = ''; // Effacer les anciennes options
        classes.forEach(classe => {
            const option = document.createElement('option');
            option.value = classe.id_classe; // Valeur de l'option
            option.textContent = classe.nom_classe; // Texte de l'option
            classeSelect.appendChild(option);
        });
    }

});

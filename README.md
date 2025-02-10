# Leboncoin-API-Search Scraper

Leboncoin-API-Search Scraper est un projet permettant d'extraire automatiquement des annonces depuis Leboncoin en utilisant l'API non officielle *leboncoin-api-search*. Il inclut deux scripts distincts pour récupérer et exporter des annonces de voitures et de téléphones au format JSON et CSV. Ce projet facilite la recherche d'annonces en automatisant le processus de collecte, garantissant ainsi une expérience utilisateur fluide et efficace.

---

## 📌 Fonctionnalités

- 🔎 Recherche avancée : Extrait des annonces selon des mots-clés et une localisation définie.
- 📊 Exportation des données : Sauvegarde les résultats sous JSON et CSV.
- ⚙️ Personnalisation facile : Permet d'ajuster les paramètres de recherche.
- 📈 Optimisation des requêtes : Utilise une pagination et un délai configurables pour éviter le blocage.

---

## 📂 Contenu du projet

### 🔹 Scripts principaux

- `recherche_voitures.js` → Recherche et collecte des annonces de voitures.
- `recherche_telephones.js` → Recherche et collecte des annonces de téléphones.

### 🔹 Fichiers générés

- `resultats_YYYY-MM-DD_Keyword_LocationV2.json` → Fichier JSON contenant les annonces récupérées.
- `resume_YYYY-MM-DD_Keyword_LocationV2.csv` → Fichier CSV contenant un résumé des annonces.

---

## ⚙️ Installation

### 1️⃣ Prérequis

- Node.js installé
- Bun (gestionnaire de paquets ultra-rapide)

### 2️⃣ Installation de Bun

```sh
powershell -c "irm bun.sh/install.ps1|iex"
```

### 3️⃣ Installation des dépendances

```sh
bun install
```

---

## 🚀 Utilisation

### 🔍 Exécuter un script

#### 📌 Pour rechercher des voitures

```sh
bun run recherche_voitures.js
```

#### 📌 Pour rechercher des téléphones

```sh
bun run recherche_telephones.js
```

---

## ⚙️ Configuration

Les paramètres de recherche peuvent être modifiés directement dans les scripts :

- `locations_recherche` → Localisation des annonces recherchées
- `keywords_recherche` → Mot-clé pour affiner la recherche (ex: "Renault", "iPhone")
- `DELAY_CONFIG` → Définition du délai entre les requêtes pour éviter d’être bloqué
- `SEARCH_CONFIG` → Ajustement de la catégorie, du tri et des filtres de prix

---

## 📝 Exemples de fichiers de sortie

### JSON (`resultats_YYYY-MM-DD_Keyword_LocationV2.json`)

```json
{
      "id": 2927781128,
      "titre": "Renault Mégane 3 1,5 dci 110 Bt 6",
      "prix": 5990,
      "date_publication": "2025-01-29 22:06:01",
      "caracteristiques": {
        "marque": "Renault",
        "modele": "Megane",
        "annee": "2014",
        "kilometrage": "200000",
        "carburant": "Diesel",
        "boite": "Manuelle",
        "place": "5",
        "etat": "Non endommagé",
        "horse_power_din": "110 Ch"
      },
      "vendeur": {
        "type": "pro",
        "nom": "SLYME AUTOS",
        "pro": true
      },
      "localisation": {
        "ville": "Firminy",
        "code_postal": "42700",
        "departement": "Loire"
      },
      "images": [
        "https://img.leboncoin.fr/api/v1/lbcpb1/images/8f/7a/9f/8f7a9f281dc87c6d5b45418acc08b4a3fae4b114.jpg?rule=ad-image",
        "https://img.leboncoin.fr/api/v1/lbcpb1/images/bf/74/b1/bf74b15f838cdeb921e107e70f746b03f539e286.jpg?rule=ad-image",
        "https://img.leboncoin.fr/api/v1/lbcpb1/images/58/0e/05/580e05e8e365d288217a81ba53c093804fb041d0.jpg?rule=ad-image",
        "https://img.leboncoin.fr/api/v1/lbcpb1/images/88/10/0c/88100cf123e4067ba7827ee29342a49d74176967.jpg?rule=ad-image",
        "https://img.leboncoin.fr/api/v1/lbcpb1/images/24/25/6c/24256ce12dd35cc5149895d8827ced2ba559fef1.jpg?rule=ad-image"
      ],
      "url": "https://www.leboncoin.fr/ad/voitures/2927781128",
      "description": "Renault Mégane 3 1,5 dci 110 ch \nBoîte 6\nKms : 200000\nAnnée : 2014\n\n5 portes, 5 places,\n\nEquipements Confort :\n• Allumage automatique des feux\n• Auto-radio commandé au volant\n• Détecteur de pluie\n• Ordinateur de bord\n• Régulateur de vitesse\n• Vitres éléctriques\n•cd \n•, Bluetooth\n• Détecteur \n• GPS \n• Direction assistée\n\nEquipements sécurité :\n• ABS\n• Phares antibrouillard\n\nAutres équipements et informations :\n• Limiteur de vitesse\n\nVéhicule révisé et garantie \nKit de distribution neuf \ncontrôle technique ok moins de 6 mois\n\n• la voiture propre intérieur extérieur et moteur il y a rien à prévoir\n\nReprise de votre ancien vehicule possible .\n\nInformation complémentaire :\nnous somme agréé et habilité pour s’occuper de vous établir votre carte grise\n\nHoraire d’ouverture :\nDu lundi au samedi \n- matin sur RDV\n-après  midi : 14 h à 19 h\n\nGarage Slymes Autos \n39 rue de la république \n42700 Firminy"
    },

{
      "id": 2934267660,
      "titre": "IPhone 12",
      "prix": 100,
      "date_publication": "2025-02-10 13:50:42",
      "caracteristiques": {},
      "vendeur": {
        "type": "private",
        "nom": "Fedhy",
        "pro": false
      },
      "localisation": {
        "ville": "Aulnay-sous-Bois",
        "code_postal": "93600",
        "departement": "Seine-Saint-Denis"
      },
      "url": "https://www.leboncoin.fr/ad/telephones_objets_connectes/2934267660",
      "description": "À vendre dans l’état problème sont qui ne détecte des fois pas la Sim ainsi que la caméra arrière qui n’est pas très nette à des moment le reste aucun problème le prix est fixe"
    },
```

### CSV (`resume_YYYY-MM-DD_Keyword_LocationV2.csv`)

```csv
ID,Titre,Date Publication,Prix,Marque,Modele,Année,Kilométrage,Carburant,Boite,Etat,Puissance din,Place,Type Vendeur,Ville,Code Postal,Département,URL,Description
2918433687,Clio campus ct ok-6 mois,13/01/2025 13:41,1290,Renault,Clio,2004,284650,Essence,Manuelle,,70 Ch,5,private,Amiens,80000,Somme,https://www.leboncoin.fr/ad/voitures/2918433687,Vends Renault clio essence 1.2 compatible éthanol idéal jeune nouveau permis pour se faire la main, direction assistée vitres électriques centralisation autoradio cd usb aux.., frais récent couroie d'accessoires batterie essuie glace ..., idem 106 picanto fiesta xsara micra 306 c3 ka ibiza twingo saxo Punto, le ct est ok et a moin de 6 mois la distribution faites a 230000 kms, elle roule très bien


ID,Titre,Date Publication,Prix,Marque,Modele,Etat,Couleur,Stockage,Mémoire,Type Vendeur,Ville,Code Postal,Département,URL,Description
2918862525,"IPhone XR reconditionné","2025-01-14 10:50:07",140,"","","","","","","private","Lucé","28110","Eure-et-Loir","https://www.leboncoin.fr/ad/telephones_objets_connectes/2918862525","iPhone XR reconditionné  Batterie à  83% Bon état  Téléphone que j'utilise depuis septembre 2021"
```



## 🔗 Ressources

- Dépôt du projet : [GitHub Repository](https://github.com/Aliben06/Leboncoin-API-Search)
- Documentation API : [leboncoin-api-search](https://github.com/Aliben06/Leboncoin-API-Search/blob/main/documentation-API.md) *(non officielle)*

---

## 📢 Contact

📧 Si vous avez des questions, suggestions ou améliorations, n’hésitez pas à ouvrir une *issue* ou à me contacter ! 🚀

---

N'hésitez pas à me faire savoir si vous souhaitez ajouter d'autres détails ou modifications !

## Remarque
Bien que l'API non officielle `leboncoin-api-search` n'ait pas été développée par moi, mon travail a consisté à créer et intégrer ces scripts pour faciliter, optimiser, récupérer et formater les données. La seule chose à modifier pour ajuster la recherche est la localisation et les mots-clés.

---

🚀 Amusez-vous bien avec l'extraction de données Leboncoin !


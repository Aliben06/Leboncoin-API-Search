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
  "total_annonces": 120,
  "annonces_pro": 45,
  "annonces_particulier": 75,
  "date_extraction": "2024-02-10T12:00:00Z",
  "annonces": [
    {
      "id": "123456789",
      "titre": "Renault Clio 2020",
      "prix": 12000,
      "date_publication": "2024-02-09",
      "caracteristiques": {
        "marque": "Renault",
        "modele": "Clio",
        "annee": "2020",
        "kilometrage": "45000",
        "carburant": "Essence",
        "boite": "Manuelle"
      },
      "vendeur": {
        "type": "particulier",
        "nom": "Jean Dupont"
      },
      "localisation": {
        "ville": "Paris",
        "code_postal": "75001"
      },
      "url": "https://www.leboncoin.fr/annonce/123456789"
    }
  ]
}
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
- Documentation API : [leboncoin-api-search](https://github.com/Aliben06/Leboncoin-API-Search/documentation-API.txt) *(non officielle)*

---

## 📢 Contact

📧 Si vous avez des questions, suggestions ou améliorations, n’hésitez pas à ouvrir une *issue* ou à me contacter ! 🚀

---

N'hésitez pas à me faire savoir si vous souhaitez ajouter d'autres détails ou modifications !

## Remarque
Bien que l'API non officielle `leboncoin-api-search` n'ait pas été développée par moi, mon travail a consisté à créer et intégrer ces scripts pour faciliter, optimiser, récupérer et formater les données. La seule chose à modifier pour ajuster la recherche est la localisation et les mots-clés.

---

🚀 Amusez-vous bien avec l'extraction de données Leboncoin !


import { CATEGORY, searchMultiples } from 'leboncoin-api-search';
import { writeFile } from 'fs/promises';

// Constants
const ATTRIBUTES_MAPPING = {
  brand: 'marque',
  model: 'modele',
  regdate: 'annee',
  mileage: 'kilometrage',
  fuel: 'carburant',
  gearbox: 'boite',
  vehicle_damage: 'etat',
  seats: 'place',
  horse_power_din: 'horse_power_din',
};

const CSV_HEADERS = {
  main: ['ID', 'Titre','Date Publication', 'Prix'],
  vehicle: ['Marque', 'Modele', 'Année', 'Kilométrage', 'Carburant', 'Boite', 'Etat','Puissance din','Place'],
  seller: ['Type Vendeur'],
  location: ['Ville', 'Code Postal', 'Département'],
  link: ['URL', 'Description']
};

const DELAY_CONFIG = {
  MIN_DELAY: 10,
  MAX_DELAY: 3000
};

const locations_recherche = ""  // <-------------------------------
const keywords_recherche = "Renault"  // <-------------------------------


// Utilitaires
const sleep = (min, max) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

function escapeCsvField(field) {
  if (typeof field === 'string') {
    // Supprime les retours à la ligne (sauts de ligne et retours chariot)
    field = field.replace(/(\r\n|\n|\r)/g, ' ');

    // Entoure le texte de guillemets doubles si nécessaire
    // Échappe les guillemets doubles en les doublant
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field; // Si ce n'est pas une chaîne, retourne le champ tel quel
}


const extractAttributes = (attributes = []) => {
  const result = {};
  for (const attr of attributes) {
    if (ATTRIBUTES_MAPPING[attr.key]) {
      result[ATTRIBUTES_MAPPING[attr.key]] = ['fuel', 'gearbox','seats','horse_power_din','vehicle_damage'].includes(attr.key)
        ? attr.value_label
        : attr.value;
    }
  }
  return result;
};

const formatAd = (ad) => {
  try {
    const { 
      list_id, 
      subject, 
      body,
      price, 
      first_publication_date, 
      attributes, 
      owner, 
      location, 
      images, 
      url 
    } = ad;

    return {
      id: list_id,
      titre: subject,
      prix: price?.[0] || null,
      date_publication: first_publication_date,
      caracteristiques: extractAttributes(attributes),
      vendeur: {
        type: owner?.type || '',
        nom: owner?.name || '',
        pro: owner?.type === 'pro'
      },
      localisation: {
        ville: location?.city || '',
        code_postal: location?.zipcode || '',
        departement: location?.department_name || ''
      },
      images: images?.urls || [],
      url: url || '',
      description: body || ''
    };
  } catch (error) {
    console.error('Erreur lors du formatage de l\'annonce:', error);
    return null;
  }
};

class DataExporter {
  constructor(date) {
    this.date = date;
  }

  createFilename(prefix, extension) {
    return `${prefix}_${this.date}_${keywords_recherche}_${locations_recherche}V2.${extension}`;
  }

  formatCSVRow(data) {
    return [
      ...Object.values(CSV_HEADERS).flat()
    ].map(header => {
      const value = this.getValueByHeader(data, header);
      return escapeCsvField(value); // Appliquez ici escapeCsvField
    }).join(',');
  }
  

  getValueByHeader(data, header) {
    const headerMapping = {
      'ID': data?.id || '',
      'Date Publication': data?.date_publication || '',
      'Titre': data?.titre || '',
      'Prix': data?.prix || '',
      'Marque': data?.caracteristiques?.marque || '',
      'Modele': data?.caracteristiques?.modele || '',
      'Année': data?.caracteristiques?.annee || '',
      'Place': data?.caracteristiques?.place || '',
      'Puissance din': data?.caracteristiques?.horse_power_din || '',
      'Kilométrage': data?.caracteristiques?.kilometrage || '',
      'Carburant': data?.caracteristiques?.carburant || '',
      'Boite': data?.caracteristiques?.boite || '',
      'Type Vendeur': data?.vendeur?.type || '',
      'Ville': data?.localisation?.ville || '',
      'Code Postal': data?.localisation?.code_postal || '',
      'Département': data?.localisation?.departement || '',
      'URL': data?.url || '',
      'Etat': data?.caracteristiques.etat || '',
      'Description': data?.description || '',
    };
    return headerMapping[header] || '';
  }

  async saveJSON(data) {
    try {
      const formattedData = {
        total_annonces: data.total || 0,
        annonces_pro: data.total_pro || 0,
        annonces_particulier: data.total_private || 0,
        date_extraction: new Date().toISOString(),
        annonces: data.ads.map(formatAd).filter(Boolean)
      };

      const filename = this.createFilename('resultats', 'json');
      await writeFile(filename, JSON.stringify(formattedData, null, 2));
      console.log(`Résultats sauvegardés dans ${filename}`);
      return formattedData;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde JSON:', error);
      throw error;
    }
  }

  async saveCSV(formattedData) {
    try {
      const headers = Object.values(CSV_HEADERS).flat().join(',');
      const rows = formattedData.annonces
        .filter(Boolean)
        .map(ad => this.formatCSVRow(ad));
      const content = `${headers}\n${rows.join('\n')}`;

      const filename = this.createFilename('resume', 'csv');
      await writeFile(filename, content);
      console.log(`Résumé CSV sauvegardé dans ${filename}`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde CSV:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log("Début de la recherche avec pagination automatique...");
    
    const SEARCH_CONFIG = {
      category: CATEGORY.VOITURES,
      locations: [locations_recherche],
      keywords: keywords_recherche,
      limit: 100,
      sort_by: "time",
      sort_order: "DESC",
      price_min: 500,
      include_inactive: false
    };

    const cycles = 10000; // Nombre maximum de cycles   <--------------------------
    const delay = DELAY_CONFIG.MIN_DELAY; // Délai entre les cycles

    // Utilisation de `searchMultiples`
    const resultats = await searchMultiples(SEARCH_CONFIG, cycles, delay, (search_results) => {
      console.log(
        `Progression : ${search_results.ads.length} annonces récupérées. Pivot actuel : ${search_results.pivot}`
      );
    });

    console.log('\nStatistiques finales :');
    console.log(`- Annonces trouvées : ${resultats.total}`);
    console.log(`- Annonces récupérées : ${resultats.ads.length}`);

    // Exportation des données
    const exporter = new DataExporter(new Date().toISOString().split('T')[0]);
    const formattedData = await exporter.saveJSON(resultats);
    await exporter.saveCSV(formattedData);

  } catch (error) {
    console.error('\nErreur critique lors de l\'exécution :', error);
    process.exit(1);
  }
}

main();

// 1) powershell -c "irm bun.sh/install.ps1|iex"    2) "bun.exe run recherche_voitures.js" pour run  3) python analyse_voitures.py
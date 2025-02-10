import { searchMultiples } from 'leboncoin-api-search';
import { writeFile } from 'fs/promises';

// Constants
const ATTRIBUTES_MAPPING = {
  brand: 'marque',
  model: 'modele',
  state: 'etat',
  color: 'couleur',
  storage: 'stockage',
  memory: 'memoire'
};

const CSV_HEADERS = {
  main: ['ID', 'Titre', 'Date Publication', 'Prix'],
  device: ['Marque', 'Modele', 'Etat', 'Couleur', 'Stockage', 'Mémoire'],
  seller: ['Type Vendeur'],
  location: ['Ville', 'Code Postal', 'Département'],
  link: ['URL', 'Description']
};

const DELAY_CONFIG = {
  MIN_DELAY: 1000,
  MAX_DELAY: 3000
};

const locations_recherche = ""  // Votre localisation
const keywords_recherche = "iPhone"  // Mot-clé de recherche

// Utilitaires
const sleep = (min, max) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

function escapeCsvField(field) {
  if (typeof field === 'string') {
    field = field.replace(/(\r\n|\n|\r)/g, ' ');
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

const extractAttributes = (attributes = []) => {
  const result = {};
  for (const attr of attributes) {
    if (ATTRIBUTES_MAPPING[attr.key]) {
      result[ATTRIBUTES_MAPPING[attr.key]] = attr.value_label || attr.value;
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
      return escapeCsvField(value);
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
      'Etat': data?.caracteristiques?.etat || '',
      'Couleur': data?.caracteristiques?.couleur || '',
      'Stockage': data?.caracteristiques?.stockage || '',
      'Mémoire': data?.caracteristiques?.memoire || '',
      'Type Vendeur': data?.vendeur?.type || '',
      'Ville': data?.localisation?.ville || '',
      'Code Postal': data?.localisation?.code_postal || '',
      'Département': data?.localisation?.departement || '',
      'URL': data?.url || '',
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
      category: '17', // Catégorie "Téléphones & Objets connectés"
      locations: [locations_recherche],
      keywords: keywords_recherche,
      limit: 100,
      sort_by: "time",
      sort_order: "DESC",
      price_min: 50, // Prix minimum ajusté pour les téléphones
      include_inactive: false
    };

    const cycles = 10000;
    const delay = DELAY_CONFIG.MIN_DELAY;

    const resultats = await searchMultiples(SEARCH_CONFIG, cycles, delay, (search_results) => {
      console.log(
        `Progression : ${search_results.ads.length} annonces récupérées. Pivot actuel : ${search_results.pivot}`
      );
    });

    console.log('\nStatistiques finales :');
    console.log(`- Annonces trouvées : ${resultats.total}`);
    console.log(`- Annonces récupérées : ${resultats.ads.length}`);

    const exporter = new DataExporter(new Date().toISOString().split('T')[0]);
    const formattedData = await exporter.saveJSON(resultats);
    await exporter.saveCSV(formattedData);

  } catch (error) {
    console.error('\nErreur critique lors de l\'exécution :', error);
    process.exit(1);
  }
}

main();

// 1) powershell -c "irm bun.sh/install.ps1|iex"    2) "bun.exe run recherche_telephones.js" pour run  3) python analyse_voitures.py
import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import numpy as np

def load_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Transformer les annonces en DataFrame
    formatted_ads = []
    for ad in data['annonces']:
        try:
            formatted_ad = {
                'id': ad['id'],
                'titre': ad['titre'],
                'prix': ad['prix'],
                'date_publication': ad['date_publication'],
                'marque': ad['caracteristiques']['marque'],
                'modele': ad['caracteristiques']['modele'],
                'annee': ad['caracteristiques']['annee'],
                'kilometrage': ad['caracteristiques']['kilometrage'],
                'carburant': ad['caracteristiques']['carburant'],
                'boite': ad['caracteristiques']['boite'],
                'vendeur_type': ad['vendeur']['type'],
                'vendeur_nom': ad['vendeur']['nom'],
                'ville': ad['localisation']['ville'],
                'code_postal': ad['localisation']['code_postal'],
                'departement': ad['localisation']['departement'],
                'url': ad['url']
            }
            formatted_ads.append(formatted_ad)
        except KeyError as e:
            print(f"Erreur lors de l'extraction des données pour l'annonce ID {ad.get('id', 'inconnue')}: {e}")
        except Exception as e:
            print(f"Erreur inattendue pour l'annonce ID {ad.get('id', 'inconnue')}: {e}")
    
    df = pd.DataFrame(formatted_ads)
    
    # Afficher les colonnes disponibles pour débogage
    print("Colonnes disponibles dans le DataFrame :", df.columns.tolist())
    
    return df

def find_good_deals(df):
    """Trouve les meilleures affaires en comparant prix/km/année"""
    # Vérifier si 'kilometrage' existe
    if 'kilometrage' not in df.columns:
        print("Erreur : 'kilometrage' n'est pas une colonne dans le DataFrame.")
        return pd.DataFrame()  # Retourner un DataFrame vide

    # Calculer le score de chaque voiture
    df['age'] = 2024 - pd.to_numeric(df['annee'])
    df['prix_par_annee'] = df['prix'] / (2024 - pd.to_numeric(df['annee']))
    df['prix_par_km'] = df['prix'] / df['kilometrage'].replace({'\D': ''}, regex=True).astype(float)  # Nettoyer et convertir

    # Calculer un score global (plus le score est bas, meilleure est l'affaire)
    df['score'] = (
        df['prix_par_annee'] * 0.4 + 
        df['prix_par_km'] * 10000 * 0.6
    )
    
    return df.nsmallest(100, 'score')

def analyze_data(df):
    print("\nInformations sur les données :")
    print(df.info())
    
    # Créer le dossier pour les graphiques
    import os
    os.makedirs('analyses', exist_ok=True)
    
    # 1. Analyse des prix
    plt.figure(figsize=(15, 8))
    sns.boxplot(data=df, x='marque', y='prix')
    plt.xticks(rotation=45)
    plt.title('Distribution des prix par marque')
    plt.tight_layout()
    plt.savefig('analyses/prix_par_marque.png')
    plt.close()

    # 2. Relation prix/kilométrage par type de vendeur
    plt.figure(figsize=(15, 8))
    sns.scatterplot(data=df, x='kilometrage', y='prix', hue='vendeur_type', alpha=0.6)
    plt.title('Prix vs Kilométrage par type de vendeur')
    plt.savefig('analyses/prix_km_vendeur.png')
    plt.close()

    # 3. Prix moyen par année et carburant
    plt.figure(figsize=(15, 8))
    sns.lineplot(data=df, x='annee', y='prix', hue='carburant')
    plt.title('Évolution des prix par année et type de carburant')
    plt.savefig('analyses/evolution_prix_carburant.png')
    plt.close()

    # Sauvegarder les résultats
    with open(f'analyses/analyse_resultats_{datetime.now().strftime("%Y%m%d")}.txt', 'w', encoding='utf-8') as f:
        f.write("=== ANALYSE DU MARCHÉ AUTOMOBILE ===\n\n")
        
        # Statistiques générales
        f.write("STATISTIQUES GÉNÉRALES:\n")
        f.write(f"Nombre total d'annonces: {len(df)}\n")
        f.write(f"Prix moyen: {df['prix'].mean():.2f}€\n")
        f.write(f"Prix médian: {df['prix'].median():.2f}€\n")
        f.write(f"Kilométrage moyen: {df['kilometrage'].mean():.0f}km\n\n")
        
        # Prix moyen par marque
        f.write("PRIX MOYEN PAR MARQUE:\n")
        marque_stats = df.groupby('marque').agg({
            'prix': ['mean', 'count'],
            'kilometrage': 'mean'
        }).round(2)
        f.write(marque_stats.to_string())
        f.write("\n\n")
        
        # Statistiques par type de vendeur
        f.write("STATISTIQUES PAR TYPE DE VENDEUR:\n")
        vendeur_stats = df.groupby('vendeur_type').agg({
            'prix': ['mean', 'median', 'count'],
            'kilometrage': 'mean'
        }).round(2)
        f.write(vendeur_stats.to_string())
        f.write("\n\n")
        
        # Meilleures affaires
        f.write("TOP 100 DES MEILLEURES AFFAIRES:\n")
        best_deals = find_good_deals(df)
        for _, deal in best_deals.iterrows():
            f.write(f"\n{deal['marque']} {deal['modele']} ({deal['annee']})\n")
            f.write(f"Prix: {deal['prix']}€ | Kilométrage: {deal['kilometrage']}km\n")
            f.write(f"Vendeur: {deal['vendeur_type']} | Ville: {deal['ville']}\n")
            f.write(f"URL: {deal['url']}\n")
            f.write("-" * 80 + "\n")

def main():
    try:
        # Charger les données
        df = load_data('resultats_2025-01-13_voitures_brest_complet.json')
        print(df.head())  # Vérifie les premières lignes après nettoyage

        # Nettoyer les données
        df['prix'] = pd.to_numeric(df['prix'], errors='coerce')
        df['kilometrage'] = df['kilometrage'].str.replace(r'\D', '', regex=True)  # Retirer tous les non-chiffres
        df['kilometrage'] = pd.to_numeric(df['kilometrage'], errors='coerce')

        # Supprimer les lignes avec des valeurs manquantes importantes
        df = df.dropna(subset=['prix', 'kilometrage', 'annee'])
        
        # Filtrer les valeurs aberrantes
        df = df[
            (df['prix'] > 500) & 
            (df['prix'] < df['prix'].quantile(0.99)) &  # Exclure les prix extrêmes
            (df['kilometrage'] < 300000)  # Exclure les kilométrages extrêmes
        ]
        
        # Analyser
        analyze_data(df)
        
        print("Analyse terminée ! Vérifiez le dossier 'analyses' pour les résultats.")
    except Exception as e:
        print(f"Erreur lors de l'analyse : {str(e)}")

if __name__ == "__main__":
    main() 
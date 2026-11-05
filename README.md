# ⚓ Nautilus — Application Web du Festival

> **Festival des arts, des sciences & des écritures numériques**  
> *Iᵉ édition — Campus Landes — 8 avril 2027*

Application web interactive **Mobile-First** conçue avec **React, TypeScript et Vite**, déployée en continu sur **Vercel**.
Voici le Lien **Vercel** : https://nautilus-web-lemon.vercel.app/
Ce projet propose un carnet de bord numérique complet, fonctionnant **100 % hors ligne** avec un univers graphique inspiré de la cartographie et de l'imprimerie du XIXᵉ siècle.

---

## 📋 Sommaire
- [1. Présentation du Projet](#1-présentation-du-projet)
- [2. Choix Technologiques & Justifications](#2-choix-technologiques--justifications)
- [3. Fonctionnalités Principales](#3-fonctionnalités-principales)
- [4. Arborescence du Projet](#4-arborescence-du-projet)
- [5. Installation & Démarrage](#5-installation--démarrage)
- [6. Déploiement & CI/CD](#6-déploiement--cicd)
- [7. Points Clés pour l'Évaluation](#7-points-clés-pour-lévaluation)

---

## 1. Présentation du Projet

### Le Contexte
À l'origine pensé sous forme d'application mobile native (React Native / Expo), le projet a été **entièrement refondu et porté vers une architecture Web moderne (React + Vite)** afin de garantir :
1. Une **accessibilité immédiate** depuis n'importe quel smartphone via un simple lien ou QR code (sans passer par un store ou une installation tierce).
2. Une **expérience utilisateur Mobile-First** avec navigation basse ergonomique (au pouce), complétée par une vue cadrée et élégante sur grand écran.
3. Une **indépendance totale au réseau** : l'ensemble des données du festival, de la carte et du moteur d'aide est embarqué côté client.

### L'Univers Graphique
L'identité visuelle puise dans l'imaginaire vernien (*Le Nautilus*) :
- Teinte dominante papier vergé sépia (`#F2E8D0`) et encre noire sombre (`#2A1E14`).
- Accents vermillon (`#8C2F1B`) et bleu de mer (`#4A6A7E`).
- Typographies historiques chargées via Google Fonts : *IM Fell English*, *IM Fell English SC* et *EB Garamond*.
- Logo vectoriel sur mesure : hublot de sous-marin aux rivets dorés, nuit abyssale et faisceau de projection.

---

## 2. Choix Technologiques & Justifications

| Technologie | Rôle | Pourquoi ce choix ? |
| :--- | :--- | :--- |
| **React 19** | Bibliothèque UI | Structure par composants modulaires et réutilisables, gestion fine de l'état réactif (onglets, filtres, modales, favoris). |
| **TypeScript** | Langage | Typage strict des modèles de données (`Evenement`, `Projet`, `Lieu`) pour prévenir les erreurs à l'exécution et fiabiliser la maintenance. |
| **Vite** | Bundler / Outillage | Temps de démarrage instantané (< 300 ms), Hot Module Replacement (HMR) ultra-rapide et build de production optimisé via Rollup/esbuild. |
| **SVG Natif** | Cartographie interactive | Plutôt que d'alourdir le projet avec des bibliothèques SIG tierces (Leaflet, Mapbox), la carte utilise une image d'archive aquarellée surmontée d'un calque SVG natif avec gestion des coordonnées, du zoom et des interactions tactiles. |
| **Lucide React** | Jeu d'icônes | Icônes vectorielles légères, sobres et personnalisables (traits fins en accord avec le style gravure). |
| **LocalStorage** | Persistance client | Mémorisation pérenne du parcours de l'utilisateur (« Mon parcours » / favoris) sans nécessiter de base de données ni de compte utilisateur. |

---

## 3. Fonctionnalités Principales

L'application est découpée en **5 espaces majeurs** accessibles via la barre de navigation inférieure :

### 1. ⚓ Accueil (`index`)
- **En-tête & Émblème officiel :** Titrage d'époque et logo interactif.
- **Dépêche du jour dynamique :** Calcule en temps réel le décompte avant ouverture, signale les entractes ou clôtures selon la date du visiteur.
- **Suivi en direct :** Sections conditionnelles *« En ce moment »*, *« À suivre »* et *« À ne pas manquer ✦ »*.
- **Raccourcis visuels :** Accès direct aux lieux du campus et à la galerie des travaux.

### 2. 📅 Programme (`programme`)
- **Navigation chronologique :** Sélecteur du jour et des faroris.
- **Filtres thématiques :** Puces de tri par catégorie (*Conférence*, *Atelier*, *Exposition*, *Concert*, *Projection*, *Performance*).
- **Mon Parcours (★) :** Onglet dédié listant les événements enregistrés en favoris par l'utilisateur.
- **Fiche détaillée (Modal) :** Volet contextuel au clic détaillant l'horaire, le lieu précis, les intervenants, le résumé et les liens vers les travaux d'élèves exposés.

### 3. 🗺️ Plan du Campus (`plan`)
- **Véritable carte aquarellée d'archive** intégrée en fond de repère.
- **9 repères numérotés et géolocalisés :** Accueil/Entrée, Scène centrale, Bâtiment Principal (Nef, Grand Amphi, Bibliothèque, Studio, Ateliers, Réfectoire) et Théâtre Jardin.
- **Bâtiment privé sécurisé :** Zone ouest signalée clairement *« Accès réservé / Hors festival »*.
- **Outils de navigation :** Déplacement libre au doigt/souris, zoom avant (`+`), zoom arrière (`−`) et recentrage instantané (`⟲`).
- **Tiroir d'information contextuel :** Cliquer sur un bâtiment affiche sa description historique, les événements qui s'y déroulent et les œuvres exposées.

### 4. ❦ Travaux des élèves (`travaux`)
- **Recherche plein texte instantanée :** Insensible à la casse et aux accents, explorant titres, résumés, noms des élèves et techniques.
- **Filtrage par filière :** *Animation 3D*, *Design d’espace*, *Design graphique*, *Développement*, *Jeu vidéo*, *Photographie*, *Son & musique*.
- **Fiche Projet détaillée :** Auteurs, année, lieu d'exposition, outils utilisés et passerelle directe vers les événements programmés associés.

### 5. 🧭 Le Timonier (`timonier`)
- **Agent conversationnel autonome (Offline AI Router) :** Fonctionne à 100 % hors réseau grâce à un routeur d'intentions déterministe et une analyse lexicale poussée (`outils.ts`).
- **Compréhension en langage naturel :**
  - Temporel : *« quoi ce soir ? »*, *« en ce moment »*.
  - Spécifique : *« où manger ? »*, *« où sont les toilettes ? »*, *« scène de musique »*.
- **Réponses riches :** L'agent génère des cartes interactives (fiche lieu, événement, projet) et propose des bulles de suggestions pour guider la visite.

---

## 4. Arborescence du Projet

```text
nautilus-web/
├── public/
│   ├── plan.png               # Plan aquarellé authentique du campus
│   └── vite.svg
├── src/
│   ├── agent/
│   │   ├── outils.ts          # Algorithmes de recherche, normalisation et scoring
│   │   └── timonier.ts        # Moteur d'intentions et cerveau de l'agent
│   ├── components/
│   │   ├── CampusMap.tsx      # Moteur cartographique SVG avec pan/zoom
│   │   ├── EventModal.tsx     # Fiche modale détaillée d'un événement
│   │   ├── EventRow.tsx       # Ligne d'événement (horaire, titre, favori)
│   │   ├── NautilusLogo.tsx   # Logo SVG vectoriel du hublot Nautilus
│   │   ├── Paper.tsx          # Composants graphiques (Plate, Ornament, Chip, Header)
│   │   ├── Plan.tsx           # Vue complète du plan et de sa légende
│   │   ├── Programme.tsx      # Vue du programme et ses filtres
│   │   ├── ProjectCard.tsx    # Carte de présentation d'un travail d'élève
│   │   ├── ProjectModal.tsx   # Fiche modale détaillée d'un projet
│   │   ├── Timonier.tsx       # Interface de discussion avec l'agent
│   │   ├── TimonierCarte.tsx  # Cartes interactives générées par l'agent
│   │   └── Travaux.tsx        # Galerie et moteur de recherche des projets
│   ├── data/
│   │   └── festival.ts        # Base de données locale (lieux, événements, projets)
│   ├── hooks/
│   │   └── useFavorites.ts    # Hook personnalisé pour la persistance des favoris
│   ├── App.tsx                # Composant racine et gestion de la navigation
│   ├── index.css              # Variables CSS du thème (couleurs, polices, responsive)
│   └── main.tsx               # Point d'entrée React 19
├── index.html                 # Template HTML & importation des polices Google Fonts
├── package.json               # Dépendances et scripts de build
├── tsconfig.json              # Configuration TypeScript
└── vite.config.ts             # Configuration du bundler Vite
```

## 5. Installation & Démarrage
Prérequis :
Node.js (version 18 ou supérieure recommandée)
npm (inclus avec Node.js) ou pnpm / yarn

1. Cloner le projet
```
git clone https://github.com/MathCod/nautilus-web.git
cd nautilus-web
```
2. Installer les dépendances
```
npm install --legacy-peer-deps
```
3. Lancer le serveur de développement local
```
npm run dev
```
L'application est accessible immédiatement à l'adresse : http://localhost:5173/
(Ouvrez les outils de développement F12 > mode "Device Toolbar" pour tester le rendu mobile).
4. Compiler pour la production
```
npm run build
```
Les fichiers statiques finaux sont générés dans le dossier dist/.
<br>
6. Déploiement & CI/CD
Le projet est déployé en continu via la plateforme cloud Vercel connectée au dépôt GitHub :
Déclenchement automatique : Chaque commit poussé sur la branche main (git push) déclenche un pipeline de build et un déploiement instantané.
Commande de build Vercel : npm run build
Commande d'installation Vercel : npm install --legacy-peer-deps
Dossier de sortie : dist

Projet réalisé dans le cadre du Festival Nautilus 2027.
Par Zacharie CHAMARD & Mathias BERGER
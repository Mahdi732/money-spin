# 💰 API de Gestion de Groupes de Contribution & Fiabilité (Node.js + MongoDB)

## 🧭 Contexte du projet

Cette API a pour objectif de **digitaliser la gestion des groupes de cotisation** (type tontine ou épargne collective) en offrant une plateforme **sécurisée, fiable et automatisée**.  
Elle gère :

- L’inscription et l’authentification des utilisateurs.
- La création et la gestion de groupes.
- Les **tours de contribution** et la **distribution automatique des fonds**.
- Le **suivi des paiements**, des **notifications**, et un **score de fiabilité interne**.
- Un système **KYC complet et robuste** garantissant la conformité et la sécurité des utilisateurs.

---

## ⚙️ Fonctionnalités principales

### 👤 Utilisateurs
- **Inscription & Authentification sécurisée** via JWT.
- **Vérification KYC** (nom, prénom, CIN, photo).
- **Score de fiabilité** basé sur la ponctualité des paiements.

### 👥 Groupes
- Création et gestion de groupes de contribution.
- Définition des montants, délais, et ordre de passage.
- Gestion transparente des bénéficiaires.
- Historique des paiements accessible à tout le groupe.
- Système de **messagerie texte et audio** interne.

### 💸 Contributions & Paiements
- Organisation automatique des **tours de contribution**.
- Distribution des fonds selon l’ordre défini.
- Suivi des paiements en temps réel.
- Notifications/rappels automatiques pour éviter les retards.
- Traçabilité complète de chaque transaction.

### 🧱 Administration
- Accès complet à tous les groupes et utilisateurs.
- Supervision des opérations financières.
- Gestion manuelle du KYC si nécessaire.
- Ouverture et traitement des **tickets utilisateurs**.

---

## 🔐 Sécurité & Conformité

### ✅ Système KYC (Know Your Customer)
- **Vérification des données personnelles** : nom, prénom, numéro de carte nationale.
- **Téléversement de la carte d’identité** et comparaison faciale avec une photo ou une vidéo.
- **Chiffrement local** ou **stockage via service tiers sécurisé**.
- **Double mode de validation** :
  - Automatique via `face-api.js` ou modèle d’IA.
  - Manuelle par un administrateur.
- Aucune action sensible (création de groupe, contribution, virement) n’est possible **sans vérification validée**.

### 🔒 Authentification & Autorisation
- Basée sur **JWT** (JSON Web Tokens).
- Gestion de rôles : `Particulier` et `Admin`.
- Middleware de sécurité sur chaque route sensible.

---

src/
├── config/ # Configuration globale (DB, JWT, etc.)
├── controllers/ # Logique applicative et gestion des routes
├── models/ # Schémas Mongoose (User, Group, Payment, etc.)
├── routes/ # Fichiers de routing Express
├── services/ # Logique métier (KYC, fiabilité, notifications)
├── middlewares/ # Middleware d’authentification et validation
├── utils/ # Fonctions utilitaires (helpers)
├── tests/ # Tests Jest unitaires et d’intégration
└── server.js # Point d’entrée de l’application



L’architecture suit les principes :
- **Séparation claire des responsabilités (N-Tiers)**.
- **OOP et modularité** pour favoriser l’évolutivité.
- **Convention de nommage stricte** pour une maintenance optimale.

---

## 🧠 Technologies principales

| Technologie | Rôle |
|--------------|------|
| **Node.js** | Exécution du backend |
| **Express.js** | Gestion des routes HTTP |
| **MongoDB + Mongoose** | Base de données NoSQL |
| **JWT** | Authentification et autorisation |
| **face-api.js** | Reconnaissance faciale pour KYC |
| **Docker** | Conteneurisation de l’application |
| **Jest** | Tests unitaires et d’intégration |
| **JIRA + GitHub** | Planification et automatisation du workflow |

---

## 📊 Planification (JIRA)

### 🔸 Structure recommandée
- **Epics** : grandes fonctionnalités (KYC, Auth, Groupes, Paiements, etc.)
- **User Stories** : actions utilisateurs (en tant que particulier, je veux…)
- **Tasks/Sub-Tasks** : développement, test, intégration CI/CD.

### 🔸 Intégration GitHub
- Lien bidirectionnel entre commits et issues JIRA.
- **Automatisations** :
  - Transition automatique des issues selon les PR.
  - Fermeture automatique d’issues après merge.
  - Génération automatique de changelog.

---

## 🧩 Installation & Exécution

### 🔧 Prérequis
- Node.js ≥ 18.x
- MongoDB ≥ 6.x
- Docker (optionnel)
- npm ou yarn

### 🚀 Installation

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/username/contribution-api.git
cd contribution-api

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Configurer les variables d’environnement
cp .env.example .env
# puis éditer le fichier .env avec vos valeurs (DB_URI, JWT_SECRET, etc.)

# 4️⃣ Lancer le serveur
npm run dev


## 🧱 Architecture du projet (N-Tiers + OOP)


# Todo App

## Description
Une application Todo construite avec Vue.js, Express et MongoDB, déployée via Docker. Ce dépôt sert de base pour évaluer les compétences techniques des développeurs candidats. Les candidats sont invités à récupérer ce projet, à le faire fonctionner localement, et à y ajouter de nouvelles fonctionnalités.

## Table des matières
- [Todo App](#todo-app)
   - [Table des matières](#table-des-matières)
   - [Introduction](#introduction)
   - [Prérequis](#prérequis)
   - [Installation](#installation)
      - [1. Clonez le projet depuis le dépôt GitLab :](#1-clonez-le-projet-depuis-le-dépôt-gitlab-)
      - [2. Installation de l'environnement de développement](#2-installation-de-lenvironnement-de-développement)
   - [Utilisation](#utilisation)
     - [1. Accéder à l'Application](#1-accéder-à-lapplication)
   - [Endpoints](#endpoints)

## Introduction
Ce projet est une application de gestion de tâches, permettant aux utilisateurs de créer, gérer et organiser des tâches tout en les associant à des tags pour une meilleure catégorisation et gestion de leur travail. L'application permet d'ajouter, de modifier, de supprimer des tâches et des tags, et de les associer ou de les dissocier facilement en fonction des besoins de l'utilisateur.

## Prérequis
Avant d'installer et d'utiliser ce projet, assurez-vous d'avoir les éléments suivants :

- Docker - https://www.docker.com/
- Docker Compose - https://docs.docker.com/compose/
- Node.js (si vous travaillez sans Docker)

## Installation

Suivez les étapes ci-dessous pour installer et configurer le projet :

#### 1. Clonez le projet depuis le dépôt GitLab :

```shell
$ git clone https://github.com/AzdrHA/todo-app.git

$ cd todo-app
```

#### 2. Installation de l'environnement de développement
```shell
# Compilation des images docker
$ docker compose build
```

## Utilisation
Pour lancer l'application, exécutez la commande suivante :

```shell
$ docker compose up
```

#### 1. Accéder à l'Application
- Frontend : http://localhost:8080
- Backend API : http://localhost:5001/api/todos

## Endpoints

Voici la liste des endpoints disponibles dans l'API :

#### 1. <a href="/docs/endpoints/todo.md">Endpoints Todo</a>
- **POST /api/todos** - Crée une nouvelle tâche.
- **GET /api/todos/search** - Rechercher des tâches en fonction de certains critères.
- **PUT /api/todos/reorder** - Permet de réorganiser l'ordre des tâches en fonction de l'ordre dans le tableau passé en paramètre.
- **GET /api/todos/:id** - Récupère une tâche spécifique en fonction de son identifiant unique `_id`.
- **PATCH /api/todos/:id** - Met à jour une tâche existante en fonction de son identifiant unique `_id`.
- **DELETE /api/todos/:id** - Supprime une tâche spécifique en fonction de son identifiant unique `_id`.
- **POST /api/todos/:id/:tagId** - Permet d'ajouter un tag spécifique à une tâche en fonction de leurs identifiants respectifs
- **DELETE /api/todos/:id/:tagId** - Permet de retirer un tag spécifique d'une tâche en fonction de leurs identifiants respectifs.

#### 2. <a href="/docs/endpoints/tag.md">Endpoints Tag</a>
- **POST /api/tags** - Crée un nouveau tag.
- **GET /api/tags** - Récupère la liste de tous les tags.

# **Documentation des Endpoints API**

## **Introduction**
Cette section détaille les nouveaux endpoints ajoutés à l'API. Chaque endpoint est décrit avec ses caractéristiques principales : méthode HTTP, URL, paramètres, corps de la requête, et structure de la réponse.

---

## **1. Endpoints**

### **1.1. Créer une Todo**
- **Méthode** : `POST`
- **URL** : `/api/todos`
- **Description** : Crée une nouvelle tâche.

#### **Paramètres**
| Nom   | Type                | Requis | Description                |
|-------|---------------------|--------|----------------------------|
| `title` | Chaine de caractère | Oui    | Le titre de la tâche.|

#### **Exemple de Requête**
```json
{
  "title": "Finaliser le test technique"
}
```

#### **Exemple de Réponse**
```json
{
  "_id": "64b9fd2e9c8a2d1f0c8e91b2",
  "title": "Finaliser le test technique",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "priority": "medium",
  "tags": []
}
```

#### **Réponse en cas d'erreur**
```js
{
  // Si le champ 'title' est manquant
  // HTTP code 400
  message: "Le champ 'title' est obligatoire."
}
```
```js
{
  // Si le champ 'title' n'est pas de type string
  // HTTP code 400
  message: "Le titre est requis et doit être une chaîne de caractères."
}
```

---

### **1.2. Rechercher des Tâches**
- **Méthode** : `GET`
- **URL** : `/api/todos/search`
- **Description** : Rechercher des tâches en fonction de certains critères.

#### **Paramètres**
| Nom       | Type                                 | Requis | Description                                               |
|-----------|--------------------------------------|--------|-----------------------------------------------------------|
| `title`     | Chaine de caractère                  | Oui    | Titre de la tâche à rechercher (obligatoire).             |
| `completed` | Chaine de caractère                  | Non    | Filtrer par statut de complétion ("true", "false", "all"). |
| `priority`  | `Enum["high", "medium", "low", "all"]` | Non    | Filtrer par niveau de priorité.                           |
| `tags`      | `Tags[]`                               | Non    | Filtrer par niveau de priorité.                           |
| `page`      | Nombre                               | Oui    | Filtrer par niveau de priorité.                           |

#### **Exemple de Requête**
Rechercher toutes les tâches avec le titre "Test" et la priorité "high" :
```http
GET /api/todos/search?title=Test&priority=high&page=1&completed=all&tags=64b8fd2e9c8a2d1f0c8e91a7,64b8fd2e9c8a2d1f0c8e91a8
```

#### **Exemple de Réponse**
```json
[
  {
    "_id": "64b9fd2e9c8a2d1f0c8e91b2",
    "title": "Test",
    "completed": false,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "priority": "high",
    "tags": [
      {
        "_id": "64b8fd2e9c8a2d1f0c8e91a7",
        "title": "Urgent",
        "color": "#FF0000"
      }
    ]
  }
]
```
#### **Réponse en cas d'erreur**
```js
{
  // Si completed n'est pas 'true', 'false' ou 'all'
  // HTTP code 400
  message: "Valeur invalide pour « completed ». La valeur attendue est « true », « false » ou « all »."
}
```
```js
{
  // Si priority n'est pas 'high', 'medium', 'low' ou 'all'
  // HTTP code 400
  message: "Valeur invalide pour « priority ». Valeur attendue pour « high », « medium », « low » ou « all »."
}
```

---

### **1.3. Réorganiser les Tâches**
- **Méthode** : `PATCH`
- **URL** : `/api/todos/reorder`
- **Description** : Permet de réorganiser l'ordre des tâches en fonction de l'ordre dans le tableau passé en paramètre. La position de chaque tâche sera mise à jour dans la base de données.

#### **Paramètres**
Le corps de la requête doit contenir un tableau d'objets avec les identifiants des tâches (_id) dans l'ordre souhaité.

| Nom   | Type                                | Requis | Description                                     |
|-------|-------------------------------------|--------|-------------------------------------------------|
| `todos` | Chaine de caractère dans un tableau | Oui    | Liste des objets contenant les identifiants (`_id`) des tâches dans l'ordre désiré. |

#### **Exemple de Requête**
```json
[
  { "_id": "64b8fd2e9c8a2d1f0c8e91a7" },
  { "_id": "64b8fd2e9c8a2d1f0c8e91a8" },
  { "_id": "64b8fd2e9c8a2d1f0c8e91a9" }
]
```

#### **Exemple de Réponse**
```json
{ "message": "Ordre mis à jour avec succès." }
```
#### **Réponse en cas d'erreur**
```js
{
  // Si le champ 'todos' est manquant
  // HTTP code 400
  message: "Les tâches doivent être envoyées sous forme de tableau."
}
```

---

### **1.4. Récupérer une Tâche par son ID**
- **Méthode** : `GET`
- **URL** : `/api/todos/:id`
- **Description** : Récupère une tâche spécifique en fonction de son identifiant unique `_id`.

#### **Paramètres**
- **`:id`** : L'identifiant unique de la tâche. Ce paramètre doit être passé dans l'URL.

#### **Exemple d'URL**
```http
GET /api/todos/64b8fd2e9c8a2d1f0c8e91a7
```

#### **Exemple de Réponse**
```json
{
  "_id": "64b8fd2e9c8a2d1f0c8e91a7",
  "title": "Finaliser le test technique",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "priority": "high",
  "tags": [
    {
      "_id": "64b8fd2e9c8a2d1f0c8e91a7",
      "title": "Urgent",
      "color": "#FF0000"
    }
  ]
}
```
#### **Réponse en cas d'erreur**
```js
{
  // Si la tâche n'existe pas
  // HTTP code 404
  message: "Tâche introuvable."
}
```

### **1.5. Mettre à jour une Tâche par son ID**
- **Méthode** : `PATCH`
- **URL** : `/api/todos/:id`
- **Description** : Met à jour une tâche existante en fonction de son identifiant unique `_id`. Seuls les champs fournis dans la requête seront mis à jour.

#### **Paramètres**
- **`:id`** : L'identifiant unique de la tâche. Ce paramètre doit être passé dans l'URL.

| Nom          | Type                    | Requis | Description                                                   |
|--------------|-------------------------|--------|---------------------------------------------------------------|
| `title`      | Chaine de caractère     | Non    | Nouveau titre de la tâche.                                   |
| `completed`  | Booléen                 | Non    | Nouveau statut de complétion de la tâche (`true` ou `false`). |
| `priority`   | `Enum["high", "medium", "low"]` | Non    | Nouvelle priorité de la tâche.                               |

#### **Exemple d'URL**
```http
PATCH /api/todos/64b8fd2e9c8a2d1f0c8e91a7
```

#### **Exemple de Requête**
```json
{
  "title": "Révision du test technique",
  "priority": "high"
}
```

#### **Réponse en cas d'erreur**
```js
{
  // Si le champ 'title' n'est pas de type string
  // HTTP code 400
  message: "Le titre doit être une chaîne de caractères."
}
```
```js
{
  // Si le champ 'completed' n'est pas un booléen
  // HTTP code 400
  message: "Le statut de complétion doit être un booléen."
}
```
```js
{
  // Si le champ 'priority' n'est pas 'high', 'medium', 'low'
  // HTTP code 400
  message: "La priorité doit être 'high', 'medium' ou 'low'."
}
```
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Tâche introuvable."
}
```

---

### **1.6. Supprimer une Tâche par son ID**
- **Méthode** : `DELETE`
- **URL** : `/api/todos/:id`
- **Description** : Supprime une tâche spécifique en fonction de son identifiant unique `_id`.

#### **Paramètres**
- **`:id`** : L'identifiant unique de la tâche. Ce paramètre doit être passé dans l'URL.

#### **Exemple de Requête**
Supprimer la tâche avec l'ID spécifié :
```http
DELETE /api/todos/64b8fd2e9c8a2d1f0c8e91a7
```

#### **Exemple de Réponse**
```json
{ "message": "Tâche supprimée avec succès." }
```

#### **Réponse en cas d'erreur**
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Tâche introuvable."
}
```

---

### **1.6. Ajouter un Tag à une Tâche**
- **Méthode** : `POST`
- **URL** : `/api/todos/:id/:tagId`
- **Description** : Permet d'ajouter un tag spécifique à une tâche en fonction de leurs identifiants respectifs. L'ID du tag est ajouté à la liste des tags de la tâche spécifiée.

#### **Paramètres**
- **`:id`** : L'identifiant unique de la tâche. Ce paramètre doit être passé dans l'URL.
- **`:tagId`** : L'identifiant unique du tag à ajouter à la tâche. Ce paramètre doit être passé dans l'URL.

#### **Exemple de Requête**
Ajouter un tag à une tâche en spécifiant les IDs :
```http
POST /api/todos/64b8fd2e9c8a2d1f0c8e91a7/tags/64b8fd2e9c8a2d1f0c8e91a8
```

#### **Exemple de Réponse**
```json
{
  "_id": "64b8fd2e9c8a2d1f0c8e91a7",
  "title": "Révision du test technique",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "priority": "high",
  "tags": [
    {
      "_id": "64b8fd2e9c8a2d1f0c8e91a8",
      "title": "Urgent",
      "color": "#FF0000"
    },
    {
      "_id": "64b8fd2e9c8a2d1f0c8e91a9",
      "title": "Prioritaire",
      "color": "#FFFF00"
    }
  ]
}
```

#### **Réponse en cas d'erreur**
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Tâche introuvable."
}
```
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Étiquette non trouvée."
}
```

---

### **1.7. Retirer un Tag d'une Tâche**
- **Méthode** : `DELETE`
- **URL** : `/api/todos/:id/tags/:tagId`
- **Description** : Permet de retirer un tag spécifique d'une tâche en fonction de leurs identifiants respectifs. L'ID du tag est supprimé de la liste des tags de la tâche spécifiée.

#### **Paramètres**
- **`:id`** : L'identifiant unique de la tâche. Ce paramètre doit être passé dans l'URL.
- **`:tagId`** : L'identifiant unique du tag à ajouter à la tâche. Ce paramètre doit être passé dans l'URL.

#### **Exemple de Requête**
Retirer un tag d'une tâche en spécifiant les IDs :
```http
DELETE /api/todos/64b8fd2e9c8a2d1f0c8e91a7/tags/64b8fd2e9c8a2d1f0c8e91a8
```

#### **Exemple de Réponse**
```json
{
  "_id": "64b8fd2e9c8a2d1f0c8e91a7",
  "title": "Révision du test technique",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "priority": "high",
  "tags": [
    {
      "_id": "64b8fd2e9c8a2d1f0c8e91a9",
      "title": "Prioritaire",
      "color": "#FFFF00"
    }
  ]
}
```

#### **Réponse en cas d'erreur**
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Tâche introuvable."
}
```
```js
{
  // Si l'ID de la tâche est invalide
  // HTTP code 404
  message: "Étiquette non trouvée."
}
```

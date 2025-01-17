# **Documentation des Endpoints API**

## **Introduction**
Cette section détaille les nouveaux endpoints ajoutés à l'API. Chaque endpoint est décrit avec ses caractéristiques principales : méthode HTTP, URL, paramètres, corps de la requête, et structure de la réponse.

---

## **1. Endpoints**

### **1.1. Créer un Tag**
- **Méthode** : `POST`
- **URL** : `/api/tags`
- **Description** : Crée un nouveau tag dans le système.

#### **Paramètres**
| Nom   | Type   | Requis | Description                 |
|-------|--------|--------|-----------------------------|
| title | String | Oui    | Le titre du tag.            |
| color | String | Oui    | La couleur du tag.          |
| todoId | String | Oui    | L'identification de la todo |

#### **Exemple de Requête**
```json
{
  "title": "Urgent",
  "color": "#FF0000",
  "todoId": "64b8fd2e9c8a2d1f0c8e91a8"
}
```

#### **Exemple de Réponse**
```json
{
  "_id": "60f7b3b3b9b3b40015f1f3a1",
  "title": "Urgent",
  "color": "#FF0000"
}
```
#### **Réponse en cas d'erreur**
```js
{
  // Si le champ 'todoId' ou 'title' ou 'color' est manquant
  // HTTP code 400
  message: "Les champs 'todoId', 'title' et 'color' sont obligatoires."
}
```
```js
{
  // Si le champ 'todoId' ou 'title' ou 'color' est manquant
  // HTTP code 400
  message: "Les champs 'todoId', 'title' et 'color' doivent être de type string."
}
```
```js
{
  // Si le tag existe déjà
  // HTTP code 400
  message: "Un tag avec ce titre et cette couleur existe déjà."
}
```
```js
{
  // Si la todo n'existe pas
  // HTTP code 404
  message: "Tâche introuvable."
}
```

---

### **1.2. Lister les Tags**
- **Méthode** : `GET`
- **URL** : `/api/tags`
- **Description** : Récupère la liste de tous les tags.

#### **Exemple de Réponse**
```json
[
  {
    "_id": "60f7b3b3b9b3b40015f1f3a1",
    "title": "Urgent",
    "color": "#FF0000"
  },
  {
    "_id": "60f7b3b3b9b3b40015f1f3a2",
    "title": "Important",
    "color": "#FF5733"
  }
]
```


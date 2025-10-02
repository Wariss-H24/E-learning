# 📝 Commandes Git essentielles en équipe

### Cloner un projet GitHub (quand quelqu’un a déjà créé le repo)
 git clone URL_DU_REPO

### Créer une nouvelle branche
 git branch nom-de-branche

### Aller sur une branche
 git checkout nom-de-branche

### Créer + aller dessus directement
 git checkout -b nom-de-branche

### Lister toutes les branches
 git branch

### Revenir sur la branche principale (main)
 git checkout main

### Fusionner une branche dedans
 git merge nom-de-branche

### Récupérer les changements sans les appliquer
 git fetch

### Récupérer et appliquer (le plus courant)
 git pull

###  Envoyer une branche sur GitHub
 git push -u origin nom-de-branche

### Envoyer la branche principale
 git push origin main

### Voir l’historique des commits
 git log

### Voir un résumé des commits
 git log --oneline

### Créer une branche pour ta tâche
 git checkout -b feature-ajout-login

### Coder et faire des commits réguliers
 git add .
 git commit -m "ajout du formulaire login"

### Envoyer la branche sur GitHub
 git push -u origin feature-ajout-login

### Récupérer les mises à jour régulièrement
 git pull origin main
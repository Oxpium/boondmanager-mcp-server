# Contribuer au projet

## Prerequis

- Node.js >= 18
- npm

## Installation

```bash
git clone https://github.com/fauguste/boondmanager-mcp-server.git
cd boondmanager-mcp-server
npm install
```

## Developpement

```bash
# Build
npm run build

# Mode watch
npm run dev

# Linter
npm run lint
npm run lint:fix

# Type checking
npm run typecheck

# Tests
npm test
npm run test:watch
npm run test:coverage
```

## Workflow de contribution

1. Creer une branche depuis `main` : `git checkout -b feat/ma-fonctionnalite`
2. Coder les changements
3. Ajouter des tests unitaires
4. Verifier que tout passe :
   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```
5. Committer avec un message conventionnel :
   - `feat: ajouter l'outil de recherche de projets`
   - `fix: corriger la pagination des ressources`
   - `docs: mettre a jour le README`
   - `refactor: simplifier le client HTTP`
   - `test: ajouter les tests des schemas`
6. Ouvrir une Pull Request vers `main`

## Conventions de commit

Ce projet suit [Conventional Commits](https://www.conventionalcommits.org/) :

| Prefixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalite |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `refactor:` | Refactoring sans changement fonctionnel |
| `test:` | Ajout ou modification de tests |
| `ci:` | Changements CI/CD |
| `chore:` | Maintenance (dependances, config...) |

## Processus de release

1. Mettre a jour la version dans `package.json`
2. Committer : `git commit -m "chore: bump version to X.Y.Z"`
3. Creer le tag : `git tag vX.Y.Z`
4. Pousser : `git push origin main --tags`
5. La GitHub Action se charge de publier sur npm et creer la release GitHub

## Protection de la branche main (recommande)

- Exiger au moins 1 review sur les PRs
- Exiger que les checks CI passent
- Exiger que la branche soit a jour avant merge
- Interdire les force push

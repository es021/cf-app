# CF App

Stacks:
- React
- Redux
- GraphQL

# Git Note

## Rewrite All Local Change With Remote
First do a commit of your changes

git add *
git commit -a -m "local file server commit message"

Then fetch the changes and overwrite if there is a conflict

git fetch origin master
git merge -s recursive -X theirs origin/master

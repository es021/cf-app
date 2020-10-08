# CREATE NEW BRANCH
git checkout -b new_branch
** make changes **
git commit -a -m 'changes for new_branch done'
# MERGE TO MASTER
git checkout master
git merge new_branch

# IN CASE OF HOTFIX
git checkout master
git checkout -b hotfix
** make changes **
git commit -a -m 'hotfix done'
git checkout master
git merge hotfix


# DELETE BRANCH
git branch -d new_branch
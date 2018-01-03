#!/bin/bash
readonly user='zedwang'
readonly passwd='wangzd0818'
readonly remote='github.com/HanSight-Dev/pentagon-entry.git'
repoDir='./pentagon-entry'
echo 'begin clone'
if [! -d '$repoDir']; then
git clone https://${repo.username}:${repo.passwd}@${repo.remote}
echo 'clone completed'
fi
cd ./pentagon-entry
git checkout -b dev-icon --track origin/dev-icon
git pull

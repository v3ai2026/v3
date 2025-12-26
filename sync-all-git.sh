



set -e

for dir in */; do
  if [ -d "$dir/.git" ]; then
    echo "\n==== $dir ===="
    cd "$dir"
    echo "拉取远程更新..."
    git pull
    echo "推送本地修改..."
    git add .
    git commit -am "sync: 本地自动同步" || echo "无新提交"
    git push
    cd ..
  fi
done

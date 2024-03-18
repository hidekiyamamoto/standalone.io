echo off
echo "Compiling.Adding all modifications, committing, pulling, pushing."
for /r %%v in (*.ts) do asc "%%v" -b "%%~nv.wasm"
git add .
git commit -m %1
git pull
git push

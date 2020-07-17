rm -rf dist
tsc
cd src
copyfiles **/*.html **/*.css ../dist/
cd ..
pm2 start dist/index.js --name "clickfarm"
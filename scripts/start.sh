rm -rf dist
npm i
tsc
cd src
copyfiles **/*.html **/*.css ../dist/
cd ..
pm2 stop clickfarm
pm2 start dist/index.js --name "clickfarm"
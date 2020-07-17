rm -rf dist
tsc
cd src
copyfiles **/*.html **/*.css ../dist/
cd ..
node dist/index.js
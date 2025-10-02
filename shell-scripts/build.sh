rm -rf dist
tsc
cp -r templates dist/templates
chmod +x dist/cli/cli.js
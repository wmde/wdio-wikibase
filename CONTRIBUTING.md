# Contributing

## How to make a new Release

1. Update version number in package.json (follow [Semantic Versioning](https://semver.org/)) in an extra commit
1. Merge the Pull Request with that commit
1. Tag the commit with the new version number on master locally and push the tag to GitHub
1. Github actions push the new Version to [npm](https://www.npmjs.com/package/wdio-wikibase)
1. On GitHub create a new "[Release](https://github.com/wmde/wdio-wikibase/releases)" for the tag with information on what changed

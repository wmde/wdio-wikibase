# wdio-wikibase
WebdriverIO plugin for testing a Wikibase repo.

This module contains mostly pageobjects and pagesections to be used in selenium browser tests for Wikibase.
Usage example:
the file pageobjects/item.page.js contains the pageobject for the item spec file. In `Wikibase/repo/tests/selenium/specs/item.js` it will have to be imported as follows:
```js
import ItemPage from 'wdio-wikibase/pageobjects/item.page.js';
```

This enables components from the pageobject to be used in the spec by calling ItemPage. e.g.:
```js
ItemPage.addStatementLink.click();
```

To update or change the contents of this module, clone it locally and commit the changes. Once a new npm version will be released you can run an npm update on your Wikibase instance, after which your changes should be available to you locally.

## Contributing

Please file any bugs or issues with our issue-tracker at [phabricator.wikimedia.org](https://phabricator.wikimedia.org/maniphest/task/edit/form/1/?tags=Wikidata,Browser-Tests).

For instruction of how to create a new release, please see [CONTRIBUTING.md](https://github.com/wmde/wdio-wikibase/blob/master/CONTRIBUTING.md)

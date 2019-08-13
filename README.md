# wdio-wikibase
WebdriverIO plugin for testing a Wikibase repo.

This module contains mostly pageobjects and pagesections to be used in selenium browser tests for Wikibase.
Usage example:
the file pageobjects/item.page.js contains the pageobject for the item spec file. In Wikibase/repo/selenium/specs/item.js it will have to be required as follows:  
`const ItemPage = require( 'wdio-wikibase/pageobjects/item.page' );`

This enables components from the pageobject to be used in the spec by calling Itempage. e.g.:
`ItemPage.addStatementLink.click();`

To update or change the contents of this module, clone it locally and commit the changes. Once a new npm version will be released you can run an npm update on your Wikibase instance, after which your changes should be available to you locally.

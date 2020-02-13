const Page = require( 'wdio-mediawiki/Page' );

class NonExistingItemPage extends Page {
	get editTab() { return $( '.ca-edit' ); }

	open() {
		super.openTitle( 'Special:EntityPage/Q999999999' );
	}

	get title() { return $( '.firstHeading' ); }
}

module.exports = new NonExistingItemPage();

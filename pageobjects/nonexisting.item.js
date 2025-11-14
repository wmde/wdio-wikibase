import Page from 'wdio-mediawiki/Page.js';

class NonExistingItemPage extends Page {
	get editTab() {
		return $( '.ca-edit' );
	}

	async open() {
		await super.openTitle( 'Special:EntityPage/Q999999999' );
	}

	get title() {
		return $( '.firstHeading' );
	}
}

export default new NonExistingItemPage();

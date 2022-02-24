const Page = require( 'wdio-mediawiki/Page' );

class EntityPage extends Page {

	open( entityId ) {
		super.openTitle( `Special:EntityPage/${entityId}` );

		browser.executeAsync( () => {
			mw.cookie.set( 'wikibase-no-anonymouseditwarning', 'true' ); // eslint-disable-line no-undef
		} );
	}
}

module.exports = new EntityPage();

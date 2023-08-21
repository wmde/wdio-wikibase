const Page = require( 'wdio-mediawiki/Page' );

class EntityPage extends Page {

	async open( entityId ) {
		await super.openTitle( `Special:EntityPage/${entityId}` );

		await browser.execute( () => {
			mw.cookie.set( 'wikibase-no-anonymouseditwarning', 'true' ); // eslint-disable-line no-undef
		} );
	}
}

module.exports = new EntityPage();

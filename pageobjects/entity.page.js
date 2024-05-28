const Page = require( 'wdio-mediawiki/Page' );

class EntityPage extends Page {

	async open( entityId ) {
		await super.openTitle( `Special:EntityPage/${entityId}` );

		await browser.executeAsync( ( done ) => {
			mw.loader.using( 'mediawiki.cookie' ).then( () => { // eslint-disable-line no-undef
				mw.cookie.set( 'wikibase-no-anonymouseditwarning', 'true' ); // eslint-disable-line no-undef
				done();
			} );
		} );
	}
}

module.exports = new EntityPage();

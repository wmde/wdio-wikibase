'use strict';

const Page = require( 'wdio-mediawiki/Page' );
const Util = require( 'wdio-mediawiki/Util' );

class EntityPage extends Page {

	async open( entityId ) {
		await super.openTitle( `Special:EntityPage/${ entityId }` );

		await Util.waitForModuleState( 'mediawiki.base', 'ready', 10000 ); // wait for mediawiki to be ready
		await browser.executeAsync( ( done ) => {
			mw.loader.using( 'mediawiki.cookie' ).then( () => { // eslint-disable-line no-undef
				mw.cookie.set( 'wikibase-no-anonymouseditwarning', 'true' ); // eslint-disable-line no-undef
				done();
			} );
		} );
	}
}

module.exports = new EntityPage();

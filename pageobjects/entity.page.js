import Page from 'wdio-mediawiki/Page.js';
import { waitForModuleState } from 'wdio-mediawiki/Util.js';

class EntityPage extends Page {

	async open( entityId ) {
		await super.openTitle( `Special:EntityPage/${ entityId }` );

		await waitForModuleState( 'mediawiki.base', 'ready', 10000 ); // wait for mediawiki to be ready
		await browser.executeAsync( ( done ) => {
			mw.loader.using( 'mediawiki.cookie' ).then( () => { // eslint-disable-line no-undef
				mw.cookie.set( 'wikibase-no-anonymouseditwarning', 'true' ); // eslint-disable-line no-undef
				done();
			} );
		} );
	}
}

export default new EntityPage();

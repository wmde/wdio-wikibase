'use strict';

const MWBot = require( 'mwbot' );
const request = require( 'request' );

class WikibaseApi {

	/**
	 * Initialize the API
	 *
	 * @param {string} [cpPosIndex] The value of the cpPosIndex browser cookie.
	 * Optional, but strongly recommended to have chronology protection.
	 * @return {Promise}
	 */
	initialize( cpPosIndex ) {
		const jar = request.jar();
		if ( cpPosIndex ) {
			const cookie = request.cookie( `cpPosIndex=${cpPosIndex}` );
			jar.setCookie( cookie, browser.config.baseUrl );
		}
		const bot = new MWBot(
			{
				apiUrl: `${browser.config.baseUrl}/api.php`
			},
			{
				jar: jar
			}
		);
		return bot.loginGetEditToken( {
			username: browser.config.mwUser,
			password: browser.config.mwPwd
		} ).then( () => {
			this.bot = bot;
			return bot;
		} );
	}

	/**
	 * @return {Promise} resolving with MWBot
	 */
	getBot() {
		if ( !this.bot ) {
			console.trace( 'WARNING: WikibaseApi not initialized' );
			return this.initialize();
		}

		return Promise.resolve( this.bot );
	}

	/**
	 * Create an item
	 *
	 * @param {(string|Object)} [label] Optional English label of the item or object containing all labels
	 * @param {Object} [data] Optional data to populate the item with
	 * @return {Promise}
	 */
	async createItem( label, data ) {
		const itemData = {};
		let labels = {};

		if ( typeof label === 'object' ) {
			labels = label;
		} else if ( label ) {
			labels = {
				en: {
					language: 'en',
					value: label
				}
			};
		}

		Object.assign( itemData, { labels }, data );

		const bot = await this.getBot();

		return bot.request( {
			action: 'wbeditentity',
			new: 'item',
			data: JSON.stringify( itemData ),
			token: bot.editToken
		} ).then( ( response ) => {
			return response.entity.id;
		} );
	}

	async createProperty( datatype, data ) {
		let propertyData = {};

		propertyData = Object.assign( {}, { datatype }, data );

		const bot = await this.getBot();

		return new Promise( ( resolve, reject ) => { // FIXME: I don't think this Promise is needed
			bot.request( {
				action: 'wbeditentity',
				new: 'property',
				data: JSON.stringify( propertyData ),
				token: bot.editToken
			} ).then( ( response ) => {
				resolve( response.entity.id );
			}, reject );
		} );
	}

	async getEntity( id ) {
		const bot = await this.getBot();
		return new Promise( ( resolve, reject ) => {
			bot.request( {
				ids: id,
				action: 'wbgetentities',
				token: bot.editToken
			} ).then( ( response ) => {
				resolve( response.entities[ id ] );
			}, reject );
		} );
	}

	async protectEntity( entityId ) {
		const bot = await this.getBot();
		let entityTitle;

		return bot.request( {
			action: 'wbgetentities',
			format: 'json',
			ids: entityId,
			props: 'info'
		} ).then( ( getEntitiesResponse ) => {
			entityTitle = getEntitiesResponse.entities[ entityId ].title;
			return bot.request( {
				action: 'protect',
				title: entityTitle,
				protections: 'edit=sysop',
				token: bot.editToken
			} );
		} );
	}

	getProperty( datatype ) {
		const envName = `WIKIBASE_PROPERTY_${datatype.toUpperCase()}`;
		if ( envName in process.env ) {
			return Promise.resolve( process.env[ envName ] );
		} else {
			return this.createProperty( datatype ).then( ( propertyId ) => {
				process.env[ envName ] = propertyId;
				return propertyId;
			} );
		}
	}

}

module.exports = new WikibaseApi();

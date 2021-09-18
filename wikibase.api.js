'use strict';

const MWBot = require( 'mwbot' );

class WikibaseApi {

	/**
	 * Create an item
	 *
	 * @param {(string|Object)} [label] Optional English label of the item or object containing all labels
	 * @param {Object} [data] Optional data to populate the item with
	 * @return {Promise}
	 */
	createItem( label, data ) {
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

		return this.getBot().getEditToken()
			.then( () => {
				return this.getBot().request( {
					action: 'wbeditentity',
					new: 'item',
					data: JSON.stringify( itemData ),
					token: this.getBot().editToken
				} );
			} ).then( ( response ) => {
				return response.entity.id;
			} );
	}

	createProperty( datatype, data ) {
		let propertyData = {};

		propertyData = Object.assign( {}, { datatype }, data );

		return this.getBot().getEditToken()
			.then( () => {
				return new Promise( ( resolve, reject ) => {
					this.getBot().request( {
						action: 'wbeditentity',
						new: 'property',
						data: JSON.stringify( propertyData ),
						token: this.getBot().editToken
					} ).then( ( response ) => {
						resolve( response.entity.id );
					}, reject );
				} );
			} );
	}

	getEntity( id ) {
		return new Promise( ( resolve, reject ) => {
			this.getBot().request( {
				ids: id,
				action: 'wbgetentities',
				token: this.getBot().editToken
			} ).then( ( response ) => {
				resolve( response.entities[ id ] );
			}, reject );
		} );
	}

	protectEntity( entityId ) {
		let entityTitle;

		return this.getBot().request( {
			action: 'wbgetentities',
			format: 'json',
			ids: entityId,
			props: 'info'
		} ).then( ( getEntitiesResponse ) => {
			entityTitle = getEntitiesResponse.entities[ entityId ].title;
			return this.getBot().loginGetEditToken( {
				username: browser.config.mwUser,
				password: browser.config.mwPwd
			} );
		} ).then( () => {
			return this.getBot().request( {
				action: 'protect',
				title: entityTitle,
				protections: 'edit=sysop',
				token: this.getBot().editToken
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

	/**
	 * Helpful if you want to reuse a bot with its edit/other tokens.
	 *
	 * @return {MWBot}
	 */
	getBot() {
		return this.bot || new MWBot( {
			apiUrl: `${browser.config.baseUrl}/api.php`
		} );
	}

}

module.exports = WikibaseApi;

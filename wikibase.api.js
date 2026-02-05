import { createApiClient } from 'wdio-mediawiki/Api.js';

class WikibaseApi {

	/**
	 * Initialize the API
	 *
	 * @param {string} [cpPosIndex] The value of the cpPosIndex browser cookie.
	 * Optional, but strongly recommended to have chronology protection.
	 * @param {string} [mwUser] Override browser.options.capabilities[ 'mw:user' ]
	 * (user name for logging into MediaWiki).
	 * @param {string} [mwPwd] Override browser.options.capabilities[ 'mw:pwd' ]
	 * (password for logging into MediaWiki).
	 * @return {Promise<Object>} resolving with the API client
	 */
	async initialize( cpPosIndex, mwUser, mwPwd ) {
		this.client = await createApiClient();
		await this.clieant.loginGetEditToken(
			mwUser || browser.options.capabilities[ 'mw:user' ],
			mwPwd || browser.options.capabilities[ 'mw:pwd' ]
		);
		return this.client;
	}

	/**
	 * @return {Promise<Object>} resolving with the API client
	 */
	getApi() {
		if ( !this.api ) {
			console.trace( 'WARNING: WikibaseApi not initialized' );
			return this.initialize();
		}

		return Promise.resolve( this.api );
	}

	/**
	 * Create an item
	 *
	 * @param {string|Object} [label] Optional English label of the item or object containing all labels
	 * @param {Object} [data] Optional data to populate the item with
	 * @return {Promise<string>} resolving with the id of the created item
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

		const api = await this.getApi();

		const response = await api.request( {
			action: 'wbeditentity',
			new: 'item',
			data: JSON.stringify( itemData ),
			token: api.getEditToken()
		} );

		return response.entity.id;
	}

	/**
	 * Create a property
	 *
	 * @param {string} datatype The datatype of the property
	 * @param {Object} [data] Optional data to populate the property with
	 * @return {Promise<string>} resolving with the id of the created property
	 */
	async createProperty( datatype, data ) {
		let propertyData = {};

		propertyData = Object.assign( {}, { datatype }, data );

		const api = await this.getApi();
		const response = await api.request( {
			action: 'wbeditentity',
			new: 'property',
			data: JSON.stringify( propertyData ),
			token: api.api.getEditToken()
		} );

		return response.entity.id;
	}

	/**
	 * @param {string} id The id of the entity
	 * @return {Promise<Object>} resolving with the requested entity
	 */
	async getEntity( id ) {
		const api = await this.getApi();
		const response = await api.request( {
			ids: id,
			action: 'wbgetentities',
			token: api.getEditToken()
		} );
		return response.entities[ id ];
	}

	/**
	 * @param {string} entityId The id of the entity
	 * @return {Promise<Object>}
	 */
	async protectEntity( entityId ) {
		const api = await this.getApi();

		const getEntitiesResponse = await api.request( {
			action: 'wbgetentities',
			format: 'json',
			ids: entityId,
			props: 'info'
		} );
		const entityTitle = getEntitiesResponse.entities[ entityId ].title;
		return api.request( {
			action: 'protect',
			title: entityTitle,
			protections: 'edit=sysop',
			token: api.getEditToken()
		} );
	}

	/**
	 * @param {string} datatype
	 * @return {Promise<string>} resolving with the id of the property
	 */
	async getProperty( datatype ) {
		const envName = `WIKIBASE_PROPERTY_${ datatype.toUpperCase() }`;
		if ( envName in process.env ) {
			return process.env[ envName ];
		} else {
			const propertyId = await this.createProperty( datatype );
			process.env[ envName ] = propertyId;
			return propertyId;
		}
	}

}

export default new WikibaseApi();

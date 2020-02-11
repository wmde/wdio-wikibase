'use strict';

const MainStatementSection = ( Base ) => class extends Base {

	static get STATEMENT_WIDGET_SELECTORS() {
		return {
			EDIT_INPUT_PROPERTY: '.ui-entityselector-input',
			EDIT_INPUT_VALUE: '.valueview-input',
			STATEMENT_VALUE: '.wikibase-snakview-value'
		};
	}

	static get TOOLBAR_WIDGET_SELECTORS() {
		return {
			ADD_BUTTON: '.wikibase-toolbar-button-add',
			EDIT_BUTTON: '.wikibase-toolbar-button-edit',
			REMOVE_BUTTON: '.wikibase-toolbar-button-remove',
			SAVE_BUTTON: '.wikibase-toolbar-button-save',
			CANCEL_BUTTON: '.wikibase-toolbar-button-cancel'
		};
	}

	get mainStatementsContainer() {
		return $( 'div.wikibase-entityview-main > .wikibase-statementgrouplistview' );
	}

	get addMainStatementLink() {
		return this.mainStatementsContainer.$( 'div.wikibase-addtoolbar > span > a' );
	}

	/**
	 * Add a statement
	 *
	 * N.B. A main statement is statement attached to an entity e.g. statements on Items and Properties
	 * a non-main statement could be on a sub-entity like a Form
	 *
	 * Todo: include references and qualifiers
	 *
	 * @param {string} property
	 * @param {string} value
	 */
	addMainStatement( property, value ) {
		this.addMainStatementLink.waitForVisible();
		this.addMainStatementLink.click();

		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY
		).setValue( property );

		this.selectFirstSuggestedEntityOnEntitySelector();

		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).waitForVisible();
		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).setValue( value );

		this.clickSaveOnStatementElement( this.mainStatementsContainer );

		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).waitForExist( null, true );
	}

	addReferenceToNthStatementOfStatementGroup( index, propertyId, referenceProperty, referenceValue ) {
		var statement = this.getStatementElement( index, propertyId ),
			referencesContainer = statement.$( '.wikibase-statementview-references-container' );

		if ( !referencesContainer.isVisible( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON ) ) {
			statement.$( '.wikibase-statementview-references-heading' ).click();
			statement.waitForVisible( '.wikibase-statementview-references' );
			referencesContainer.waitForVisible( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON );
		}
		referencesContainer.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON ).click();
		referencesContainer.waitForVisible( this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY );
		referencesContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY
		).setValue( referenceProperty );

		this.selectFirstSuggestedEntityOnEntitySelector();

		referencesContainer.waitForExist( this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE );
		referencesContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).setValue( referenceValue );
		this.clickSaveOnStatementElement( statement );

		referencesContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).waitForExist( null, true );
	}

	/**
	 * Get data of the nth statement of a statementGroup on a page
	 *
	 * Todo: include other data e.g. references and qualifiers
	 *
	 * @param {int} index
	 * @param {string} propertyId
	 * @return {{value}}
	 */
	getNthStatementDataFromMainStatementGroup( index, propertyId ) {
		const statementGroup = $( `#${propertyId}` ),
			statements = statementGroup.$$( '.wikibase-statementview' ),
			statement = statements[ index ];

		return {
			value: statement.$( this.constructor.STATEMENT_WIDGET_SELECTORS.STATEMENT_VALUE ).getText()
		};
	}

	/**
	 * Click the save button of a specific statement within a statement group
	 *
	 * @param {int} index of the statement within the group
	 * @param {string} propertyId
	 */
	clickSaveOnStatement( index, propertyId ) {
		const statement = this.getStatementElement( index, propertyId );
		this.clickSaveOnStatementElement( statement );
	}

	/**
	 * Click the cancel button of a specific statement within a statement group
	 *
	 * @param {int} index of the statement within the group
	 * @param {string} propertyId
	 */
	clickCancelOnStatement( index, propertyId ) {
		const statement = this.getStatementElement( index, propertyId );
		this.clickCancelOnStatementElement( statement );
	}

	/**
	 * Click save button in a statement element
	 *
	 * @private
	 * @param {element} element
	 */
	clickSaveOnStatementElement( element ) {
		var self = this;
		element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.SAVE_BUTTON ).waitUntil( function () {
			return self.mainStatementsContainer.$(
				self.constructor.TOOLBAR_WIDGET_SELECTORS.SAVE_BUTTON
			).getAttribute( 'aria-disabled' ) === 'false';
		} );
		element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.SAVE_BUTTON ).click();
	}

	/**
	 * Click cancel button in a statement element
	 *
	 * @private
	 * @param {element} element
	 */
	clickCancelOnStatementElement( element ) {
		var self = this;
		element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.CANCEL_BUTTON ).waitUntil( function () {
			return element.$(
				self.constructor.TOOLBAR_WIDGET_SELECTORS.CANCEL_BUTTON
			).getAttribute( 'aria-disabled' ) === 'false';
		} );
		element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.CANCEL_BUTTON ).click();
	}

	/**
	 * Click the edit button of a specific statement with a statement group
	 *
	 * @param {int} index
	 * @param {string} propertyId
	 */
	clickEditOnStatement( index, propertyId ) {
		const statement = this.getStatementElement( index, propertyId );
		this.clickEditOnStatementElement( statement );
	}

	/**
	 * Click edit button in a statement element
	 *
	 * @private
	 * @param {element} element
	 */
	clickEditOnStatementElement( element ) {
		element.waitForExist( this.constructor.TOOLBAR_WIDGET_SELECTORS.EDIT_BUTTON );
		element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.EDIT_BUTTON ).click();
	}

	/**
	 * Enter edit mode of a specific statement in a statementGroup, set the value and save
	 *
	 * @param {int} index
	 * @param {string} propertyId
	 * @param {string} value
	 */
	editStatementValue( index, propertyId, value ) {
		this.clickEditOnStatement( index, propertyId );
		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).waitForVisible();
		this.mainStatementsContainer.$(
			this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
		).setValue( value );
		this.clickSaveOnStatement( index, propertyId );
	}

	/**
	 * Return statement element of a specific statement in a statementGroup
	 *
	 * @private
	 * @param {int} index
	 * @param {string} propertyId
	 * @return {element}
	 */
	getStatementElement( index, propertyId ) {
		return $( `#${propertyId}` ).$$( '.wikibase-statementview' )[ index ];
	}

};

module.exports = MainStatementSection;

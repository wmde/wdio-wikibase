'use strict';

const MainStatementSection = ( Base ) => {
	/** @extends Base */
	return class MainStatementSectionMixin extends Base {

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

		/**
		 * @return {WebdriverIO.Element}
		 */
		get mainStatementsContainer() {
			return $( 'div.wikibase-entityview-main > .wikibase-statementgrouplistview' );
		}

		/**
		 * @return {WebdriverIO.Element}
		 */
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
		async addMainStatement( property, value ) {
			await this.addMainStatementLink.waitForDisplayed();
			await this.addMainStatementLink.click();

			await this.mainStatementsContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY
			).setValue( property );

			await this.selectFirstSuggestedEntityOnEntitySelector();

			await this.mainStatementsContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			).waitForDisplayed();
			await this.mainStatementsContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			).setValue( value );

			await this.clickSaveOnStatementElement( this.mainStatementsContainer );

			await this.mainStatementsContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			).waitForExist( { reverse: true } );
		}

		/**
		 * @param {int} index
		 * @param {string} propertyId
		 * @param {string} referenceProperty
		 * @param {string} referenceValue
		 */
		async addReferenceToNthStatementOfStatementGroup( index, propertyId, referenceProperty, referenceValue ) {
			var statement = await this.getStatementElement( index, propertyId ),
				referencesContainer = await statement.$( '.wikibase-statementview-references-container' );

			if ( !await referencesContainer.isDisplayed( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON ) ) {
				await statement.$( '.wikibase-statementview-references-heading' ).click();
				await statement.$( '.wikibase-statementview-references' ).waitForDisplayed();
				await referencesContainer.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON ).waitForDisplayed();
			}
			await referencesContainer.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.ADD_BUTTON ).click();
			await referencesContainer.$( this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY )
				.waitForDisplayed();
			await referencesContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_PROPERTY
			).setValue( referenceProperty );

			await this.selectFirstSuggestedEntityOnEntitySelector();

			await referencesContainer.$( this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE ).waitForExist();
			await referencesContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			).setValue( referenceValue );
			await this.clickSaveOnStatementElement( statement );

			await referencesContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			).waitForExist( { reverse: true } );
		}

		/**
		 * Get data of the nth statement of a statementGroup on a page
		 *
		 * Todo: include other data e.g. references and qualifiers
		 *
		 * @param {int} index
		 * @param {string} propertyId
		 * @return {{value: string}}
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
		async clickSaveOnStatement( index, propertyId ) {
			await this.clickSaveOnStatementElement( this.getStatementElement( index, propertyId ) );
		}

		/**
		 * Click the cancel button of a specific statement within a statement group
		 *
		 * @param {int} index of the statement within the group
		 * @param {string} propertyId
		 */
		async clickCancelOnStatement( index, propertyId ) {
			await this.clickCancelOnStatementElement( this.getStatementElement( index, propertyId ) );
		}

		/**
		 * Click save button in a statement element
		 *
		 * @private
		 * @param {WebdriverIO.Element} element
		 */
		async clickSaveOnStatementElement( element ) {
			const saveButton = element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.SAVE_BUTTON );
			await saveButton.waitUntil( async () => await saveButton.getAttribute( 'aria-disabled' ) === 'false' );
			await saveButton.click();
		}

		/**
		 * Click cancel button in a statement element
		 *
		 * @private
		 * @param {WebdriverIO.Element} element
		 */
		async clickCancelOnStatementElement( element ) {
			const cancelButton = element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.CANCEL_BUTTON );
			await cancelButton.waitUntil( async () => await cancelButton.getAttribute( 'aria-disabled' ) === 'false' );
			await cancelButton.click();
		}

		/**
		 * Click the edit button of a specific statement with a statement group
		 *
		 * @param {int} index
		 * @param {string} propertyId
		 */
		async clickEditOnStatement( index, propertyId ) {
			await this.clickEditOnStatementElement( this.getStatementElement( index, propertyId ) );
		}

		/**
		 * Click edit button in a statement element
		 *
		 * @private
		 * @param {WebdriverIO.Element} element
		 */
		async clickEditOnStatementElement( element ) {
			await element.waitForExist( this.constructor.TOOLBAR_WIDGET_SELECTORS.EDIT_BUTTON );
			await element.$( this.constructor.TOOLBAR_WIDGET_SELECTORS.EDIT_BUTTON ).click();
		}

		/**
		 * Enter edit mode of a specific statement in a statementGroup, set the value and save
		 *
		 * @param {int} index
		 * @param {string} propertyId
		 * @param {string} value
		 */
		async editStatementValue( index, propertyId, value ) {
			await this.clickEditOnStatement( index, propertyId );
			const statementEditInput = this.mainStatementsContainer.$(
				this.constructor.STATEMENT_WIDGET_SELECTORS.EDIT_INPUT_VALUE
			);
			await statementEditInput.waitForDisplayed();
			await statementEditInput.setValue( value );
			await this.clickSaveOnStatement( index, propertyId );
		}

		/**
		 * Return statement element of a specific statement in a statementGroup
		 *
		 * @private
		 * @param {int} index
		 * @param {string} propertyId
		 * @return {WebdriverIO.Element}
		 */
		getStatementElement( index, propertyId ) {
			return $( `#${propertyId}` ).$$( '.wikibase-statementview' )[ index ];
		}

	};
};

module.exports = MainStatementSection;

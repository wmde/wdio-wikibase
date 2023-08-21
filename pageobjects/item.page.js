'use strict';

const Page = require( 'wdio-mediawiki/Page' ),
	MixinBuilder = require( '../pagesections/mixinbuilder' ),
	MainStatementSection = require( '../pagesections/main.statement.section' ),
	ComponentInteraction = require( '../pagesections/ComponentInteraction' ),
	TaintedRefSection = require( '../pagesections/tainted.ref.section' ),
	PageMixture = MixinBuilder.mix( Page ).with( MainStatementSection, ComponentInteraction, TaintedRefSection );

class ItemPage extends PageMixture {
	static get ITEM_WIDGET_SELECTORS() {
		return {
			MAIN_STATEMENTS: 'div.wikibase-entityview-main > .wikibase-statementgrouplistview',
			ADD_STATEMENT: 'div.wikibase-addtoolbar > .wikibase-toolbar-button-add > a',
			SAVE_BUTTON: '.wikibase-toolbar-button-save',
			EDIT: '.wikibase-toolbar-container .wikibase-toolbar-button-edit',
			PROPERTY_INPUT: '.ui-entityselector-input',
			VALUE_INPUT: '.valueview-input',
			ITEM_DESCRIPTION_INPUT: '.wikibase-descriptionview-text .wikibase-descriptionview-input',
			QUALIFIERS: '.wikibase-statementview-qualifiers .listview-item',
			QUALIFIER_VALUE: '.wikibase-statementview-qualifiers .listview-item:first-child .valueview-input',
			REFERENCES: '.wikibase-statementview-references',
			REFERENCE_VALUE: '.wikibase-statementview-references .listview-item:first-child .valueview-input',
			NTH_ELEMENT: '.wikibase-listview > .listview-item',
			RECENT_CHANGES: '#n-recentchanges',
			LASTCHANGE_HISTORY: '.mw-changeslist-last .mw-changeslist-history',
			REVISION: '#pagehistory',
			REVISION_DATE_LINK: '.after .mw-changeslist-date'
		};
	}

	async open( entityId ) {
		await super.openTitle( `Special:EntityPage/${entityId}` );
	}

	get statements() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.MAIN_STATEMENTS ).$$( '.wikibase-statementgroupview' );
	}

	get addStatementLink() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.ADD_STATEMENT );
	}

	get propertyInputField() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.PROPERTY_INPUT );
	}

	get valueInputField() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.VALUE_INPUT );
	}

	get editButton() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.EDIT );
	}

	get saveButton() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.SAVE_BUTTON );
	}

	get recentChanges() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.RECENT_CHANGES );
	}

	get lastChangeHistory() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.LASTCHANGE_HISTORY );
	}

	get descriptionInputField() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.ITEM_DESCRIPTION_INPUT );
	}

	get firstQualifier() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.QUALIFIER_VALUE );
	}

	get firstReference() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.REFERENCE_VALUE );
	}

	getNthQualifierPropertyInput( statement, qualifierIndex ) {
		const qualifiers = statement.$$( this.constructor.ITEM_WIDGET_SELECTORS.QUALIFIERS );
		return qualifiers[ qualifierIndex ].$( this.constructor.ITEM_WIDGET_SELECTORS.PROPERTY_INPUT );
	}

	getNthReferencePropertyInput( statement, referenceIndex ) {
		const references = statement.$$( this.constructor.ITEM_WIDGET_SELECTORS.REFERENCES );
		return references[ referenceIndex ].$( this.constructor.ITEM_WIDGET_SELECTORS.PROPERTY_INPUT );
	}

	async editItemDescription( description ) {
		// Wait for the frontend to fully initialize first, so that we don't click on
		// the link to Special:SetLabelDescriptionAliases, but use the JS version.
		await this.addStatementLink.waitForExist( { timeout: 3000 } );
		await this.editButton.waitForExist( { timeout: 1000 } );
		await this.editButton.click();
		await this.descriptionInputField.waitForExist();
		await this.descriptionInputField.setValue( description );
		await this.saveButton.waitForExist( { timeout: 1000 } );
		await this.saveButton.click();
	}

	async isSaveButtonEnabled() {
		return await $( this.constructor.ITEM_WIDGET_SELECTORS.SAVE_BUTTON )
			.getAttribute( 'aria-disabled' ) === 'false';
	}
}

module.exports = new ItemPage();

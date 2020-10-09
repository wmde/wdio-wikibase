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

	open( entityId ) {
		super.openTitle( `Special:EntityPage/${entityId}` );
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
		const qualifier = statement.$$( this.constructor.ITEM_WIDGET_SELECTORS.QUALIFIERS )[ qualifierIndex ];
		return qualifier.$( this.constructor.ITEM_WIDGET_SELECTORS.PROPERTY_INPUT );
	}

	getNthReferencePropertyInput( statement, referenceIndex ) {
		const reference = statement.$$( this.constructor.ITEM_WIDGET_SELECTORS.REFERENCES )[ referenceIndex ];
		return reference.$( this.constructor.ITEM_WIDGET_SELECTORS.PROPERTY_INPUT );
	}

	editItemDescription( description ) {

		this.editButton.waitForExist( { timeout: 3000 } );
		browser.pause( 100 );
		this.editButton.click();
		this.descriptionInputField.waitForExist();
		this.descriptionInputField.setValue( description );
		this.saveButton.waitForExist( { timeout: 1000 } );
		this.saveButton.click();
	}

	goToPreviousRevision() {
		this.recentChanges.click();
		this.lastChangeHistory.waitForExist( { timeout: 1000 } );
		this.lastChangeHistory.click();
		const revisionList = $( this.constructor.ITEM_WIDGET_SELECTORS.REVISION );
		revisionList.$( this.constructor.ITEM_WIDGET_SELECTORS.REVISION_DATE_LINK ).waitForExist();
		revisionList.$( this.constructor.ITEM_WIDGET_SELECTORS.REVISION_DATE_LINK ).click();
	}

	isSaveButtonEnabled() {
		return $( this.constructor.ITEM_WIDGET_SELECTORS.SAVE_BUTTON ).getAttribute( 'aria-disabled' ) === 'false';
	}
}

module.exports = new ItemPage();

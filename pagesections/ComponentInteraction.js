'use strict';

const ComponentInteraction = ( Base ) => {
	/** @extends Base */
	return class ComponentInteractionMixin extends Base {

		static get OOUI_SELECTORS() {
			const visibleCondition = 'not(contains(@style,"display: none"))';

			return {
				LOOKUP_OPTION_WIDGET: '.oo-ui-lookupElement-menu .oo-ui-optionWidget',
				MULTI_OPTION_WIDGET: '.oo-ui-optionWidget',
				OPTION_WIDGET_SELECTED: '.oo-ui-optionWidget-selected',
				OVERLAY: '.oo-ui-defaultOverlay',
				COMBOBOX_DROPDOWN: '.oo-ui-comboBoxInputWidget-dropdownButton',
				VISIBLE_ENTITY_SUGGESTION: `//ul[contains(@class, "ui-suggester-list")][${visibleCondition}]//li`
			};
		}

		/**
		 * @param {WebdriverIO.Element} element
		 * @param {string|number} value
		 */
		setValueOnLookupElement( element, value ) {
			element.$( 'input' ).setValue( value );
			$( 'body' ).$( this.constructor.OOUI_SELECTORS.LOOKUP_OPTION_WIDGET ).waitForDisplayed();
			$( this.constructor.OOUI_SELECTORS.LOOKUP_OPTION_WIDGET ).click();
		}

		/**
		 * @param {WebdriverIO.Element} element
		 * @param {string|number} value
		 */
		setSingleValueOnMultiselectElement( element, value ) {
			element.$( 'input' ).setValue( value );
			element.$( this.constructor.OOUI_SELECTORS.MULTI_OPTION_WIDGET ).waitForDisplayed();
			element.$( this.constructor.OOUI_SELECTORS.MULTI_OPTION_WIDGET ).click();
		}

		/**
		 * @param {WebdriverIO.Element} element
		 * @param {string|number} value
		 */
		setValueOnComboboxElement( element, value ) {
			const OOUI_SELECTORS = this.constructor.OOUI_SELECTORS;
			element.$( 'input' ).setValue( value );
			browser.waitUntil( () => {
				return browser.isDisplayed(
					`${OOUI_SELECTORS.OVERLAY} ${OOUI_SELECTORS.OPTION_WIDGET_SELECTED}`
				);
			} );
			// close suggestion overlay
			element.$( OOUI_SELECTORS.COMBOBOX_DROPDOWN ).click();
		}

		async selectFirstSuggestedEntityOnEntitySelector() {
			await $( this.constructor.OOUI_SELECTORS.VISIBLE_ENTITY_SUGGESTION ).waitForDisplayed();
			await $( this.constructor.OOUI_SELECTORS.VISIBLE_ENTITY_SUGGESTION ).click();
		}
	};
};

module.exports = ComponentInteraction;

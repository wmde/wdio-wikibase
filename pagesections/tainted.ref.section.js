const TaintedRefSection = ( Base ) => class extends Base {
	static get TAINTED_REF_SELECTORS() {
		return {
			TAINTED_ICON: '.wb-tr-tainted-icon'
		};
	}

	get taintedRefIcon() {
		return browser.element( this.constructor.TAINTED_REF_SELECTORS.TAINTED_ICON );
	}
};

module.exports = TaintedRefSection;

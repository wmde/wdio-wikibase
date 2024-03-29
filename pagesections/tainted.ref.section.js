const TaintedRefSection = ( Base ) => {
	/** @extends Base */
	return class TaintedRefSectionMixin extends Base {
		static get TAINTED_REF_SELECTORS() {
			return {
				TAINTED_ICON: '.wb-tr-tainted-icon'
			};
		}

		get taintedRefIcon() {
			return $( this.constructor.TAINTED_REF_SELECTORS.TAINTED_ICON );
		}
	};
};

module.exports = TaintedRefSection;

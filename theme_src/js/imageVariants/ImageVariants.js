import {
    DATA_VARIANT_SLUG,
    DATA_IS_DEFAULT_VARIANT,
    CLASS_IS_ACTIVE,
    SELECTOR_VARIANT_TAB,
    SELECTOR_VARIANT_PANEL,
    QUERY_PARAMETER_VARIANT,
    SELECTOR_VARIANT_SELECT,
} from './constants';
import {
    parseUrlQueryParameterValue,
    updateUrlQueryParameter
} from '../lib/urlQuery';

/**
 * Image variants state and event handler singleton.
 */
export class ImageVariants {
    /**
     * Create a new ImageVariants instance.
     */
    constructor() {
        // Get and store the DOM elements.
        this.elsTabs = this.getEls(SELECTOR_VARIANT_TAB);
        this.elsPanels = this.getEls(SELECTOR_VARIANT_PANEL);
        this.elSelect = document.querySelector(SELECTOR_VARIANT_SELECT);
        this.elsOptions =
            this.elSelect ? this.getEls('option', this.elSelect) : [];

        if (this.hasImageVariantEls()) {
            // Get and store the default variant's slug.
            this.defaultSlug = this.getDefaultSlug();

            // Initialize the selected image variant slug state.
            this.setSelectedSlug(this.parseSlug());

            // Setup the event Listeners.
            this.setupEventListeners();
        }
    }

    /**
     * Get the DOM elements for the given selector.
     * @private
     * @param {string} selector - The selector to query.
     * @param {HTMLElement} [elParent=document] - The parent element.
     * @returns {HTMLElement[]} The DOM elements.
     */
    getEls(selector, elParent = document) {
        return Array.from(elParent.querySelectorAll(selector));
    }

    /**
     * Check if the necessary DOM elements are present.
     * @private
     * @returns {boolean} Whether the necessary DOM elements are present.
     */
    hasImageVariantEls() {
        return (
            this.elsTabs.length > 0
            && this.elsPanels.length > 0
            && this.elSelect !== null
            && this.elsOptions.length > 0
        );
    }

    /**
     * Parse the variant's slug from the URL query or return the default slug.
     * @private
     * @returns {string} The parsed or default variant slug.
     */
    parseSlug() {
        return (
            parseUrlQueryParameterValue(QUERY_PARAMETER_VARIANT)
            || this.defaultSlug
        );
    }

    /**
     * Get the slug of the variant marked as default.
     * @private
     * @returns {string} The default variant slug.
     */
    getDefaultSlug() {
        const elTabDefault = this.elsTabs.find(
            (el) => el.getAttribute(DATA_IS_DEFAULT_VARIANT) === 'true'
        );
        if (!elTabDefault) {
            throw new Error('Could not find default variant tab');
        }

        const defaultSlug = elTabDefault.getAttribute(DATA_VARIANT_SLUG);
        if (!defaultSlug) {
            throw new Error('Default variant tab has no variant slug set.')
        }
        return defaultSlug;
    }

    /**
     * Set the selected variant slug and update the DOM accordingly.
     * @param {string} selectedSlug - The selected variant slug.
     */
    setSelectedSlug(selectedSlug) {
        this.selectedSlug = selectedSlug;
        this.updateDOM();

        // Set the query string or remove it, if the selected variant is the
        // default one.
        updateUrlQueryParameter(
            QUERY_PARAMETER_VARIANT,
            selectedSlug === this.defaultSlug ? null : selectedSlug
        );
    }

    /**
     * Update the DOM in order to reflect the current state.
     * @private
     */
    updateDOM() {
        this.updateElsIsActive(this.elsTabs);
        this.updateElsIsActive(this.elsPanels);
        this.updateElsOptionsSelected();
    }

    /**
     * Update the elements' active class according to the current state.
     * @private
     * @param {HTMLElement[]} els - The elements to update.
     */
    updateElsIsActive(els) {
        els.forEach((el) => {
            if (el.getAttribute(DATA_VARIANT_SLUG) === this.selectedSlug) {
                el.classList.add(CLASS_IS_ACTIVE);
            } else {
                el.classList.remove(CLASS_IS_ACTIVE);
            }
        });
    }

    /**
     * Update the options' selected according to the current state.
     * @private
     */
    updateElsOptionsSelected() {
        this.elsOptions.forEach((el) => {
            el.selected =
                el.getAttribute(DATA_VARIANT_SLUG) === this.selectedSlug;
        });
    }

    /**
     * Setup the event listeners.
     * @private
     */
    setupEventListeners() {
        // Setup click event listeners for tabs.
        this.elsTabs.forEach((elTab) => {
            elTab.addEventListener('click', () => {
                this.onElTabClick(elTab);
            });
        });

        // Setup click event listeners for select.
        this.elSelect.addEventListener('change', (event) => {
            this.onElSelectChange(event.target);
        })

        // Setup event handler for when history state changes.
        window.onpopstate = this.onPopState.bind(this);
    }

    /**
     * Tab element click handler.
     * @private
     * @param {HTMLButtonElement} elTab
     */
    onElTabClick(elTab) {
        this.setSelectedSlug(elTab.getAttribute(DATA_VARIANT_SLUG));
    }

    /**
     * Select change event handler.
     * @param {HTMLElement} elSelect
     */
    onElSelectChange(elSelect) {
        const selectedSlug =
            this.elsOptions
            .find((elOption) => elOption.value === elSelect.value)
            .getAttribute(DATA_VARIANT_SLUG);
        this.setSelectedSlug(selectedSlug);
    }

    /**
     * Set selected slug on history state change.
     * @private
     */
    onPopState() {
        this.setSelectedSlug(this.parseSlug());
    }
}

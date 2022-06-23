/**
 * Parse the value of a given URL query parameter key.
 * @param {string} parameterKey - The key of the URL query parameter.
 * @returns {string | null} The query parameter value.
 */
export function parseUrlQueryParameterValue(parameterKey) {
    // Get query string and remove leading question mark.
    const queryString = window.location.search.slice(1);

    // Parse the query key value pairs.
    let parameterValue = null;
    queryString.split('&').forEach((kvString) => { 
        const [key, value] = kvString.split('=');
        if (key === parameterKey) parameterValue = value;
    })
    return parameterValue;
}

/**
 * Update a URL query parameter's value.
 * @param {string} key - The query parameter key.
 * @param {string | null} value - The query parameter value.
 */
export function updateUrlQueryParameter(key, value) {
    const urlBase = `${window.location.origin}${window.location.pathname}`;

    // If the value is null remove the query string.
    const url = value === null ? urlBase : `${urlBase}?${key}=${value}`;

    // If the url differs from the current one, push it to the browser history.
    if (url !== window.location.href) {
        history.pushState({}, '', url);
    }
}

let self = {
    range(from, to) {
        let range = [];

        if ( from < to ) {
            for ( let i = from; i <= to; i++ ) {
                range.push(i);
            }
        }
        else {
            for ( let i = from; i >= to; i-- ) {
                range.push(i);
            }
        }

        return range;
    },

    url_with_filters(url, default_filters = {}) {
        return window.Str.trim(url + '?' + new URLSearchParams(ReactiveStorage.getItem(`${url}__filters`) || default_filters).toString(), '?');
    },

    store_url_filters(url, filters) {
        ReactiveStorage.setItem(`${url}__filters`, filters);
    },

    alternative_windows() {
        let windows = ['current_month', 'last_month'];
        let months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        //add passed months
        windows = windows.concat(months.slice(0, new Date().getMonth() - 1).reverse());

        //add the last 3 years
        let year = new Date().getFullYear();
        windows = windows.concat([(year - 1)+'', (year - 2)+'', (year - 3)+'']);

        return windows;
    },
}

export default self;

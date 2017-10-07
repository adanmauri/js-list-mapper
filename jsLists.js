class JsLists {

	constructor(url, selector, paginatorSelector, searchSelector){
		this.url 			   = url;
		this.selector          = selector;
		this.paginatorSelector = paginatorSelector;
		this.searchSelector    = searchSelector;
	}

	async search(search){
		var selector = new ElementSelector(this.selector);
		var collection = new ElementCollection(selector);
		var paginator;
		var params;

		if (this.paginatorSelector) {
			paginator = new ElementPaginator(this.paginatorSelector);
			params = {elementSelector: selector, elementPaginator: paginator};
		} else {
			params = {elementSelector: selector};
		}

		var es = new ElementSearch(search, this.url, params, this.searchSelector);
		var r = await es.search();
		return r;
	}
}
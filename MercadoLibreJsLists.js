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

class MercadoLibreJsLists extends JsLists {
	constructor(url){
		var url = url || "http://www.mercadolibre.com.ar" ;
		var selector = {
			title: "//ol[@id='searchResults']/li//h2//span[@class='main-title']/text()",
			price: "//ol[@id='searchResults']/li//span[@class='price-fraction']/text()",
			url:   "//ol[@id='searchResults']/li//div[@class='images-viewer']//a[contains(@class, 'item__js-link')][1]/@href",
			img:   "//ol[@id='searchResults']/li//div[@class='images-viewer']//img"
		};
		var paginatorSelector = "//div[@class='pagination__container']//li[@class='pagination__next']/a/@href";
		var searchSelector = "//input[@class='nav-search-input']";
		super(url, selector, paginatorSelector, searchSelector);
	}
}

/*var selector = {
			title: "//ol[@id='searchResults']/li//h2//span/text()",
			price: "//ol[@id='searchResults']/li//span[@class='price-fraction']/text()",
			url:   "//ol[@id='searchResults']/li//a/@href",
			img:   "//ol[@id='searchResults']/li//div[@class='images-viewer']//img"
		};*/
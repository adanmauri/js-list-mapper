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
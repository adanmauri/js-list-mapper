class AutoCosmosJsObjectLists extends JsObjectLists {
	constructor(url){
		
		var url = url || "https://www.autocosmos.com.ar/search?q=" ;
		var elementSelector = {
			title: "//div[contains(@class, 'version')]//a[contains(@data-profile, 'clasificados')]/@title",
			url: "//div[contains(@class, 'version')]//a[contains(@data-profile, 'clasificados')]/@href",
			img: "//div[contains(@class, 'version')]//a[contains(@data-profile, 'clasificados')]//img/@data-defer-src",
			price: "//div[contains(@class, 'version')]//a[contains(@data-profile, 'clasificados')]//span[@class='precio']/strong/text()"
		};
		
		super(url, elementSelector);		
	}
}


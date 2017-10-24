class IMDbJsListMapper extends JsListMapper {

	/* Constructor
	 * -----------
	 * Params:
	 * - url: String (optional)
	 * 
	 * Return: an JsListMapper object
	 */
	constructor(url){
		
		var url = url || "http://www.imdb.com/find?s=tt&ref_=fn_al_tt_mr&q=" ;
		var elementSelector = {
			title: "//table[@class='findList']//tr/td[@class='result_text']/a/text()",
			url: "//table[@class='findList']//tr/td[@class='primary_photo']/a/@href",
			img: "//table[@class='findList']//tr/td[@class='primary_photo']/a/img/@src",
			info: "//table[@class='findList']//tr/td[@class='result_text']"
		};
		
		super(url, elementSelector);		
	}
}


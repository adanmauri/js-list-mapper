class YoutubeJsLists extends JsLists {
	constructor(url){
		var url = url || "http://www.youtube.com" ;
		var selector = {
			title: "//ol[@class='item-section']/li//h3/a/text()"
		};
		var paginatorSelector = "//a[@data-link-type='next']/@href";
		var searchSelector = "//input[@id='masthead-search-term']";
		super(url, selector, paginatorSelector, searchSelector);
	}
}




/*
Classic YouTube
 - title:       "//ol[@class='item-section']/li//h3/a/text()"
 - channelName: "//ol[@class='item-section']/li//div[@class='yt-lockup-content']//div[contains(@class, 'yt-lockup-byline')]/a/text()"
 - channelUrl:  "//ol[@class='item-section']/li//div[@class='yt-lockup-content']//div[contains(@class, 'yt-lockup-byline')]/a/@href"
 - url:         "//ol[@class='item-section']/li//h3/a/@href"
 - thumb:       "//ol[@class='item-section']/li//span[@class='yt-thumb-simple']/img/@src"
 - duration:    "//ol[@class='item-section']/li//span[@class='yt-thumb-simple']/span[@class='video-time']"
*/
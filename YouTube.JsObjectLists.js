class YouTubeJsObjectLists extends JsObjectLists {
	constructor(url){
		
		console.log("%cYou need to activate the old YouTube view before you can use this feature.", 'color: yellow; font-weight: bold;');
		console.log("%cRun the follow script in the browser console with YouTube open in order to do that:", 'color: yellow; font-weight: bold;');
		console.log("%cdocument.cookie=\"PREF='f1=50000000&f6=8&f5=30';;path=/;domain=.youtube.com;expires=Thu, 2 Aug 2020 20:47:11 UTC\";", 'color: yellow;');
				
		var url = url || "https://www.youtube.com/results?search_query=" ;
		var elementSelector = {
			title: "//ol[@class='item-section']/li//h3/a/text()",
			url: "//ol[@class='item-section']/li//h3/a/@href",
			img: "//ol[@class='item-section']/li//span[@class='yt-thumb-simple']/img",
			counter$: "//ol[@class='item-section']/li//div[@class='sidebar']//span[@class='formatted-video-count-label']/b/text() | //ol[@class='item-section']/li//span[@class='yt-thumb-simple']/span[@class='video-time']/text() | //ol[@class='item-section']/li//span[contains(@class,'yt-subscriber-count')]/@title"
		};
		
		var paginatorSelector = "//div[contains(@class,'search-pager')]/a[last()]/@href";
		super(url, elementSelector, paginatorSelector);		
	}
}


String.prototype.union = function(anotherStr) {
	tmpStr = this;
	tmpAnotherStr = anotherStr;

	if (tmpStr.length < tmpAnotherStr.length) {
		tmpAnotherStr = tmpAnotherStr.substring(0,tmpStr.length);
	} else if (tmpAnotherStr.length < tmpStr.length) {
		tmpStr = tmpStr.substring(tmpStr.length-tmpAnotherStr.length, tmpStr.length);
	}

	do {
		if (tmpStr.includes(tmpAnotherStr)) {
			break;
		}
		tmpStr = tmpStr.substring(1,tmpStr.length);
		tmpAnotherStr = tmpAnotherStr.substring(0,tmpAnotherStr.length-1);
	} while (tmpStr.length > 0 & tmpAnotherStr.length > 0);
	str = this + anotherStr.substring(tmpAnotherStr.length,anotherStr.length);
	return str;
}

function getParams() {
	params = window.location.search.substring(1,window.location.search.length);
	params = params.split('&');
	result = {};
	for (i=0; i < params.length; i++) {
		aux = params[i].split('=');
		if (aux[0].length > 0) {
			result[aux[0]] = (aux.length > 1)?aux[1]:null;
		}
	}
	return result;
}

/*
String.prototype.complement = function(anotherStr) {
	tmpStr = this;
	tmpAnotherStr = anotherStr;

	if (tmpStr.length < tmpAnotherStr.length) {
		tmpAnotherStr = tmpAnotherStr.substring(0,tmpStr.length);
	} else if (tmpAnotherStr.length < tmpStr.length) {
		tmpStr = tmpStr.substring(tmpStr.length-tmpAnotherStr.length, tmpStr.length);
	}

	do {
		if (tmpStr.includes(tmpAnotherStr)) {
			break;
		}
		tmpStr = tmpStr.substring(1,tmpStr.length);
		tmpAnotherStr = tmpAnotherStr.substring(0,tmpAnotherStr.length-1);
	} while (tmpStr.length > 0 & tmpAnotherStr.length > 0);
	
	console.log(anotherStr.length+" "+anotherStr);
	console.log(tmpAnotherStr.length+" "+tmpAnotherStr);
	console.log(anotherStr.length-tmpAnotherStr.length);
	console.log(this.length+" "+this);
	
	
	return this.substring(0, anotherStr.length-tmpAnotherStr.length);
}*/

// window.prompt("Copy to clipboard: Ctrl+C, Enter", this.context.body.outerHTML);
// DOCUMENTAR ELEMENTOS OPCIONALES
// DOCUMENTAR QUERIES


/* =======================
 * Js Object Lists
 * =======================
 */
class JsObjectLists {

	constructor(url, elementSelector, paginatorSelector, searchSelector){
		this.url 			   = url;
		this.elementSelector   = elementSelector;
		this.paginatorSelector = paginatorSelector;
		this.searchSelector    = searchSelector;
	}

	async search(search){
		var selector = new ElementSelector(this.elementSelector);
		var collection = new ElementCollection(selector);
		var paginator;
		var params;

		if (this.paginatorSelector) {
			paginator = new ElementPaginator(this.paginatorSelector, this.url);
			params = {elementSelector: selector, elementPaginator: paginator};
		} else {
			params = {elementSelector: selector};
		}

		var es = new ElementSearch(search, this.url, params, this.searchSelector);
		var r = await es.search();
		
		return r;
	}
}

/* =======================
 * ElementSelector Class
 * =======================
 */
class ElementSelector {
	
	/* Constructor
	 * -----------
	 * Params:
	 * - selector: Object (XPaths queries)
	 * - context: String (HTML document) (optional)
	 * - baseUrl: String (An url) (optional)
	 * Return: an ElementSelector Object
	 */
	constructor(selector, context, baseUrl) {
        this.selector = selector;
		this.attr = Object.keys(this.selector);
		this.context = context || document;
		this.baseUrl = baseUrl;
    }

	/* getSelector
     * -----------
     * Returns the object with the corresponding XPath queries
     * Return: an Object
     */
    getSelector() {
        return this.selector;
    }

    /* setSelector
     * -----------
     * Set a new Object with XPath queries
     * Params:
     * - selector: String Object (XPaths queries)
     * Return: an ElementSelector Object
     */
    setSelector(selector) {
        this.selector = selector;
        this.attr = Object.keys(this.selector);
        return this;
    }
    
    /* getContext
     * ----------
     * Returns the context
     * Return: a String (HTML document)
     */
    getContext() {
        return this.context;
    }

    /* setContext
     * ----------
     * Set the context
     * Params:
     * - context: a String (HTML document)
     * Return: an ElementSelector object
     */
    setContext(context) {
        this.context = context;
        return this;
    }

    /* getElements
     * -----------
     * Obtains and maps the items that meet the query and returns the objects
     * Params:
     * - context: HTML document (optional)
     * Return: an Array of Objects
     */
    getElements(context) {
        context = context || this.context;
        var i;
        var j;
        var e = [];
        var XPathRes = [];
        var response = [];

        for (i in this.attr) {
            try {
                XPathRes[this.attr[i]] = context.evaluate(this.selector[this.attr[i]], context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            } catch(err) {
                console.error("There is an error in the XPath query: "+this.selector[this.attr[i]]);
            }
        }

        for (i=0;i < XPathRes[this.attr[0]].snapshotLength;i+=1) {
            e = {};
            for (j in this.attr) {
                try {
                    e[this.attr[j]] = (XPathRes[this.attr[j]].snapshotItem(i).nodeValue)?XPathRes[this.attr[j]].snapshotItem(i).nodeValue:XPathRes[this.attr[j]].snapshotItem(i);
                }catch(err) {
					if (this.attr[j].includes("$")) {
						e[this.attr[j]] = null;
					} else {
						console.error("The XPath query is not getting valid elements (non-existent or null)");
					}
                }
            }
            response.push(e);
        }
        return response;
    }
}

/* =======================
 * ElementCollection Class
 * =======================
 */
class ElementCollection {
	
	/* Constructor
	 * -----------
	 * Params:
	 * - selector: ElementSelector object
	 * - context: String (HTML document) (optional)
	 * - paginator: ElementPaginator (optional)
	 * Return: an ElementCollection object
	 */
	constructor(selector, context, paginator) {
		this.selector = selector;
		this.context = context || document;
		this.paginator = paginator;
		this.nextCollection;
		this.index = 0;
		this.items = selector.getElements(this.context);
    }
	
    /* getElements
     * -----------
     * Returns the complete collection of objects
     * Return: an Array of Objects
     */
    getElements(){
        return this.items;
    }

    /* getElement
     * ----------
     * Return the object at position n
     * Params:
     * - n: integer
     * Return: an Object
     */
    getElement(n){
        return this.items[n];
    }

    /* length
     * ------
     * Returns the array length
     * Return: a Boolean
     */
    length() {
        return this.items.length;
    }

    /* first
     * -----
     * Returns the first element of the array
     * Return: an Object or undefinded
     */
    first() {
        this.reset();
        return this.next();
    }

    /* next
     * ----
     * Returns the next element of the array
     * Return: an Object or undefinded (null)
     */
    next() {
        return this.items[this.index++];
    }

    /* hasNext
     * -------
     * Returns if there is a next element
     * Return: a Boolean
     */
    hasNext() {
        return this.index <= this.items.length;
    }

    /* reset
     * -----
     * Reset index
     */
    reset() {
        this.index = 0;
    }

    /* each
     * ----
     * A generic iterator function over the objects
     * Params:
     * - callback: a Function
     */
    each(callback) {
        var item;
        for (item = this.first();this.hasNext();item = this.next()) {
            callback(item);
        }
    }

    /* nextPage
     * --------
     * If the paginator was defined, the elements of the next page is obtained
     * Return: an ElementCollection
     */
    async nextPage() {
        if (!this.paginator) {
            return;
        }
        if (!this.nextCollection) {
            this.nextCollection = await this.paginator.getNext(this.selector, this.context);
        }
        return this.nextCollection;
    }

    /* pageNumber
     * ----------
     * Returns the current page number
     * Return: an Integer
     */
    pageNumber() {
        if (!this.paginator) {
            return 1;
        }
        return this.paginator.pageNumber;
    }
}
	
/* =======================
 * ElementPaginator Class
 * =======================
 */
 class ElementPaginator {
	 
	/* Constructor
	 * -----------
	 * Params:
	 * - selector: String (XPath query)
	 * - baseUrl: String (optional)
	 * - pageNumber: Integer (optional)
	 * Return: an ElementPaginator object
	 */
	constructor(selector, baseUrl, pageNumber) {
		this.selector = selector;
		this.pageNumber = pageNumber || 1;
		this.baseUrl = baseUrl;
    }

    /* getBaseUrl
     * ----------
     * Returns the base url
     * Return: a String
     */
    getBaseUrl() {
        return this.baseUrl;
    }

    /* setBaseUrl
     * ----------
     * Set the base url
     * Params:
     * - url: String
     * Return: an ElementPaginator object
     */
    setBaseUrl(url) {
        this.baseUrl = url;
        return this;
    }

    /* getUrl
     * ------
     * Returns the url
     * Return: a String
     */
    getUrl() {
        return this.url;
    }

    /* loadUrl
     * --------
     * Obtains and return the url
     * Params:
     * - context: String (HTML document) (optional)
     * Return: a String
     */
    loadUrl(context) {
        context = context || document;
        var xpathResult;

        try {
            xpathResult = context.evaluate(this.selector, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }catch(err) {
            console.error("There is an error in the XPath query: "+this.selector);
        }
        
        try {
			var eu;
			eu = new ElementUtilities();
            this.url = eu.getUrl((xpathResult.snapshotItem(0).nodeValue)?xpathResult.snapshotItem(0).nodeValue:xpathResult.snapshotItem(0), this.baseUrl);
        }catch(err) {
            console.error("The XPath query is not getting valid element (non-existent or null)");
        }

        return this.url;
    }

    /* getNext
     * -------
     * Returns the elements of the next page
     * Params:
     * - selector: a String (XPath query)
     * - context: a String (HTML document) (optional)
     * Return: an ElementCollection object
     */
    async getNext(selector, context) {
        var url = this.loadUrl(context);
        return new ElementCollection(selector, await this.loadNext(url), new ElementPaginator(this.selector, this.baseUrl, this.pageNumber+1));
    }

    /* loadNext
     * --------
     * Obtains and return the HTML document of the next page
     * Params:
     * - url: String (optional)
     *  Return: a HTML document
     */
    async loadNext(url) {
        url = url || this.url;
        var eu = new ElementUtilities;
        return await eu.htmlRequest(url)
    }

}

/* =======================
 * ElementUtilities Class
 * =======================
 */
class ElementUtilities {
	
	/* request
	 * -------
	 * TODO
	 * Return: todo
	 */
	async request(url, method='GET') {
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        
        //document.cookie="PREF='f1=50000000&f6=8&f5=30';;path=/;domain=.youtube.com;expires=Thu, 2 Aug 2020 20:47:11 UTC";
        
        var headers = new Headers();
        var params = {
				method: 'GET',
				headers: headers,
				mode: 'cors',
				cache: 'default',
				method: method,
				credentials: 'include'
        };

        try {
			return await fetch(url, params);
        } catch(err) {
			console.error("The next page could not be loaded");
            console.log("URL: " + url);
            console.log(err);
			return null;
		}	
	}

	/* request
	 * -------
	 * TODO
	 * Return: todo
	 */
	async htmlRequest(url, method='GET') {
        var response = await (await this.request(url, method)).text();
		if (response) {
            var parser = new DOMParser();
			response = parser.parseFromString(response, "text/html");
		}

		return response;
	}
	
	/* isAbsolutePath
	 * -------
	 * Returns if a path is absolutebsolute
	 * Return: a Boolean
	 */
	isAbsolutePath(route) {
		return (route.lastIndexOf("http://") == 0) || (route.lastIndexOf("https://") == 0) || (route.lastIndexOf("//") == 0);
	}

	/* getBaseUrl (TIENE SENTIDO?)
	 * ----------
	 * Returns the base url of a route
	 * Params:
	 * - route: String
	 * - url: String (optional)
	 * Return: a String
	 *
	 */
	getBaseUrl(route, url) {
		if (url) {
			return url.union(route);
		}else {
			return route;
		}
	}

	/* getUrl
	 * ------
	 * Returns the url
	 * Params:
	 * - route: String
	 * - url: String (optional)
	 * Return: a String
	 *
	 */
	getUrl(route, url) {
		url = url || '';
		return url.union(route);
	}
	
    /* Fix Protocol. 
     * -------------
     * fetch no work with // (File protocol)
     * Params:
     * - url: String (URL)
     * - sendUrl: String (URL)
     * Return: a String (URL) with original protocol
     */
    fixUrlProtocol(url, sendUrl) {
        var urlObject = new URL(url);

        if (sendUrl.startsWith("//")){
            return (sendUrl.indexOf('://') === -1) ? urlObject.protocol + sendUrl : sendUrl;
        }else{
            return sendUrl;
        }        
    }
}
/* =======================
 * ElementSearch Class
 * =======================
 */
 class ElementSearch {
	 
	/* Constructor
	 * -----------
	 * Params:
	 * - value: String
	 * - url: String
	 * - params: Object
	 * - selector: String (XPath query) (optional)
	 * Return: an ElementSelector Object
	 */
	constructor(value, url, params, selector) {
		this.value = value;
		this.url = url;
		this.selector = selector;

		this.elementSelector = (params.elementSelector)?params.elementSelector:new ElementSelector(params.selector);
		
		this.elementPaginator = (params.elementPaginator)?params.elementPaginator:(params.paginator)?new ElementPaginator(params.paginator, url):null;
		if (this.elementPaginator && !this.elementPaginator.getBaseUrl()) {
			this.elementPaginator.setBaseUrl(url);
		}

		this.context;
		this.input;
		this.form;
        return this;
    }

    /* setContext
     * ----------
     * Set a context
     * Params:
     * - context: String (HTML Document)
     * Return: an ElementSearch Object
     */
    setContext(context) {
		this.context = context;
		return this;
	}
		
	/* getContext
	 * ----------
	 * Returns a context
	 * Return: a String (HTML document)
	 */
	getContext() {
		return this.context;
    }
    
    /* setInputValue
     * -------------
     * Sets the value to search
     * Params:
     * - value: String
     * Return: an ElementSearch Object
     */
    setInputValue(value) {
		this.input.setAttribute("value", value);
		return this;
    }
    
    /* getInputValue
     * -------------
     * Returns the value to search
     * Return: a String
     */
    getInputValue() {
		return this.input.getAttribute("value");
    }

    /* setFormMethod
     * -------------
     * Sets the method of the form
     * Params:
     * - value: String
     * Return: an ElementSearch Object
     */
    setFormMethod(value) {
		this.form.setAttribute("method",value);
		return this;
    }
    
    /* getFormMethod
     * -------------
     * Returns the method of the form
     * Return: a String
     */
    getFormMethod() {
		return this.form.getAttribute("method") || "GET";
    }
    
    /* setFormAction
     * -------------
     * Sets the action of the form
     * Params:
     * - value: String
     * Return: an ElementSearch Object
     */
    setFormAction(value) {
		this.form.setAttribute("action",value);
		return this;
    }

    /* getFormAction
     * -------------
     * Returns the action of the form
     * Return: a String
     */
    getFormAction() {
		return this.form.getAttribute("action");
    }
    
    /* loadContext
     * -----------
     * Obtains and return the context
     * Return: a String (HTML document)
     */
    async loadContext() {
        var eu = new ElementUtilities;
		var ctx = await eu.htmlRequest(this.url);
        return ctx;
    }
    
    /* evaluateSelector
     * ----------------
     * Obtains the input and the form
     * Return: a Boolean
     */
    evaluateSelector(){  
		if (this.context) {
			var xPathRes = this.context.evaluate(this.selector, this.context, null, 7, null);						
			this.input = (xPathRes.snapshotLength)?xPathRes.snapshotItem(0):null;
			xPathRes = this.context.evaluate(this.selector+"/ancestor::form", this.context, null, 7, null);
			this.form = (xPathRes.snapshotLength)?xPathRes.snapshotItem(0):null;
		}
		return (this.input && this.form);
    }
    
    /* searchRequest
     * -------------
     * Permorms search
     * Return: an ElementCollection
     */
    async searchRequest() {
		var response;
		var httpRequest = new XMLHttpRequest();
		var ec;
		var es;
		var sendUrl;
		var sendPost;
		var method = "GET";
		var eu = new ElementUtilities();
		if (this.selector) {
			method = this.getFormMethod();
			sendUrl = eu.getUrl(this.getFormAction(), this.url);
			sendUrl+=(this.getFormMethod() == "GET")?"?"+this.serialize(this.form):"";
            sendUrl = eu.fixUrlProtocol(this.url, sendUrl);
            
			sendPost = (this.getFormMethod() == "POST")?this.serialize(this.form):null;
            if (sendPost){
                sendPost = eu.fixUrlProtocol(this.url, sendPost);
            }

		} else {
			sendUrl = this.url+this.value;
			sendPost = null;
		}

		var response = await eu.htmlRequest(sendUrl, method);			
		var ec = new ElementCollection(this.elementSelector, response, this.elementPaginator);
		
		this.setContext(response);

		return ec;
    }

    /* search
     * -------------
     * Returns the action of the form
     * Return: a String
     */    
    async search() {
		if (this.selector) {
			this.setContext(await this.loadContext());
			this.evaluateSelector();
			this.setInputValue(this.value);
		}
		return this.searchRequest();
    }

    serialize(form) {
		form = form || this.form;
		
		if (!form || form.nodeName !== "FORM") {
			return false;
		}
		
		var i, j, q = [];
		for (i = form.elements.length - 1;i >= 0;i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
						case 'checkbox':
						case 'radio':
							if (form.elements[i].checked) {
								q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
							}                             
							break;
						case 'file':
							break;
						default:
							q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
							break;
					}
					break;
				case 'TEXTAREA':
					q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
					break;
				case 'SELECT':
					switch (form.elements[i].type) {
						case 'select-one':
							q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
							break;
						case 'select-multiple':
							for (j = form.elements[i].options.length - 1;j >= 0;j = j - 1) {
								if (form.elements[i].options[j].selected) {
									q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
								}
							}
							break;
					}
					break;
			}
        }
        return q.join("&");
    }
}

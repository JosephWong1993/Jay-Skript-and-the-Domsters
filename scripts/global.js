function focusLabels() {
	if(!document.getElementsByTagName) return false;
	var labels = document.getElementsByTagName('label');
	for(var i = 0; i < labels.length; i++) {
		if(!labels[i].getAttribute('for')) continue;
		labels[i].onclick = function() {
			var id = this.getAttribute('for');
			var element = document.getElementById(id);
			if(element) {
				element.focus();
			}
		}
	}
}

function resetFields(whichform) {
	if(Modernizr.input.placeholder) return;
	for(var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i];
		if(element.type != 'submit') {
			var check = element.placeholder || element.getAttribute('placeholder');
			if(check) {
				element.onfocus = function() {
					var text = this.placeholder || this.getAttribute('placeholder');
					if(this.value == text) {
						this.className = '';
						this.value = '';
					}
				}
				element.onblur = function() {
					if(this.value == '') {
						this.className = 'placeholder';
						this.value = this.placeholder || this.getAttribute('placeholder');
					}
				}
				element.onblur();
			}
		}
	}
}

function isFilled(field) {
	if(field.value.replace(' ', '').length == 0) return false;
	var placeholder = field.placeholder || field.getAttribute('placeholder');
	return(field.value != placeholder);
}

function isEmail(field) {
	return(field.value.indexOf('@') != -1) && (field.value.indexOf('.') != -1)
}

function validateForm(whichform) {
	for(var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i];
		if(element.required == 'required') {
			if(!isFilled(element)) {
				alert('Please fill in the ' + element.name + 'field.');
				return false;
			}
		}
		if(element.type == 'email') {
			if(!isEmail(element)) {
				alert('The ' + element.name + 'field must be a valid email address.');
				return false;
			}
		}
	}
	return true;
}

function displayAjaxLoading(element) {
	while(element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
	var content = document.createElement('img');
	content.setAttribute('src', 'images/loading.gif');
	content.setAttribute('alt', 'Loading...');
	element.appendChild(content);
}

function submitFormWithAjax(whichform, thetarget) {
	var request = getHTTPObject();
	if(!request) return false;
	displayAjaxLoading(thetarget);
	var dataParts = [];
	var element;
	for(var i = 0; i < whichform.elements.length; i++) {
		element = whichform.elements[i];
		dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
	}
	var data = dataParts.join('&');
	request.open('POST', whichform.getAttribute('action'), true);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status == 200 || request.status == 0) {
				var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
				if(matches.length > 0) {
					thetarget.innerHTML = matches[1];
				} else {
					thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
				}
			} else {
				thetarget.innerHTML = '<p>' + request.statusText + '</p>';
			}
		}
	}
	request.send(data);
	return true;
}

function prepareForms() {
	for(var i = 0; i < document.forms.length; i++) {
		var thisform = document.forms[i];
		resetFields(thisform);
		thisform.onsubmit = function() {
			if(!validateForm(this)) return false;
			var article = document.getElementsByTagName('article')[0];
			if(submitFormWithAjax(this, article)) return false;
			return true;
		}
	}
}

addLoadEvent(focusLabels);
addLoadEvent(prepareForms);

function stripeTables() {
	if(!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName('table');
	for(var i = 0; i < tables.length; i++) {
		var odd = false;
		var rows = tables[i].getElementsByTagName('tr');
		for(var j = 0; j < rows.length; j++) {
			if(odd == true) {
				addClass(rows[j], 'odd');
				odd = false;
			} else {
				odd = true;
			}
		}
	}
}

function highlighRows() {
	if(!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName('tr');
	for(var i = 0; i < rows.length; i++) {
		rows[i].oldClassName = rows[i].className;
		rows[i].onmouseover = function() {
			addClass(this, 'highlight');
		};
		rows[i].onmouseout = function() {
			this.classname = this.oldClassName;
		}
	}
}

function displayAbbreviations() {
	if(!document.getElementsByTagName) return false;
	if(!document.createElement) return false;
	if(!document.createTextNode) return false;
	var abbrecviations = document.getElementsByTagName('abbr');
	if(abbrecviations.length < 1) return false;
	var defs = new Array();
	for(var i = 0; i < abbrecviations.length; i++) {
		var current_abbr = abbrecviations[i];
		if(current_abbr.childNodes.length < 1) continue;
		var definition = current_abbr.getAttribute('title');
		var key = current_abbr.lastChild.nodeValue;
		defs[key] = definition;
	}

	var dlist = document.createElement('dl');
	for(key in defs) {
		var definition = defs[key];
		var dtitle = document.createElement('dt');
		var dtitle_text = document.createTextNode(key);
		dtitle.appendChild(dtitle_text);
		var ddesc = document.createElement('dd');
		var ddesc_text = document.createTextNode(definition);
		ddesc.appendChild(ddesc_text);
		dlist.appendChild(dtitle);
		dlist.appendChild(ddesc);
	}
	if(dlist.childNodes.length < 1) return false;
	var header = document.createElement('h3');
	var heeader_text = document.createTextNode('Abbreviations');
	header.appendChild(heeader_text);
	var articles = document.getElementsByTagName('article');
	if(articles.length == 0) return false;
	var container = articles[0];
	container.appendChild(header);
	container.appendChild(dlist);
}

addLoadEvent(stripeTables);
addLoadEvent(highlighRows);
addLoadEvent(displayAbbreviations);

function showPic(whichPic) {
	if(!document.getElementById('placeholder')) return false;
	var source = whichPic.getAttribute('href');
	var placeholder = document.getElementById('placeholder');
	placeholder.setAttribute('src', source);

	if(!document.getElementById('description')) return false;
	if(whichPic.getAttribute('title')) {
		var text = whichPic.getAttribute('title');
	} else {
		var text = '';
	}
	var description = document.getElementById('description');
	if(description.firstChild.nodeType == 3) {
		description.firstChild.nodeValue = text;
	}
	return false;
}

function preparePlaceholder() {
	if(!document.createElement) return false;
	if(!document.createTextNode) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById('imagegallery')) return false;

	var placeholder = document.createElement('img');
	placeholder.setAttribute('id', 'placeholder');
	placeholder.setAttribute('src', 'images/placeholder.gif');
	placeholder.setAttribute('alt', 'my image gallery');

	var description = document.createElement('p');
	description.setAttribute('id', 'description');
	var desctext = document.createTextNode('Choose an image');
	description.appendChild(desctext);
	var gallery = document.getElementById('imagegallery');
	insertAfter(description, gallery);
	insertAfter(placeholder, description);
}

function prepareGallery() {
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById('imagegallery')) return false;
	var gallery = document.getElementById('imagegallery');
	var links = gallery.getElementsByTagName('a');
	for(var i = 0; i < links.length; i++) {
		links[i].onclick = function() {
			return showPic(this);
		};
	}
}

addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);

function showSection(id) {
	var sections = document.getElementsByTagName('section');
	for(var i = 0; i < sections.length; i++) {
		if(sections[i].getAttribute('id') != id) {
			sections[i].style.display = 'none';
		} else {
			sections[i].style.display = 'block';
		}
	}
}

function prepareInternalnav() {
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	var articles = document.getElementsByTagName('article');
	if(articles.length == 0) return false;
	var navs = articles[0].getElementsByTagName('nav');
	if(navs.length == 0) return false;
	var nav = navs[0];
	var links = nav.getElementsByTagName('a');
	for(var i = 0; i < links.length; i++) {
		var sectionId = links[i].getAttribute('href').split('#')[1];
		if(!document.getElementById(sectionId)) return false;
		links[i].destination = sectionId;
		links[i].onclick = function() {
			showSection(this.destination);
			return false;
		};
	}
}

addLoadEvent(prepareInternalnav);

function highlightPage() {
	if(!document.getElementsByTagName ||
		!document.getElementById) return false;

	var headers = document.getElementsByTagName('header');
	if(headers.length == 0) return false;
	var navs = headers[0].getElementsByTagName('nav');
	if(navs.length == 0) return false;
	var links = navs[0].getElementsByTagName('a');
	var linkurl;
	for(var i = 0; i < links.length; i++) {
		linkurl = links[i].getAttribute('href');
		if(window.location.href.indexOf(linkurl) != -1) {
			links[i].className = 'here';
			var linkText = links[i].lastChild.nodeValue.toLowerCase();
			document.body.setAttribute('id', linkText);
		}
	}
}

function prepareSlideshow() {
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById('intro')) return false;
	var intro = document.getElementById('intro');

	var slideshow = document.createElement('div');
	slideshow.setAttribute('id', 'slideshow');
	var preview = document.createElement('img');
	preview.setAttribute('src', 'images/slideshow.gif');
	preview.setAttribute('alt', 'a glimpse of what awaits you');
	preview.setAttribute('id', 'preview');
	slideshow.appendChild(preview);

	var frame = document.createElement('img');
	frame.setAttribute('src', 'images/frame.gif');
	frame.setAttribute('alt', '');
	frame.setAttribute('id', 'frame');
	slideshow.appendChild(frame);

	insertAfter(slideshow, intro);

	//	var links = intro.getElementsByTagName('a');
	var links = document.getElementsByTagName('a');
	var destination;
	for(var i = 0; i < links.length; i++) {
		links[i].onmouseover = function() {
			destination = this.getAttribute('href');
			if(destination.indexOf('index.html') != -1) {
				moveElement('preview', 0, 0, 5);
			} else if(destination.indexOf('about.html') != -1) {
				moveElement('preview', -150, 0, 5);
			} else if(destination.indexOf('photos.html') != -1) {
				moveElement('preview', -300, 0, 5);
			} else if(destination.indexOf('live.html') != -1) {
				moveElement('preview', -450, 0, 5);
			} else if(destination.indexOf('contact.html') != -1) {
				moveElement('preview', -600, 0, 5);
			}
		};
	}
}

addLoadEvent(highlightPage);
addLoadEvent(prepareSlideshow);

function addLoadEvent(func) {
	var oldonload = window.onload;
	if(typeof window.onload == 'function') {
		window.onload = function() {
			oldonload();
			func();
		};
	} else {
		window.onload = func;
	}
}

function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if(targetElement == parent.lastChild) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

function addClass(element, value) {
	if(!element.className) {
		element.className = value;
	} else {
		var newClassName = element.className;
		newClassName += ' ';
		newClassName += value;
		element.className = newClassName;
	}
}

function moveElement(elementID, final_x, final_y, interval) {
	if(!document.getElementById) return false;
	if(!document.getElementById(elementID)) return false;

	var elem = document.getElementById(elementID);
	if(elem.movement) {
		clearTimeout(elem.movement);
	}

	if(!elem.style.left) {
		elem.style.left = '0px';
	}
	if(!elem.style.top) {
		elem.style.top = '0px';
	}
	var xPos = parseInt(elem.style.left);
	var yPos = parseInt(elem.style.top);
	if(xPos == final_x && yPos == final_y) {
		return true;
	}
	if(xPos < final_x) {
		var dist = Math.ceil((final_y - xPos) / 10);
		xPos = xPos + dist;
	} else if(xPos > final_x) {
		var dist = Math.ceil((xPos - final_x) / 10);
		xPos = xPos - dist;
	}

	if(yPos < final_y) {
		var dist = Math.ceil((final_y - yPos) / 10);
		yPos = yPos + dist;
	} else if(xPos > final_y) {
		var dist = Math.ceil((yPos - final_y) / 10);
		yPos = yPos - dist;
	}

	elem.style.left = xPos + 'px';
	elem.style.top = yPos + 'px';

	var repeat = 'moveElement(\'' + elementID + '\',' +
		final_x + ',' +
		final_y + ',' +
		interval + ')';
	elem.movement = setTimeout(repeat, interval);
}

//	获取Ajax对象
function getHTTPObject() {
	if(typeof XMLHttpRequest == 'undefined') {
		XMLHttpRequest = function() {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP.6.0');
			} catch(e) {}
			try {
				return new ActiveXObject('Msxml2.XMLHTTP.3.0');
			} catch(e) {}
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch(e) {}
			return false;
		}
	}
	return new XMLHttpRequest();
}
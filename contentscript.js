var apiKey = 'wdu59wgshvwmbctqhepvrtnp';
var mapAndAttrs = document.getElementsByClassName('mapAndAttrs')[0];
var title = getElementByXpath('//*[@id="pagecontainer"]/section/section/div[1]/p[1]/span/b');
var desc = title.textContent.split(' ');
var make = getMake(desc[1].toLowerCase()),
	model = getModel(desc[2].toLowerCase()),
	year = desc[0],
	style,
	odometer = getElementByXpath('//*[@id="pagecontainer"]/section/section/div[1]/p[2]/span[5]/b').textContent;

function getStyleId() {
	var url = 'https://api.edmunds.com/api/vehicle/v2/' + make + '/' + model + '/' + year + '/styles?fmt=json&api_key=' + apiKey;
	GET(url, function(res) {
		res.styles.forEach(function(s) {
			var el = document.createElement('div');
			el.className += ' mtd-choices-choice';
			el.innerHTML = '<h4 class="mtd-choices-choice-heading">' + s.name + '</h4>';
			el.onclick = function(choice) {
				getTMV(this.dataset.id);
				showSummary();
			};
			el.dataset.id = s.id;
			choices.appendChild(el);
		});
	});
}

function getTMV(styleId) {
	if (!odometer)
		odometer = year * 12000;
	var url = 'https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid=' + styleId + '&condition=Clean&mileage=' + odometer + '&zip=50014&fmt=json&api_key=' + apiKey;
	GET(url, function(res) {
		while (summary.lastChild) {
		    summary.removeChild(summary.lastChild);
		}
		var totalWithOptions = document.createElement('div');
		totalWithOptions.className += ' mtd-summary-two';
		var usedPrivateParty = document.createElement('dl');
		usedPrivateParty.innerHTML = '<dt>Total With Options</dt><dd>$' + res.tmv.totalWithOptions.usedPrivateParty + '</dd>';
		totalWithOptions.appendChild(usedPrivateParty);
		var nationalBasePrice = document.createElement('dl');
		nationalBasePrice.innerHTML = '<dt>National Base Price</dt><dd>$' + res.tmv.nationalBasePrice.usedPrivateParty + '</dd>';
		totalWithOptions.appendChild(nationalBasePrice);
		summary.appendChild(totalWithOptions);
	});
}

function GET(url, callback) {
	var x = new XMLHttpRequest();
	x.open('GET', url);
	x.responseType = 'json';
	x.onload = function() {
		callback(x.response);
	};
	x.send();
}

var container, choices, summary, navbar;
function createContainer() {
	container = document.createElement('div');
	container.className += ' mtd-container';
	navbar = document.createElement('nav');
	navbar.innerHTML = '<ul class="pull-left"><li><button type="button" class="back"><</button></li></ul><ul class="pull-right"><li><button type="button" class="close">&times;</button></li></ul>';
	navbar.className = 'mtd-navbar clearfix';
	navbar.getElementsByClassName('back')[0].onclick = function() {
		showChoices();
	}
	navbar.getElementsByClassName('close')[0].onclick = function() {
		close();
	}
	container.innerHTML = '<button type="button" class="open">$</button>';
	container.getElementsByClassName('open')[0].onclick = function() {
		open();
	}
	container.appendChild(navbar);
	document.body.appendChild(container);
	hide(navbar.getElementsByClassName('back')[0]);
}

function createChoices() {
	choices = document.createElement('div');
	choices.className += ' mtd-choices';
	container.appendChild(choices);
}

function createSummary() {
	summary = document.createElement('div');
	hide(summary);
	summary.className += ' mtd-summary';
	container.appendChild(summary);
}

function show(el) {
	el.style.display = 'block';
}

function hide(el) {
	el.style.display = 'none';
}

function showChoices() {
	hide(navbar.getElementsByClassName('back')[0]);
	hide(summary);
	show(choices);
}

function showSummary() {
	hide(choices);
	show(navbar.getElementsByClassName('back')[0]);
	show(summary);
}

function close() {
	container.className += ' close';
}

function open() {
	container.className = container.className.replace('close', '');
}

function getMake(make) {
	if (make == 'chevy') {
		return 'chevrolet';
	}
}

function getModel(model) {
	if (model == 'silverado') {
		return 'silverado 1500';
	}
}

function init() {
	createContainer();
	createChoices();
	createSummary();
	getStyleId();
}

init();

// http://stackoverflow.com/a/14284815/2824391
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

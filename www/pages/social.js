{
	"title": "Social (Twitter)",
	"content": [{
		"class": ["ui back"],
		"elements": [{
			"type": "link",
			"icon": "back",
			"content": "Previous Page",
			"page": "home"
		}]
	},{
		"class": ["ui body"],
		"elements": [{
			"type": "image",
			"class": ["ui", "left", "margin-horizontal"],
			"source": "img/header/twitter.png",
			"page": "social"
		},{
			"type": "image",
			"class": ["ui", "left", "margin-horizontal"],
			"source": "img/header/facebook.png",
			"page": "social-fb"
		},{
			"type": "html",
			"content": "<h1>Social Feed</h1><span class='small'>Access NYO Facebook and Twitter feeds by clicking on the icons.</span>"
		},{
			"type": "divider"
		},{
			"type": "feed",
			"source": "http://www.api.twitter.com/citcnyo/status/user_timeline/user_timeline.json"
		}]
	}]
}
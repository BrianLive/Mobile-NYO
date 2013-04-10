{
	"title": "Event",
	"content": [{
		"class": ["ui back"],
		"elements": [{
			"type": "link",
			"icon": "back",
			"content": "Previous Page",
			"page": "events"
		}]
	},{
		"class": ["ui", "body", "body-event"],
		"elements": [{
			"type": "text",
			"content": "<span style='font-size: 1.2em; font-weight: bold;'>{event-name}</span>"
		},{
			"type": "text",
			"content": "{event-description}"
		},{
			"type": "text",
			"content": "<b>Sponsored by</b> {event-sponsor}"
		}]
	}]
}
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('DOMContentLoaded deviceready', this.deviceready, false);
        document.addEventListener('backbutton', this.backbutton, false);
    },
    deviceready: function() {
        app.changePage('home');
    },
    backbutton: function() {
        if(app.page.current === 'home') navigator.app.exitApp();
        else app.changePage(app.page.previous);
    },
    report: function(id) {
        console.log("Report: " + id);
    },
    changePage: function(to) {
        $('#loading').show();
        app.page.previous = app.page.current;
        app.page.current = to;
        app.output.html('');

        if(to.indexOf("events/") !== -1) {
            $.getJSON('pages/event.js', function(data) {
                $.each(data.content, function(key, val) {
                    var buffer = '<div id=\'' + key + '\'';
                    if(key === 1) buffer += ' style="background-image: url(\'img/' + to + '.jpg\');"';
                    buffer += '>';
                    app.output.append(buffer);
                    if(val.elements) $.each(val.elements, function(index, element) {
                        app.generateElement(element.type, element, '#' + key);
                    });
                    app.output.append('</div>');
                    app.generateClasses($('#' + key), val.class);
                });

                var txt = app.output.html();
                $.getJSON('pages/' + to + '.js', function(eventInfo) {
                    $.each(eventInfo, function(key, val) {
                        switch(key) {
                            case 'name': txt = txt.replace('{event-name}', val); break;
                            case 'description': txt = txt.replace('{event-description}', val); break;
                            case 'sponsor': txt = txt.replace('{event-sponsor}', val); break;
                        }
                    });
                });
                app.output.html(txt);
            });
        } else {
            $.getJSON('pages/' + to + '.js', function(data) {
                $.each(data.content, function(key, val) {
                    var buffer = '<div id=\'' + key + '\'';
                    buffer += '>';
                    app.output.append(buffer);
                    if(val.elements) $.each(val.elements, function(index, element) {
                        app.generateElement(element.type, element, '#' + key);
                    });
                    app.output.append('</div>');
                    app.generateClasses($('#' + key), val.class);
                });
            });
        }

        $('#loading').hide();
    },
    generateLink: function(object, to) {
        object.on('click', function(e) {
            app.changePage(to)
        });
    },
    generateClasses: function(object, value) {
        if($.isArray(value)) {
            $.each(value, function(i, c) {
                object.addClass(c);
            });
        } else object.addClass(value);
    },
    generateElement: function(type, data, output) {
        var buffer = '';
        var ignore = false;
        var divider = false;

        output = $(output);

        switch(type) {
            case 'image':
                buffer += '<img alt=\'\'';
                if(data.source) buffer += ' src="' + data.source + '"';
                buffer += ' />';
            break;

            case 'button':
                buffer += '<div class=\'button\'>';
                if(data.content) buffer += data.content;
                buffer += '</div>';
            break;

            case 'link':
                buffer += '<div';
                if(data.icon) buffer += ' style="background: url(\'img/icon/' + data.icon + '.png\'); background-repeat: no-repeat; padding-left: 24px; background-position: left center; color: white;"';
                buffer += '>' + data.content + '</div>';
            break;

            case 'html':
                buffer += '<div>' + data.content + '</div>';
            break;

            case 'text':
                buffer += '<div';
                if(data.icon) buffer += ' style="background: url(\'img/icon/' + data.icon + '.png\'); background-repeat: no-repeat; padding-left: 24px; background-position: left center; color: white;"';
                buffer += '>' + data.content + '</div>';
            break;

            case 'divider':
                ignore = true;
                buffer = '<div class="divider"></div>';
            break;

            case 'event':
                divider = true;
                buffer += '<div';
                if(data.event) buffer += ' style="color: #CD282C;"';
                buffer += '><span class="notice left pin" style="font-weight: normal;">' + data.time + '</span><div class="left" style="margin-left: 80px;">' + data.content + '</div></div>';
            break;

            case 'feed':
                ignore = true;
                if(data.source.indexOf('twitter') != -1) {
                        $.ajax({
                            url: data.source,
                            type: 'GET',
                            dataType: 'jsonp'
                        }).success(function(data) {
                            $.each(data, function(key, val) {
                                var text = val.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                                var date = (new Date(val.created_at)).toLocaleDateString();
                                var time = (new Date(val.created_at)).toLocaleTimeString();
                                
                                text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
                                text = text.replace(/@(\w+)/, '<a href="http://twitter.com/$1">@$1</a>');
                                text = text.replace(/\s#(\w+)/, ' <a href="http://search.twitter.com/search?q=%23$1">#$1</a>');
                                
                                var b = '';
                                b += '<div class="listitem">';
                                b += '<h3>Posted on <span style="font-weight: bold;">' + date + '</span> at ' + time + '</h3>' + text;
                                b += '<div class="divider"></div>';
                                b += '</div>';
                                $(output).append(b);
                            });
                        });
                    } else if(data.source.indexOf('facebook') != -1) {
                        $.ajax({
                        url: data.source,
                        type: 'GET',
                        dataType: 'jsonp'
                    }).success(function(data) {
                        $.each(data.data, function(key, val) {
                            var b = '';
                            
                            b += '<div';
                            if(val.link) b += ' onclick="window.plugins.childBrowser.showWebPage(\'' + val.link + '\', {showLocationBar: false});"';
                            b += ' class="ui listitem">';
                            
                            var date = (new Date(val.created_time)).toLocaleDateString();
                            var time = (new Date(val.created_time)).toLocaleTimeString();
                            
                            b += '<h3>Posted on <span style="font-weight: bold;">' + date + '</span> at ' + time + '</h3>';
                            
                            if(val.picture) {
                                b += '<div style="max-width: 128px; text-align: center; margin-right: 12px;" class="ui left">';
                                b += '<img style="max-width: 128px;" src="' + val.picture + '" />';
                                b += '</div>';
                            }
                            
                            b += '<span class="small">';
                            if(val.message) b += val.message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>').replace("\n", "<br /><br />", "g");
                            if(val.caption) b += val.caption.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>').replace("\n", "<br /><br />", "g");
                            if(val.description) b += val.description.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>').replace("\n", "<br /><br />", "g");
                            b += '</span>';
                            
                            b += '<div class="divider"></div>';
                            
                            $(output).append(b);
                            $('.listitem > span:empty()').parent().remove();;
                        });
                    });
                    }
            break;

            case 'sponsor':
                divider = true;
                buffer += '<div ';
                if(data.href) buffer += ' onclick="window.plugins.childBrowser.showWebPage(\'' + data.href + '\', {showLocationBar: false})";';
                buffer += ' style="margin: 5px; text-align: center;">';
                if(data.href) buffer += '<div style="font-size: 0.9em; position: absolute; right: 16px;"><img style="position: relative; top: 0px;" src="img/icon/forward.png" alt="" /></div>';
                if(data.source) buffer += '<img style="max-height: 128px; max-width: 60%;" src="' + data.source + '" alt="" /><br />';
                if(data.content) buffer += '<h2>' + data.content + '</h2>';
                buffer += '</div>'
            break;

            case 'listitem':
                    divider = true;

                    link = '';
                    if(data.download) link = ' onclick="app.download(\'' + data.href + '\')"';
                    else if(data.href) link = ' onclick="window.plugins.childBrowser.showWebPage(\'' + data.href + '\', {showLocationBar: false})"';
                    
                    buffer += '<div class="listitem"' + link + '>';
                    if(data.page || data.href) buffer += '<div style="font-size: 0.9em; position: absolute; right: 16px;"> <img style="position: relative; top: 0px;" src="img/icon/forward.png" alt="" /></div>';
                    if(data.source) buffer += '<img style="max-width: 128px;" src="' + data.source + '" alt="" class="left margin-horizontal" />';
                    if(data.header) buffer += '<h2>' + data.header + '</h2>';
                    if(data.content) buffer += data.content;
                    buffer += '</div>';
                break;
        }

        output.append(buffer);

        if(ignore === false && data !== undefined) {
            var current = $(output.children().last());
            if(data.page !== undefined) app.generateLink(current, data.page);
            if(data.event !== undefined) app.generateLink(current, 'events/' + data.event);
            if(data.class !== undefined) app.generateClasses(current, data.class);
        }

        if(divider) app.generateElement("divider", null, output);
    },
    output: $('.app'),
    page: {
        current: 'home',
        previous: 'home'
    },
    download: function(url) {
        window.plugins.childBrowser.openExternal(url);
    }
};

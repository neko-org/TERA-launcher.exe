/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.1.5
 * (c) Copyright 2010-2011, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo. Filesize function by Cary Dunn.)
 * 
 * History:
 * 1.1.5 - Target option now applies to all feed links
 * 1.1.4 - Added option to hide media and now compressed with Google Closure
 * 1.1.3 - Check for valid published date
 * 1.1.2 - Added user callback function due to issue with ajaxStop after jQuery 1.4.2
 * 1.1.1 - Correction to null xml entries and support for media with jQuery < 1.5
 * 1.1.0 - Added support for media in enclosure tags
 * 1.0.3 - Added feed link target
 * 1.0.2 - Fixed issue with GET parameters (Seb Dangerfield) and SSL option
 * 1.0.1 - Corrected issue with multiple instances
 *
 **/

(function($) {

    $.fn.rssfeed = function (url, options, fn) {

        // Set pluign defaults
        var defaults = {
            limit: 10,
            header: true,
            titletag: 'article',
            date: true,
            content: true,
            snippet: true,
            media: true,
            showerror: true,
            errormsg: '',
            key: null,
            ssl: false,
            linktarget: '_self'
        };
        var options = $.extend(defaults, options);

        // Functions
        return this.each(function(i, e) {
            var $e = $(e);
            var s = '';

            // Check for SSL protocol
            if (options.ssl) s = 's';

            // Add feed class to user div
            if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');

            // Check for valid url
            if (url == null) return false;

            // Send request
            $.get(url, function (xmldata) {
                if (xmldata.indexOf("<?xml") != -1) {
                    xmldata = xmldata.substr(xmldata.indexOf("?>") + 2);
                }

                if (typeof (xmldata) === "string") {
                    xmldata = $.parseXML(xmldata);
                }
                
                var data = $.xml2json(xmldata);

                // Process the feeds
                _process(e, data, xmldata, options);

                // Optional user callback function
                if ($.isFunction(fn)) fn.call(this, $e);
            }).error(function (e) {
                // Handle error if required
                var msg = "";
                if (options.showerror)
                    if (options.errormsg != '') {
                    var msg = options.errormsg;
                }
                $(e).html('<div class="rssError"><p>' + msg + '</p></div>');
            });
        });
    };

    // Function to create HTML result
    var _process = function(e, data, xml, options) {

        // Get JSON feed data
        var feeds = data.channel;
        if (!feeds) {
            return false;
        }
        var html = '';
        var row = 'odd';

        // Get XML data for media (parseXML not used as requires 1.5+)
        if (options.media) {
            var xmlEntries = xml.getElementsByTagName('item');
        }

        // Add header if required
        if (options.header)
            html += '<div class="rssHeader">' +
				'<a href="' + feeds.link + '" title="' + feeds.description + '">' + feeds.title + '</a>' +
				'</div>';

        // Add body
        html += '<div class="">';

        //function openURL(targeturl) {
        //    platform.shellOpen(targeturl);
        //};

        // Add feeds
        for (var i = 0; i < data.channel.item.length; i++) {
            if (options.limit != null) {
                if (i >= options.limit)
                    break;
            }

            // Get individual feed
            var entry = data.channel.item[i];
            var publishedDate;

            // Format published date
            if (entry.pubDate) {
                var entryDate = new Date(entry.pubDate);
                var publishedDate = entryDate.toLocaleDateString();
            }

            //find all images in the articles and change relative src urls to absolute
            function fixImageURLs(fulldescription) {
                var imgTags = $('img', fulldescription).each(function () {
                    //var me = $(this).attr("src");
                    //alert(me);
                    //alert($this.attr("src"));
                    var urlRelative = $(this).attr("src");
                    var urlAbsolute = "http://en.tera.gameforge.com" + urlRelative;
                    alert(urlAbsolute);
                    $(this).attr("src", urlAbsolute);
                })
            }

            //fixImageURLs(entry.description);

            // Add feed row
            //html += '<li class="rssRow ' + row + '">';

            var entryString = entry.link.toString();
            var entryStringTrim = entryString.trim();
            var entryStringLen = entryStringTrim.length;

            var maxTitleLen = 80;      

            if (i < (options.limit - 1)) {
                if (entryStringLen > maxTitleLen) {
                    html += '<article class="preview_news_long">';
                } else {
                    html += '<article class="preview_news">';
                }
            } else {
                if (entryStringLen > maxTitleLen) {
                    html += '<article class="preview_news_long">';
                } else {
                    html += '<article class="preview_news">';
                }
            }


            //Add any media
            if (options.media && xmlEntries.length > 0) {
                var xmlMedia = xmlEntries[i].getElementsByTagName('enclosure');
                if (xmlMedia.length > 0) {
                    html += '<a class="news_thumb" href="#" link="' + entry.link + '">';
                    for (var m = 0; m < xmlMedia.length; m++) {
                        var xmlUrl = xmlMedia[m].getAttribute("url");
                        var xmlType = xmlMedia[m].getAttribute("type");
                        var xmlSize = xmlMedia[m].getAttribute("length");
                        if (xmlType === "img/jpg") {
                            html += '<img height="90px" width="90px" class="attachment-thumbnail" src="' + xmlUrl + '"></img>';
                        } else {
                            html += '<img height="90px" width="90px" class="attachment-thumbnail" src="' + xmlUrl + '"></img>';
                        }
                    }
                    html += '</a>'
                }
            }
            
            // article list - article title header
                html += '<h3><a href="#" link="' + entry.link + '" title="' + feeds.title + '">' + entry.title + '</a></h3>';


            //html + = '</' + options.titletag + '>';

            //comment this out if everthing breaks
                //html += '</li>';
            
            //article pub date
            if (options.date && publishedDate) { html += '<span class="date">' + publishedDate + '</span>' }

            function shorten(text, maxLength, options) {
                if (text.length <= maxLength) {
                    return text;
                }
                if (!options) options = {};
                var defaultOptions = {
                    // By default we add an ellipsis at the end
                    suffix: true,
                    suffixString: " ...",
                    // By default we preserve word boundaries
                    preserveWordBoundaries: true,
                    wordSeparator: " "
                };
                $.extend(options, defaultOptions);
                // Compute suffix to use (eventually add an ellipsis)
                var suffix = "";
                if (text.length > maxLength && options.suffix) {
                    suffix = options.suffixString;
                }

                // Compute the index at which we have to cut the text
                var maxTextLength = maxLength - suffix.length;
                var cutIndex;
                if (options.preserveWordBoundaries) {
                    // We use +1 because the extra char is either a space or will be cut anyway
                    // This permits to avoid removing an extra word when there's a space at the maxTextLength index
                    var lastWordSeparatorIndex = text.lastIndexOf(options.wordSeparator, maxTextLength + 1);
                    // We include 0 because if have a "very long first word" (size > maxLength), we still don't want to cut it
                    // But just display "...". But in this case the user should probably use preserveWordBoundaries:false...
                    cutIndex = lastWordSeparatorIndex > 0 ? lastWordSeparatorIndex : maxTextLength;
                } else {
                    cutIndex = maxTextLength;
                }

                var newText = text.substr(0, cutIndex);
                return newText + suffix;
            }


            html += '<div class="full_description">' + entry.longtext + '</div>';

            //article body
            var learnMoreText = host.getLanguageString("UI_Learn_More")
            html += '<p><a href="#" link="' + entry.link + '" class="learn_more">' + learnMoreText + '</a></p>';
            if (options.content) {
                if (entry.encoded) {
                    html += '<div class="short_description">' + shorten(entry.description.trim(), 100); + '</div>';
                } else {
                    html += '<div class="short_description">' + shorten(entry.description.trim(), 100); + '</div>';
                }
            }
            html += '</article>';
        } // end of the FOR loop

        html += '</div>';

        //html += '</div>';

        $(e).html(html);

        // Apply target to links
        $('a', e).attr('target', options.linktarget);
    };

    function formatFilesize(bytes) {
        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    }
})(jQuery);


	

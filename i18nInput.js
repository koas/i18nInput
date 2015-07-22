/*
i18nInput - v1.0
Allows multiple languages in input boxes or text areas
https://github.com/koas/i18nInput
Flag Icons by GoSquared (http://www.gosquared.com/)

Usage: just call i18nInput on any jQuery element.

Example: $("#pageTitle").i18nTextInput();

Options: you can pass an object to override the default plugin options.

- defaultLang:   ISO 639-1 language code of the language that will be selected
				 (lowercase)
- imgPath:       path to the folder containing the language flag images
- imgExt:        extension of the flag images
- availLang:     array of ISO 639-1 language codes that will be available for 
				 this input (lowercase)
- focusCallback: function that will be called when the input gets focus
- keyupCallback: function that will be called when a key is pressed in the input
- debug:         boolean. If true the original input will not be hidden so you
				 can check the contents that will be sent in the form.
*/

(function($)
{
    $.fn.i18nInput = function(options)
    {
        var defaults =
        {
            defaultLang  : 'en',
            imgPath : 'flags/', 
            imgExt : 'png', 
            availLang : ['en', 'es', 'fr', 'de'],
            focusCallback : null,
            keyupCallback : null,
            debug: false
        };

        options = $.extend(defaults, options);
        
        var value = '';

        var fn =
        {
			buildFlags : function(o)
			{
				var langData = jQuery.parseJSON($("#" + o.attr("data-original")).val());
				var d = $(document.createElement("div"));
				d.css("text-align", "right");
				d.css("width", o.width() + "px");
				var n = 0;
				for (x = 0; x < options.availLang.length; ++x)
				{
					var lang = options.availLang[x];
					var i = $(document.createElement("img"));
					i.attr("data-lang", lang);
					i.attr("data-src", o.attr("id"));
					i.addClass("i18ninputflag");
					i.css("margin-left", "3px");
					i.css("border", "1px solid #fff");
					i.attr("src", options.imgPath + lang + "." + options.imgExt);
					i.click(fn.flagClicked);
					d.append(i);

					if (lang == options.defaultLang)
					{
						i.css("border-bottom", "5px solid #fff");
						o.val(langData[lang]);
						o.attr("data-currentLang", lang);
					}
				}
				o.blur(function(){fn.saveData($(this));});
				o.keyup(function(){fn.callKeyupCallback(o);});
				if (options.focusCallback !== null)
					o.focus(options.focusCallback);
				
				o.parent().prepend(d);
				fn.updateOpacity(o);
			},
			callKeyupCallback : function(item)
			{
				fn.saveData(item);
				if (options.keyupCallback !== null)
					options.keyupCallback();
			},
			flagClicked : function()
			{
				var item = $("#" + $(this).attr("data-src"));
				fn.saveData(item);
				
				var original = $("#" + item.attr("data-original"));
				var lang = $(this).attr("data-lang");
				item.attr("data-currentLang", lang);
				var langData = jQuery.parseJSON(original.val());
				item.val(langData[lang]);

				$(this).parent().find(".i18ninputflag").css("border", "1px solid #fff");
				$(this).css("border-bottom", "5px solid #fff");
				item.focus();
			},
			saveData : function(item)
			{
				var original = $("#"+item.attr("data-original"));
				var lang = item.attr("data-currentLang");
				var langData = jQuery.parseJSON(original.val());
				langData[lang] = item.val();
				original.val(JSON.stringify(langData));
				fn.updateOpacity(item);
			},
			updateOpacity : function(item)
			{
				var original = $("#"+item.attr("data-original"));
				var langData = jQuery.parseJSON(original.val());

				item.parent().find(".i18ninputflag").each(function()
				{
					var val = langData[$(this).attr("data-lang")];
					if (typeof(val) == 'string' && val !== '')
						$(this).css("opacity", "1");
					else $(this).css("opacity", "0.4");
				});
			}
        };

        if (!this)
            return false;

        return this.each(function()
        {
            var obj = $(this);
            try
            {
				jQuery.parseJSON(obj.val());
            }catch (e)
            {
				obj.val('{"' + options.defaultLang + '":""}');
			}

            if (!obj.is('[id]'))
            {
				var rand = Math.floor(Math.random() * 999999);
				obj.attr("id", "i18ninput_" + rand);
			}

			var copy = obj.clone();
			copy.attr("id", obj.attr("id") + "_copy");
			copy.attr("data-original", obj.attr("id"));
			obj.parent().append(copy);

			if (!options.debug)
				obj.hide();

            fn.buildFlags(copy);
        });
    };
}(jQuery));
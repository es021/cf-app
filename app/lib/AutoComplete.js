
var AutoComplete = function (dom, sourceList, _renderItem = null) {
    this.dom = dom;
    this.sourceList = sourceList;

    var defaultRender = jQuery.ui.autocomplete.prototype._renderItem;

    if (_renderItem !== null) {
        this.dom.focusin(function () {
            jQuery.ui.autocomplete.prototype._renderItem = _renderItem;
        });

        this.dom.focusout(function () {
            jQuery.ui.autocomplete.prototype._renderItem = defaultRender;
        });
    }

    var matches = 0;
    var MAX_MATCH = 10;
    var current_term = "";

    this.dom.autocomplete({
        source: function (request, response) {

            if (current_term != request.term) {
                current_term = request.term;
                matches = 0;
            }

            // if less than 2 char dont do search
            if (request.term.length <= 2) {
                return false;
            }

            var term = request.term.toUpperCase();
            response(jQuery.map(sourceList, function (item) {
                if (matches < MAX_MATCH) {
                    if (item.value.indexOf(term) === 0 || item.label.indexOf(term) >= 0) {
                        matches++;
                        return item;
                    }
                }
            }));
        }
    });
};

AutoComplete.RenderPairHighlight = function (ul, item) {
    var res = item.value + " - " + item.label;
    var regex = new RegExp(jQuery.trim(this.term.toUpperCase()));
    var t = res.replace(regex, "<span style='font-weight:bold; color:blue;'>"
            + jQuery.trim(this.term.toUpperCase()) +
            "</span>");
    return jQuery("<li></li>")
            .data("item.autocomplete", item)
            .append("<span>" + t + "</span>")
            .appendTo(ul);
};

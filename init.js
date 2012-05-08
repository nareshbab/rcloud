function shell_tab()
{
    shell.terminal.enable();
}

function editor_tab()
{
    shell.terminal.disable();
}

function internals_tab()
{
    shell.terminal.disable();
}

function transpose(ar) {
    return _.map(_.range(ar[0].length), function(i) {
        return _.map(ar, function(lst) { return lst[i]; });
    });
}

function main_init() {
    rclient = RClient.create("ws://"+location.hostname+":8081/", function() {
        rcloud.init_client_side_data();
        var that = this;
        var shell_objtypes = ["scatterplot", "iframe", "facet_osm_plot"];
        for (var i=0; i<shell_objtypes.length; ++i) {
            (function(objtype) {
                that.register_handler(objtype, function(data) {
                    shell.handle(objtype, data);
                });
            })(shell_objtypes[i]);
        }

        editor.init();

        // tabs navigation
        var map = {
            0: shell_tab,
            1: editor_tab,
            2: internals_tab
        };
        $("#tabs").tabs({
            select: function(event, ui) {
                if (map[ui.index] === undefined)
                    throw "bad select??";
                map[ui.index]();
            }
        });
        $("#tabs").tabs("select", "#tabs-1");
    });
}

window.onload = main_init;
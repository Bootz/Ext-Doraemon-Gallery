(function (window, undefined) {
    define([
        'backbone',
        'doT',
        'jquery',
        'log',
        'IO'
    ], function (
        Backbone,
        doT,
        $,
        log,
        IO
    ) {
        var ItemView = Backbone.View.extend({
            template : doT.template($('#tmpl-item').html()),
            tagName : 'li',
            className : 'item-ctn',
            initialize : function () {
                this.listenTo(this.model, 'change:hide', function (extension, hide) {
                    this.$el.toggle(!hide);
                });
            },
            render : function () {
                this.$el.html(this.template(this.model.toJSON()));

                if (this.model.get('hide')) {
                    this.$el.hide();
                } else {
                    this.$el.show();
                }

                var iconURL = this.model.get('icon');

                if (iconURL) {
                    var $icon = $(new window.Image());

                    var loadHandler = function () {
                        this.$el.find('.icon').attr({
                            src : $icon.attr('src')
                        });
                        $icon.remove();
                    }.bind(this);

                    var errorHandler = function () {
                        $icon.remove();
                    };

                    $icon.on('load', loadHandler)
                        .on('error', errorHandler)
                        .attr({
                            src : iconURL
                        });
                }

                return this;
            },
            clickItem : function (evt) {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : 'wdj://window/publish.json',
                    data : {
                        channel : 'sidebar.preview',
                        data : JSON.stringify({
                            id : this.model.id,
                            name : this.model.get('name')
                        })
                    }
                });

                log({
                    'event' : 'ui.click.gallery_window_item_preview',
                    'id' : this.model.id,
                    'index' : this.model.collection.models.indexOf(this.model)
                });

                return deferred.promise();
            },
            clickButtonStar : function (evt) {
                evt.stopPropagation();
                this.model.starAsync();

                log({
                    'event' : 'ui.click.gallery_window_item_star',
                    'id' : this.model.id,
                    'index' : this.model.collection.models.indexOf(this.model)
                });
            },
            events : {
                'click' : 'clickItem',
                'click .button-star' : 'clickButtonStar'
            }
        });

        return ItemView;
    });
}(this));

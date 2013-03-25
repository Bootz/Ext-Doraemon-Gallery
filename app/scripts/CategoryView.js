(function (window) {
    define([
        'backbone',
        'underscore',
        'doT',
        'jquery',
        'ItemView'
    ], function (
        Backbone,
        _,
        doT,
        $,
        ItemView
    ) {
        var CategoryView = Backbone.View.extend({
            tagName : 'li',
            className : 'category-ctn',
            template : doT.template($('#tmpl-category').html()),
            initialize : function () {
                window.addEventListener('message', function (evt) {
                    var data = JSON.parse(evt.data);
                    var item;
                    if (data.actions === 'gallery.star') {
                        item = this.collection.get(data.id);
                        if (item) {
                            item.set({
                                hide : false
                            }, {
                                silent : true
                            });

                            item.set({
                                hide : true
                            });
                        }
                    } else if (data.actions === 'gallery.unstar') {
                        item = this.collection.get(data.id);
                        if (item) {
                            item.set({
                                hide : true
                            }, {
                                silent : true
                            });

                            item.set({
                                hide : false
                            });
                        }
                    }
                }.bind(this));
            },
            checkStates : function () {
                var visible = _.find(this.options.models, function (extension) {
                    return !extension.get('hide');
                });
                this.$el.toggle(visible !== undefined);
            },
            render : function () {
                this.$el.html(this.template({
                    name : this.options.name
                }));

                _.each(this.options.models, function (extension) {
                    var itemView = new ItemView({
                        model : extension
                    });
                    this.$('ul').append(itemView.render().$el);
                    this.listenTo(extension, 'change:hide', this.checkStates);
                }, this);

                if (this.options.hideToggle) {
                    this.$('.button-toggle').remove();
                }

                return this;
            },
            clickButtonToggle : function () {
                this.$('ul').toggleClass('expend');
            },
            events : {
                'click .button-toggle' : 'clickButtonToggle'
            }
        });

        return CategoryView;
    });
}(this));

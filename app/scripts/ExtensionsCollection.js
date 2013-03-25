(function (window) {
    define([
        'backbone',
        'jquery',
        'IO'
    ], function (
        Backbone,
        $,
        IO
    ) {
        var ExtensionModel = Backbone.Model.extend({
            defaults : {
                hide : false
            },
            starAsync : function () {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : 'wdj://window/publish.json',
                    data : {
                        channel : 'sidebar.star',
                        data : JSON.stringify({
                            id : this.id,
                            name : this.get('name'),
                            star : this.get('star')
                        })
                    }
                });

                return deferred.promise();
            }
        });

        var ExtensionsCollection = Backbone.Collection.extend({
            url : 'http://www.wandoujia.com/webstore/sidebar/all',
            model : ExtensionModel,
            parse : function (resp) {
                this.SITE_DIR = resp.SITE_DIR;
                this.STAR_OBJ = resp.STAR_OBJ;
                return resp.LIST;
            },
            getRecommendPlugins : function () {
                return this.filter(function (extension) {
                    return extension.get('status') === 1;
                });
            },
            getLatestPlugins : function () {
                return this.filter(function (extension) {
                    return extension.get('status') === 0;
                });
            },
            getNormalPlugins : function () {
                return this.filter(function (extension) {
                    return extension.get('groupid') !== 0;
                });
            },
            comparator : function (extension) {
                return -parseInt(extension.get('commend'), 10);
            }
        });

        return ExtensionsCollection;
    });
}(this));

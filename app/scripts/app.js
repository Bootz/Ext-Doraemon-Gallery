(function (window, document) {
    require.config({
        baseUrl : 'scripts',
        paths: {
            jquery: 'vendor/jquery.min'
        }
    });

    require.config({
        paths : {
            jquery: 'vendor/jquery-2.0.0',
            doT : 'vendor/doT-0.2.0',
            underscore: 'vendor/underscore-1.4.3',
            backbone: 'vendor/backbone-0.9.10',
            Narya : 'vendor/Narya'
        },
        shim: {
            doT : {
                exports : 'doT'
            },
            jquery : {
                exports : '$'
            },
            underscore : {
                exports :　'_'
            },
            backbone : {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            Narya : {
                deps: ['underscore', 'jquery', 'backbone'],
                exports : 'Narya'
            }
        }
    });

    define([
        'backbone',
        'underscore',
        'jquery',
        'ExtensionsCollection',
        'CategoryView',
        'QueryString'
    ], function (
        Backbone,
        _,
        $,
        ExtensionsCollection,
        CategoryView,
        QueryString
    ) {
        var render = function (extensionsCollection) {
            var fragment = document.createDocumentFragment();
            var categoryView;
            var headerView;

            var gallery = extensionsCollection.get(305);
            if (gallery) {
                gallery.set({
                    hide : true
                });
            }

            var targetCate = QueryString.get('cate');
            if (targetCate) {
                var models = extensionsCollection.filter(function (extension) {
                    return extension.get('groupid') === targetCate;
                });

                categoryView = new CategoryView({
                    models : models,
                    headerView : headerView,
                    name : models[0].get('category'),
                    hideToggle : true
                });

                fragment.appendChild(categoryView.render().$el[0]);
            } else {
                // 渲染「新品推荐」
                var latest = extensionsCollection.getLatestPlugins();
                if (latest.length > 0) {
                    categoryView = new CategoryView({
                        models : latest,
                        headerView : headerView,
                        name : '新品推荐'
                    });

                    fragment.appendChild(categoryView.render().$el[0]);
                }

                // 渲染「编辑推荐」
                var recommend = extensionsCollection.getRecommendPlugins();
                if (recommend.length > 0) {
                    categoryView = new CategoryView({
                        models : recommend,
                        headerView : headerView,
                        name : '精选'
                    });

                    fragment.appendChild(categoryView.render().$el[0]);
                }

                // 渲染普通类别
                var categories = extensionsCollection.groupBy(function (extension) {
                    return extension.get('groupid');
                });

                _.each(categories, function (samples, index) {
                    if (samples.length > 0 && index !== 0) {

                        categoryView = new CategoryView({
                            models : samples,
                            headerView : headerView,
                            name : samples[0].get('category')
                        });

                        fragment.appendChild(categoryView.render().$el[0]);
                    }
                });
            }

            $('body > ul').append(fragment);
        };

        var extensionsCollection = new ExtensionsCollection();
        extensionsCollection.on('sync', function (collection) {
            $.ajax({
                url : 'http://www.wandoujia.com/webstore/sidebar/install',
                success : function (resp) {
                    try {
                        $('.w-ui-loading').hide();
                        var installed = resp.install.split(',');
                        collection.each(function (extension) {
                            if (installed.indexOf(extension.id) >= 0) {
                                extension.set({
                                    hide : true
                                });
                            }
                        });
                    } catch (e) {

                    }
                }
            });
        });
        extensionsCollection.on('sync', render).fetch();
    });
}(this, this.document));

define(function (require) {

    'use strict';

    /***************************
        Additional 'polyfils'
            * bind function -- bloomin phantonjs doesn't support bind :s
    ***************************/
    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = function (context) {
            var slice = Array.prototype.slice;
            var fn = this;

            return function () {
                var args = slice.call(arguments, 1);

                if (args.length) {
                    return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
                } else {
                    return arguments.length ? fn.apply(context, arguments) : fn.call(context);
                }
            };
        };
    }

    /***************************
        Variables
    ***************************/
    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var shareTools = require('lib/news_special/share_tools/controller');
    var ViolenceBreakdownChartMediator = require('mediator/violenceBreakdownChartMediator');
    var CaseStudyVideoMediator = require('mediator/caseStudyVideoMediator');
    var StateMapsMediator = require('mediator/stateMapsMediator');
    var PopVioGraphMediator = require('mediator/popVioGraphMediator');
    var CityMapMediator = require('mediator/cityMapMediator');
    var CityViolenceGraph = require('mediator/cityViolenceGraph');

    return {
        init: function (storyPageUrl) {

            /***************************
                mediator store
            ***************************/
            this.violenceBreakdownChartMediator = new ViolenceBreakdownChartMediator();
            this.caseStudyVideoMediator = new CaseStudyVideoMediator();
            this.stateMapsMediator = new StateMapsMediator();
            this.popVioGraphMediator = new PopVioGraphMediator();
            this.cityMapMediator = new CityMapMediator();
            this.cityViolenceGraph = new CityViolenceGraph();

            /***************************
                events
            ***************************/
            news.pubsub.on(eventStrs.highlightCityOnMap, this.cityMapMediator.handleHighlightCity.bind(this.cityMapMediator));
            news.pubsub.on(eventStrs.unhighlightCityOnMap, this.cityMapMediator.handleUnhighlightCity.bind(this.cityMapMediator));

            /***************************
                istats init
            ***************************/
            news.pubsub.emit('istats', ['app-initiated', 'newsspec-nonuser', true]);
            
            /***************************
                js load complete
            ***************************/
            news.sendMessageToremoveLoadingImage();
        }
    };

});

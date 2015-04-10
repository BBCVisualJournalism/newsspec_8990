define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var mapData = require('model/mapData');

    var CityViolenceGraph = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.graphEl = news.$('.cityViolenceGraph');

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    CityViolenceGraph.prototype = {

        init: function () {
            /********************************************************
                * construct the bars and values for the city graph based on model/mapData
            ********************************************************/
            var graphLength = (mapData.cityData.length >= 10) ? 10 : mapData.cityData.length, a, highestVal = mapData.cityData[0].val;
            for (a = 0; a < graphLength; a++) {

                var cityDataObj = mapData.cityData[a];

                var graphBarHolderEl = news.$('<div class="cityVioGraphBarHolder"></div>');

                var cityNameSpanVal = news.$('#city_' + cityDataObj.id + '_name').html();
                
                var barTitle = news.$('<span>' + cityNameSpanVal + '</span>');
                graphBarHolderEl.append(barTitle);

                var bar = news.$('<div class="cityVioBar graphOverColorAnim"></div>');
                bar.css('width', (((cityDataObj.val / highestVal) * 100) + '%'));
                graphBarHolderEl.append(bar);

                var barVal = news.$('<span class="cityVioBarVal">' + (Math.round(cityDataObj.val * 10) / 10) + '</span>');
                bar.append(barVal);

                this.graphEl.append(graphBarHolderEl);

                bar.on('mouseover', {cityIndex: cityDataObj.id}, this.handleCityOver.bind(this));
                bar.on('mouseout', {cityIndex: cityDataObj.id}, this.handleCityOut.bind(this));
            }
        },

        handleCityOver: function (e) {
            var cityIndex = e.data.cityIndex;

            /********************************************************
                * publish a rollover event with the city index so that another "class" can pick this up and update another view
            ********************************************************/
            news.pubsub.emit(eventStrs.highlightCityOnMap, [cityIndex]);
        },

        handleCityOut: function (e) {
            var cityIndex = e.data.cityIndex;
            /********************************************************
                * publish a rollout event with the city index so that another "class" can pick this up and update another view
            ********************************************************/
            news.pubsub.emit(eventStrs.unhighlightCityOnMap, [cityIndex]);
        }

    };

    return CityViolenceGraph;

});
define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var mapData = require('model/mapData');
    var fallbackTooltipData = require('model/fallbackTooltipPos');
    var indiaMap = require('text!requireAssets/indiaMap.svg!strip');
    var featureDetection = require('model/featureDetection');

    var CityMapMediator = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.map3El = news.$('.map3Holder');
        this.cityIdLookup = {};
        this.tooltipEl = this.map3El.find('.mapTooltip');
        this.hideTooltipDelay = undefined;

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    CityMapMediator.prototype = {

        init: function () {

            /**********************
                * city Id Lookup dict
            **********************/
            var a, citiesLength = mapData.cityData.length;
            for (a = 0; a < citiesLength; a++) {
                this.cityIdLookup[mapData.cityData[a].id.toString()] = a;
            }

            /**********************
                * if you don't have svg support display the fallback image and return out of this method
            **********************/
            if (!featureDetection.iCanHazSvg) {
                this.addFallbackImg();
                return;
            }
            
            /**********************
                * anything below this point in this method only gets called if the client has svg support
            **********************/
            this.map3El.append(indiaMap);


            /**********************
                * MOUSE LISTENERS
            **********************/
            var mapCitiesHolder = this.map3El.find('.citiesGroupHolder');

            var mapCitesEl = mapCitiesHolder.find('path');
            mapCitesEl.on('mouseover', {mapIndex: 1}, this.handleCityOver.bind(this));
            mapCitesEl.on('mouseout', {mapIndex: 1}, this.handleCityOut.bind(this));

        },

        addFallbackImg: function () {
            this.map3El.append('<img src="./img/map_fallback_cities.png" class="fallbackStateMapImg">');
        },

        /**********************
            * EVENT HANDLERS
        **********************/
        handleCityOver: function (e) {

            /**********************
                * find the city name and value and add to the tooltip
            **********************/
            var cityName = news.$('#city_' + e.currentTarget.id + '_name').html();
            var cityVal = mapData.cityData[this.cityIdLookup[e.currentTarget.id]].val, roundedVal = Math.round(cityVal * 10 ) / 10;

            this.tooltipEl.html(cityName + ' <span class="tooltipCityVal">' + roundedVal + '</span>');
            this.tooltipEl.removeClass('hideMapTooltip');
            this.tooltipEl.addClass('fadeInMapTooltip');

            /**********************
                * calculate the target position of the tooltip.
                * conditional statement on offsetY to deal with strange Android results
            **********************/
            var x = (e.pageX - this.map3El[0].offsetLeft) - (this.tooltipEl[0].clientWidth * 0.5), y = e.pageY - this.map3El[0].offsetTop;
            var targetX = (x > 0) ? x : 0;

            if (e.offsetY > this.map3El[0].clientHeight) {
                targetX = 10;
                targetY = 10;
                this.tooltipEl.css({
                    top: targetY + 'px',
                    right: targetX + 'px'
                });
            }
            else {
                this.tooltipEl.css({
                    top: (y - 50) + 'px',
                    left: targetX + 'px'
                });

                //start the mouse move event!
                $(window).on('mousemove', this.handleCityMove.bind(this));
            }

        },

        handleCityOut: function (e) {
            var outDelay = (e.offsetY > this.map3El[0].clientHeight) ? 5000 : 300;
            this.tooltipEl.removeClass('fadeInMapTooltip');
            this.hideTooltipDelay = setTimeout(function () {
                this.tooltipEl.addClass('hideMapTooltip');
                clearTimeout(this.hideTooltipDelay);
            }.bind(this), outDelay);

            //stop the mouseMove event!
            $(window).off('mousemove');
        },

        handleCityMove: function (e) {
            clearTimeout(this.hideTooltipDelay);
            var x = (e.pageX - this.map3El[0].offsetLeft) - (this.tooltipEl[0].clientWidth * 0.5), y = e.pageY - this.map3El[0].offsetTop;
            var targetX = (x > 0) ? x : 0;

            this.tooltipEl.css({
                top: (y - 50) + 'px',
                left: targetX + 'px'
            });

        },

        /**********************
            * means of highlighting a city with the tooltip without mouse interaction
        **********************/
        handleHighlightCity: function (cityNum) {
            clearTimeout(this.hideTooltipDelay);

            if (!featureDetection.iCanHazSvg) {
                /**********************
                    * if we dont have svg support highlight the city on the fallback image and return out of the rest of this method
                **********************/
                this.highlightFallbackCity(cityNum);
                return;
            }


            /**********************
                * find the city name and value and add to the tooltip
            **********************/
            var cityName = news.$('#city_' + cityNum + '_name').html();
            var cityVal = mapData.cityData[this.cityIdLookup[cityNum]].val, roundedVal = Math.round(cityVal * 10 ) / 10;

            this.tooltipEl.html(cityName + ' <span class="tooltipCityVal">' + roundedVal + '</span>');
            clearTimeout(this.hideTooltipDelay);
            this.tooltipEl.removeClass('hideMapTooltip');
            this.tooltipEl.addClass('fadeInMapTooltip');

            /**********************
                * calculate the target position of the tooltip.
            **********************/
            var pathEl = this.map3El.find('.citypath_' + cityNum)[0];

            var svgHeightDiff = this.map3El[0].clientWidth / 790.26, pathBBox = pathEl.getBBox();
            var targetX = (((((pathBBox.x * 5.03) - 347.87) * svgHeightDiff) - (this.tooltipEl[0].clientWidth * 0.5)) + 15);
            this.tooltipEl.css({
                top: ((((pathBBox.y * 5.03) - 223.87) * svgHeightDiff) - 30) + 'px',
                left: targetX + 'px'
            });
            
        },

        /**********************
            * highlight the city on the fallback (no svg) map image
        **********************/
        highlightFallbackCity: function (cityNum) {

            var fallbackTooltipDataCityNum = this.cityIdLookup[cityNum];
            var cityName = news.$('#city_' + cityNum + '_name').html();

            var cityVal = mapData.cityData[cityNum - 1].val;
            this.tooltipEl.html(cityName + ' <span class="tooltipCityVal">' + cityVal + '</span>');
            clearTimeout(this.hideTooltipDelay);
            this.tooltipEl.removeClass('hideMapTooltip');
            this.tooltipEl.addClass('fadeInMapTooltip');

            var tooltipPointsObj = fallbackTooltipData.points[fallbackTooltipDataCityNum], mapImgEl = this.map3El.find('.fallbackStateMapImg')[0], mapWidth = mapImgEl.clientWidth, mapHeight = mapImgEl.clientHeight;
            var targetX = (mapWidth * tooltipPointsObj.x) - (this.tooltipEl[0].clientWidth * 0.5);
            var targetY = (mapHeight * tooltipPointsObj.y) - 50;

            this.tooltipEl.css({
                top: targetY + 'px',
                left: targetX + 'px'
            });

        },

        handleUnhighlightCity: function (cityNum) {
            this.tooltipEl.removeClass('fadeInMapTooltip');

            this.hideTooltipDelay = setTimeout(function () {
                this.tooltipEl.addClass('hideMapTooltip');
                clearTimeout(this.hideTooltipDelay);
            }.bind(this), 300);
        }

    };

    return CityMapMediator;

});
define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var mapData = require('model/mapData');
    var mapColors = require('model/stateMapColors');
    var indiaMap = require('text!requireAssets/indiaMap.svg!strip');
    var featureDetection = require('model/featureDetection');

    var StateMapsMediator = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.map1El = news.$('.map1Holder');
        this.map2El = news.$('.map2Holder');

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    StateMapsMediator.prototype = {

        init: function () {

            if (!featureDetection.iCanHazSvg) {
                /**********************
                    * if you dont have svg support dsplay the fallback image and return out out this method ("YOU SHALL NOT PASS"!)
                **********************/
                this.addFallbackImgs();
                return;
            }
            
            this.map1El.append(indiaMap);

            this.map2El.append(indiaMap);

            /**********************
                * lets color the maps!
                * based on the model model/stateMapColors and model/mapData
            **********************/
            var colorRangeLength = mapColors.colors.length;
            for (var key in mapData.stateData) {
                if (key.indexOf('disputed') == -1) {
                    var map1StateGEl = this.map1El.find('.' + key), map2StateGEl = this.map2El.find('.' + key), a;
                    var stateObj = mapData.stateData[key], val2003Found = 0, val2013Found = 0;
                    innerLoop: for (a = 0; a < colorRangeLength; a++) {
                        var colorRangeObj = mapColors.colors[a];
                        if (stateObj['2003'] >= colorRangeObj.startRange && stateObj['2003'] < colorRangeObj.endRange) {
                            map1StateGEl.css('fill', colorRangeObj.color);
                            val2003Found = 1;
                            if (val2013Found) {
                                break innerLoop;
                            }
                        }
                        if (stateObj['2013'] >= colorRangeObj.startRange && stateObj['2013'] < colorRangeObj.endRange) {
                            map2StateGEl.css('fill', colorRangeObj.color);
                            val2013Found = 1;
                            if (val2003Found) {
                                break innerLoop;
                            }
                        }
                    }
                }
            }

            /**********************
                * MOUSE LISTENERS
            **********************/
            var map1StatesHolder = this.map1El.find('.states_provinces'), map2StatesHolder = this.map2El.find('.states_provinces');

            var map1StatesEl = map1StatesHolder.find('g');
            map1StatesEl.on('mouseover', {mapIndex: 1}, this.handleStateOver.bind(this));
            map1StatesEl.on('mouseout', {mapIndex: 1}, this.handleStateOut.bind(this));

            var map2StatesEl = map2StatesHolder.find('g');
            map2StatesEl.on('mouseover', {mapIndex: 2}, this.handleStateOver.bind(this));
            map2StatesEl.on('mouseout', {mapIndex: 2}, this.handleStateOut.bind(this));
        },

        addFallbackImgs: function () {
            this.map1El.append('<img src="./img/map_fallback_states_2003.png" class="fallbackStateMapImg">');
            this.map2El.append('<img src="./img/map_fallback_states_2013.png" class="fallbackStateMapImg">');
        },

        /**********************
            * EVENT HANDLERS
        **********************/
        handleStateOver: function (e) {

            /**********************
                * find the state name and value and append to the tooltip
            **********************/
            var mapIndex = e.data.mapIndex, mapHolderEl = this['map' + mapIndex + 'El'];
            var className = news.$(e.currentTarget).attr('class'), stateName = news.$('#' + className + '_name').html();

            var x = e.pageX - mapHolderEl[0].offsetLeft, y = e.pageY - mapHolderEl[0].offsetTop;
            var tooltipEl = mapHolderEl.find('.mapTooltip'), stateVal = (mapIndex == 1) ? mapData.stateData[className]['2003'] : mapData.stateData[className]['2013'];

            tooltipEl.html(stateName + ' <span class="tooltipStateVal">' + stateVal + '</span>');
            tooltipEl.removeClass('hideMapTooltip');
            tooltipEl.addClass('fadeInMapTooltip');

            /**********************
                * find the target x position of the tooltip.
                * e.offsetY conditional to handle Android quirks
            **********************/
            var targetX = x - (tooltipEl[0].clientWidth * 0.5), targetY = (y - 55);

            if (targetX < 0) {
                targetX = 0;
            }
            if (targetX > mapHolderEl[0].offsetWidth - (tooltipEl[0].clientWidth + 2)) {
                targetX = mapHolderEl[0].offsetWidth - (tooltipEl[0].clientWidth + 2);
            }
            
            var rightAlign = false;
            if (e.offsetY > this.map1El[0].clientHeight) {
                targetX = 10;
                targetY = 10;
                tooltipEl.css({
                    top: targetY + 'px',
                    right: targetX + 'px'
                });
                rightAlign = true;
            }
            else {
                tooltipEl.css({
                    top: targetY + 'px',
                    left: targetX + 'px'
                });
                //start the mouse move event!
                $(window).on('mousemove', {mapIndex: mapIndex, tooltipEl: tooltipEl}, this.handleStateMove.bind(this));
            }

             /**********************
                * highlight the tooltip on the other map
            **********************/
            var otherMapIndex = (mapIndex == 1) ? 2 : 1, otherStateVal = (otherMapIndex == 1) ? mapData.stateData[className]['2003'] : mapData.stateData[className]['2013'];
            this.showOtherTooltip(otherMapIndex, targetX, targetY, true, stateName + ' <span class="tooltipStateVal">' + otherStateVal + '</span>', rightAlign);
        },

        handleStateOut: function (e) {
            var a;
            for (a = 1; a <= 2; a++) {
                var mapHolderEl = this['map' + a + 'El'], tooltipEl = mapHolderEl.find('.mapTooltip');
                tooltipEl.removeClass('fadeInMapTooltip');
            }

            //stop the mouseMove event!
            $(window).off('mousemove');
        },

        handleStateMove: function (e) {
            var mapIndex = e.data.mapIndex, mapHolderEl = this['map' + mapIndex + 'El'], otherMapIndex = (mapIndex == 1) ? 2 : 1;
            var x = e.pageX - mapHolderEl[0].offsetLeft, y = e.pageY - mapHolderEl[0].offsetTop;

            var targetX = x - (e.data.tooltipEl[0].clientWidth * 0.5), targetY = (y - 55);
            if (targetX < 0) {
                targetX = 0;
            }
            if (targetX > mapHolderEl[0].offsetWidth - (e.data.tooltipEl[0].clientWidth + 2)) {
                targetX = mapHolderEl[0].offsetWidth - (e.data.tooltipEl[0].clientWidth + 2);
            }

            e.data.tooltipEl.css({
                top: targetY + 'px',
                left: targetX + 'px'
            });

            this.showOtherTooltip(otherMapIndex, targetX, targetY);

        },

        showOtherTooltip: function (mapIndex, targetX, targetY, init, tooltipHtml, rightAlign) {
            var mapHolderEl = this['map' + mapIndex + 'El'], tooltipEl = mapHolderEl.find('.mapTooltip');
            if (init) {
                tooltipEl.html(tooltipHtml);
                tooltipEl.removeClass('hideMapTooltip');
                tooltipEl.addClass('fadeInMapTooltip');
            }
            if (targetX < 0) {
                targetX = 0;
            }
            if (targetX > mapHolderEl[0].offsetWidth - tooltipEl[0].clientWidth) {
                targetX = mapHolderEl[0].offsetWidth - tooltipEl[0].clientWidth;
            }
            if (rightAlign) {
                tooltipEl.css({
                    top: targetY + 'px',
                    right: targetX + 'px'
                });
            }
            else {
                tooltipEl.css({
                    top: targetY + 'px',
                    left: targetX + 'px'
                });
            }
        }

    };

    return StateMapsMediator;

});
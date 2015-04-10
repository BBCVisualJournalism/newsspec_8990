define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var popVioData = require('model/populationViolenceData');
    var featureDetection = require('model/featureDetection');

    var PopVioGraphMediator = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.graphEl = news.$('.popVioGraphWithKeyRel');

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    PopVioGraphMediator.prototype = {

        init: function () {

            var barsHolderEl = this.graphEl.find('.popVioGraphBars'), svgHolderEl = barsHolderEl.find('.popVioSvgLines');
            
            var a, pointsLength = popVioData.length, barWidth = 100/pointsLength, barMarginOffset = barWidth*0.5, graphLine, graphLineStr;
        
            var iCanHazSvg = featureDetection.iCanHazSvg;
            
            if (iCanHazSvg) {
                /***************************
                    * if we have svg support then we can draw a nice line (svg path) to represent the dom violence rates. Init the path object here
                ***************************/
                graphLine = document.createElementNS('http://www.w3.org/2000/svg',"path"), graphLineStr = 'M' + (barMarginOffset * 2) + ',' + (100 - popVioData[0].violenceRatePercent) + ' ';
            }

            for (a = 0; a < pointsLength; a++) {
                
                /***************************
                    * add the graph bars based on the model model/populationViolenceData
                ***************************/
                var graphBarEl = news.$('<div class="popVioGraphBar"></div>');
                var barBg = news.$('<div class="barbg"></div>');
                graphBarEl.append(barBg);
                graphBarEl.css({
                    width: barWidth + '%',
                    height: popVioData[a].populationPercent + '%',
                    'margin-left': -barMarginOffset + '%',
                    left: barMarginOffset + (a * barWidth) + '%'
                });

                /***************************
                    * add the years key to the bottom of the graph (even years)
                ***************************/
                var isEven = (a % 2 == 0);
                if (isEven) {
                    var barYearEL = news.$('<span>' + popVioData[a].year + '</span>');
                    barYearEL.css({
                        position: 'absolute',
                        bottom: '-25px',
                        left:'50%',
                        'margin-left': '-30px',
                        'text-align': 'center',
                        width: '60px'
                    });
                    if (a && a < (pointsLength - 1)) {
                        barYearEL.addClass('popVioGraphYearKey');
                    }
                    barBg.append(barYearEL);
                }

                barsHolderEl.append(graphBarEl);

                if (iCanHazSvg) {
                    /***************************
                        * add the points along the line (svg path)
                    ***************************/
                    if (a > 0) {
                        graphLineStr += (' L' + ((barMarginOffset + (a * barWidth)) * 2) + ',' + (100 - popVioData[a].violenceRatePercent) + ' ');
                    }
                }
                else {
                    /***************************
                        * ie fallback point
                    ***************************/
                    var fallbackPoint = news.$('<div class="popVioGraphFallbackPoint"></div>');
                    fallbackPoint.css({
                        bottom: popVioData[a].violenceRatePercent + '%',
                        left: (barMarginOffset + (a * barWidth)) + '%',
                    });
                    barsHolderEl.append(fallbackPoint);
                }

            }

            if (iCanHazSvg) {
                /***************************
                    * append the line (svg path) to the svg element
                ***************************/
                graphLine.setAttribute('d', graphLineStr);
                graphLine.setAttribute('class', 'popVioSvgline');
                svgHolderEl.append(graphLine);
            }

        }

    };

    return PopVioGraphMediator;

});

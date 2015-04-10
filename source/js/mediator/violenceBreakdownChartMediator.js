define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var chartData = require('model/violenceBreakdownData');

    var ViolenceBreakdownChartMediator = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.chartBarsEl = news.$('.violenceBreakdownChart');
        this.chartTextEl = news.$('.violenceBreakdownChartText');

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    ViolenceBreakdownChartMediator.prototype = {

        init: function () {
            var chartSectionEls = this.chartBarsEl.find('.chartSection'), chartSectionTextEls = this.chartTextEl.find('.chartSection');
            var a, chartLength = chartData.violenceBreakdownData.length, chartValsTotal = 0;
            for (a = 0; a < chartLength; a++) {
                chartValsTotal += chartData.violenceBreakdownData[a].val;
            }
            /********************************************************
                * set the colours and widths of the sections of the violence breakdown graph based on model/violenceBreakdownData
            ********************************************************/
            for (a = 0; a < chartLength; a++) {
                var chartSectionEl = chartSectionEls[a], sectionWidth = ((chartData.violenceBreakdownData[a].val / chartValsTotal) * 100);
                if (chartSectionEl) {
                    news.$(chartSectionEl).css({
                        'background-color': chartData.violenceBreakdownData[a].colour,
                        width: sectionWidth + '%'
                    });
                }

                var chartSectionTextEl = chartSectionTextEls[a];
                if (chartSectionTextEl) {
                    news.$(chartSectionTextEl).css({
                        'min-width': sectionWidth + '%'
                    });

                    var chartTextH5 = news.$(chartSectionTextEl).find('.chartSectionVal');
                    // chartTextH5.html(chartData.violenceBreakdownData[a].val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    chartTextH5.css('color', chartData.violenceBreakdownData[a].colour);

                    var labelSpanText = news.$('#' + chartData.violenceBreakdownData[a].id).html();
                    news.$(chartSectionTextEl).find('.chartSectionLabel').html(labelSpanText);

                }
            }
        }

    };

    return ViolenceBreakdownChartMediator;

});
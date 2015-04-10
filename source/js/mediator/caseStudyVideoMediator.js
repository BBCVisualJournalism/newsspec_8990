define(function (require) {

    'use strict';

    var news = require('lib/news_special/bootstrap');
    var eventStrs = require('model/eventStrs');
    var $mp = require('bump-3');

    var CaseStudyVideoMediator = function () {

        /********************************************************
            * VARIABLES
        ********************************************************/
        this.playlistPath1 = news.$('#videoPlaylistPathFirstHalf').html();
        this.playlistPath2 = news.$('#videoPlaylistPathSecondHalf').html();

        /********************************************************
            * INIT STUFF
        ********************************************************/
        this.init();
    };

    CaseStudyVideoMediator.prototype = {

        init: function () {

            /********************************************************
                * instantiate the smp player
            ********************************************************/
			this.mediaPlayer = $mp('#caseStudyVideoHolder').player({
				product: 'news',
				playerProfile: 'smp',
				responsive: true,
				ui: {
					enabled: true,
					controls: {
						enabled: true
					},
					cta: {
						enabled: true
					}
				},
				suppressItemKind: ['ident']
			});

			this.mediaPlayer.load(this.playlistPath1 + this.playlistPath2);
        }

    };

    return CaseStudyVideoMediator;

});
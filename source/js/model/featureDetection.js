define(function (require) {

    'use strict';

    return {
		iCanHazSvg: !!('createElementNS' in document && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect)
    };

});
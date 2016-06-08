function initMap() {
    window.geocoder = new google.maps.Geocoder();
}

(function ($) {
    "use strict";

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    $('#topNav').affix({
        offset: {
            top: 200
        }
    });

    new WOW().init();

    $('a.page-scroll').bind('click', function (event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $('.navbar-collapse ul li a').click(function () {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
        $('#galleryImage').attr("src", $(e.relatedTarget).data("src"));
    });

    var selectedCity, selectedService, dirtyCity, dirtyService;

    var cities = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/cities/%term',
            wildcard: '%term'
        }
    });

    $('#city').typeahead(null, {
        name: 'cities',
        display: 'text',
        source: $.debounce(300, function (query, sync, async) {
            if (!window.geocoder) {
                return;
            };
            window.geocoder.geocode({ 'address': query }, function (results) {
                var cities = [];
                for (var i in results) {
                    var result = results[i];
                    if (result.types.indexOf('locality') != -1) {
                        cities.push({ text: result.formatted_address });
                    }
                }
                async(cities)
            });
        })
    }).on('typeahead:select', function (e, obj) {
        selectedCity = obj;
    });

    var services = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/services/%term',
            wildcard: '%term'
        }
    });

    $('#service ').typeahead(null, {
        name: 'services',
        display: 'text',
        source: services
    }).on('typeahead:select', function (e, obj) {
        selectedService = obj;
    });

    $('.start-form').submit(function (e) {
        var params = [];
        var dirtyService = $('#service').val();
        var city = $('#city').val();

        if (city) {
            params.push('city=' + encodeURIComponent(city));
        }

        if (dirtyService && (!selectedService || dirtyService != selectedService.text)) {
            params.push('service=' + dirtyService);
        } else if (selectedService) {
            params.push('serviceId=' + selectedService.id);
        }

        var query = params.length ? params.join('&') : '';
        window.location = '/app/#/?' + query;

        e.preventDefault();
    });

})(jQuery);
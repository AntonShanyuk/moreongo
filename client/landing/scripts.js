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

    $(function () {
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
            source: cities
        }).on('typeahead:select', function(e, obj){
            selectedCity = obj;
            console.log(selectedCity);
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
        }).on('typeahead:select', function(e, obj){
            selectedService = obj;
        });
        
        $('.start-form').submit(function(e){            
            var params = [];
            var dirtyService = $('#service').val();
            var dirtyCity = $('#city').val();
            
            if(dirtyCity && (!selectedCity || dirtyCity != selectedCity.text)){
                params.push('city=' + dirtyCity);
            } else if(selectedCity){
                params.push('cityId=' + selectedCity.id);
            }
            
            if(dirtyService && (!selectedService || dirtyService != selectedService.text)){
                params.push('service=' + dirtyService);
            } else if(selectedService){
                params.push('serviceId=' + selectedService.id);
            }
            
            if(params.length){
                window.location = '/app/#?' + params.join('&');
            }
            e.preventDefault();
        });
        
    });

})(jQuery);
var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	if ('flex' in document.documentElement.style) {
		// Хак для UCBrowser
		if (navigator.userAgent.search(/UCBrowser/) > -1) {
			document.documentElement.setAttribute('data-browser', 'not-flex');
		} else {		
		    // Flexbox-совместимый браузер.
			document.documentElement.setAttribute('data-browser', 'flexible');
		}
	} else {
	    // Браузер без поддержки Flexbox, в том числе IE 9/10.
		document.documentElement.setAttribute('data-browser', 'not-flex');
	}

	// First screen full height
	function setHeiHeight() {
	    $('.full__height').css({
	        height: $(window).height() + 'px'
	    });
	}
	setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
	$(window).resize( setHeiHeight ); // обновляем при изменении размеров окна


	// Reset link whte attribute href="#"
	$('[href*="#"]').click(function(event) {
		event.preventDefault();
	});

	// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
	$('[data-smoot-scroll]').click( function(){ 
		var scroll_el = $(this).attr('href'); 
		if ($(scroll_el).length != 0) {
		$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
		}
		return false;
	});

	// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
    // $(document).ready(function(){
    //     var HeaderTop = $('#header').offset().top;
        
    //     $(window).scroll(function(){
    //             if( $(window).scrollTop() > HeaderTop ) {
    //                     $('#header').addClass('stiky');
    //             } else {
    //                     $('#header').removeClass('stiky');
    //             }
    //     });
    // });
   	// setGridMatch($('[data-grid-match] .grid__item'));
   	gridMatch();
   	fontResize();

    $('.js-tooltip').tooltipster({
        contentCloning: true,
        side: 'right',
        trigger: 'hover'
    });

    $('.exampleSlider').slick({
        dots: true,
        nextArrow: '<div class="exampleSlider-next"><div class="exampleSlider-icon"></div></div>',
        prevArrow: '<div class="exampleSlider-prev"><div class="exampleSlider-icon"></div></div>',
        responsive: [{
            breakpoint: 768,
            settings: {
                adaptiveHeight: true
            }
        }]
    });

    $('.faq__item').on('click', function(event) {
        event.preventDefault();
        var wrap = $(this);
        var descr = wrap.find('.faq__descr');

        if ($(this).hasClass('open')) {
            wrap.removeClass('open');
            descr.removeClass('active');
        } else {        
            $('.faq__item').removeClass('open');
            $('.faq__descr').removeClass('active');
            wrap.addClass('open');
            descr.addClass('active');
        }

    });

    // $('[type=tel]').inputmask({ showMaskOnHover: false, alias: "tel" });
    $('[type=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });

    $('[data-img-modal]').on('click', function(event) {
        event.preventDefault();
        var img = $(this).attr('href');

        $('#fansy .form').html('<img src="'+img+'" alt="" />');
        $('#fansy').modal('show');
    });

    $('[data-img-slider]').on('click', function(event) {
        event.preventDefault();
        var sliderId = $(this).attr('href');
        var slider = $(sliderId).clone();

        $('#projectModal .projectModal__content').html($(slider));
        $('#projectModal').modal('show');

        $('#projectModal .sliderDocs').slick({
            adaptiveHeight: true,
            // vertical: true
        });
        $('#projectModal .sliderDocs').slick("setPosition", 0);

    });

    $('#projectModal').on('hide.bs.modal', function() {
        $('#projectModal .sliderDocs').remove();        
    });
    $('#projectModal').on('shown.bs.modal', function() {
        $('.modal-backdrop').addClass('dark');        
    });

    formSubmit();

     $('.specialist__panes').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        fade: true,
        adaptiveHeight: true,
        draggable: false,
        asNavFor: '.specialist__tabs',
        responsive: [{
            breakpoint: 768,
            settings: {
                draggable: true
            }
        }]
    });
    $('.specialist__tabs').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        asNavFor: '.specialist__panes',
        arrows: false,
        dots: false,
        centerMode: false,
        vertical: true,
        infinite: false,
        focusOnSelect: true,
        adaptiveHeight: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                centerMode: true,
                vertical: false,
                variableWidth: true
            }
        }]
    });

    $('.specialist__pane_action .btn').on('click', function() {
        var form = $('#consultant .form');
        var specName = $(this).text();
        form.find('input[name=subject]').val('Форма - '+specName);
        form.find('button[type=submit] span').html(specName);

    });

});


function formSubmit() {
    $("[type=submit]").on('click', function (e){ 
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');
        // console.log(form_data);

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }  
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {        
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    // $('#success').modal('show');
                    // console.log('success');
                    console.log(response);
                    // console.log(data);
                    document.location.href = "success.html";
                },
                error: function (response) {
                    // $('#success').modal('show');
                    // console.log('error');
                    console.log(response);
                }
            });
        }

    });

    $('[name="policyConfirm"]').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });
}

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize()
});

function checkOnResize() {
   	// setGridMatch($('[data-grid-match] .grid__item'));
   	gridMatch();
   	fontResize();
}

function gridMatch() {
   	$('[data-grid-match] .grid__item').matchHeight({
   		byRow: true,
   	});
}

function fontResize() {
    var windowWidth = $(window).width();
    if (windowWidth < 1920 && windowWidth >= 768) {
    	var fontSize = windowWidth/19.05;
    } else if (windowWidth < 768) {
    	var fontSize = 50;
    // } else if (windowWidth >= 1770) {
    // 	var fontSize = 100;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
document.addEventListener('click', function(e) {
    var map = document.querySelector('#map-wrap iframe')
    if(e.target.id === 'map-wrap') {
        map.style.pointerEvents = 'all'
    } else {
        map.style.pointerEvents = 'none'
    }
})


// Видео для страницы how it works
$(function () {
    if ($(".youtube")) {
        $(".youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            var videoId = $(this).closest('.youtube').attr('id');
            var iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";
            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            var iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
                'width': $(this).width(),
                'height': $(this).innerHeight()
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }

});


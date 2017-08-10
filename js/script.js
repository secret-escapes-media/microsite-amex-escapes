(function ($, root, undefined) {$(function () {'use strict'; // on ready start
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
//        general
///////////////////////////////////////

  // css tricks snippet - http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  // inserts current year
  $('.js-year').html(new Date().getFullYear());

  // detects touch device
  if ("ontouchstart" in document.documentElement){
    $('html').addClass('touch');
  }


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage     = $('body').data('current-page'),
      currentCategory = $('body').data('current-category');

  // add class to individual nav item
  $('.page--' + currentPage + ' [class*=nav__item--' + currentPage + ']').addClass('is-current');

  // if there is a category, add class to category nav item
  if (currentCategory !== ''){
    $('.category--' + currentCategory + ' [class*=nav__item--' + currentCategory + ']').addClass('is-current');
  }


///////////////////////////////////////
//      SVG image swap
///////////////////////////////////////

  // finds image with class and swaps .png with .svg in img source string
  if (Modernizr.svgasimg) {
    var svgSwap = $('img.js-svg-swap');
    svgSwap.each( function() {
      var currentSrc = $(this).attr('src'),
          newSrc = currentSrc.replace('.png', '.svg');
      $(this).attr('src', newSrc);
    });
  }



///////////////////////////////////////
//      Parallax
//      [ example: <div class="parallax" data-parallax-speed="0.2"> ]
///////////////////////////////////////

$(document).scroll(function(){
  var scrolled = $(document).scrollTop();
  $('.js-parallax').each(function(){
    var speed = $(this).attr('data-parallax-speed');
    var offset = $(this).offset();
    var parallax = (scrolled - offset.top) * speed ;
    $(this).css('background-position', 'center ' + parallax + 'px');
  });
});

///////////////////////////////////////
//    Generic modal
///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal');

    // opens modal
    function modalOpen(event){
      event.preventDefault();
      // disable scrolling on background content (doesn't work iOS)
      $('body').addClass('disable-scroll');

      // picks out specific video modal if there is data on link
      if ($(event.target).data('video-modal')) {
        // get youtube id and target div
        var video     = $('.js-video-insert'),
            youtubeId = video.data('youtube-id');
        // open video modal
        $('.js-modal-youtube').fadeIn('250', function(){
          $(this).removeClass('is-closed').addClass('is-open');
          // insert the code into the target with the id and autoplay
          video.html('<iframe class="video__iframe" src="https://www.youtube.com/embed/'+ youtubeId +'?rel=0&amp;showinfo=0&autoplay=1" frameborder="0"></iframe>');
        });
      } else {
        // open modal
        modal.fadeIn('250', function(){
          $(this).removeClass('is-closed').addClass('is-open');
        });
      }
    }

    // closes modal
    function modalClose(event){
      event.preventDefault();
      // enable scrolling
      $('body').removeClass('disable-scroll');
      // close modal with fade
      $('.modal.is-open').fadeOut('250', function(){
        $(this).removeClass('is-open').addClass('is-closed');
      });
      // kill everything inside of video if its there
      $('.js-video-insert').empty();
    }

    // launches modal when offer is clicked
    modalLaunchBtn.on('click', function(event) {
      modalOpen(event);
    });

    // closes modal on close icon click
    modalCloseBtn.on('click', function(event) {
      modalClose(event);
    });

    // closes modal on background click
    modal.on('click', function(event) {
      if (event.target !== this){
        return;
      }
      modalClose(event);
    });

    // DUPLICATED - closes modal on background click
    $('.js-modal-youtube').on('click', function(event) {
      if (event.target !== this){
        return;
      }
      modalClose(event);
    });

    // closes modal on escape key press
    $(document).keyup(function(event) {
       if (event.keyCode == 27) {
         modalClose(event);
        }
    });


///////////////////////////////////////
//      Expand Interview
///////////////////////////////////////

$('.js-interview').hide();
$('.js-expand-interview-toggle').on('click',function(e){
  e.preventDefault();
  // finds closest interview
  var parent = $(this).closest('.interview'),
      interview = $('.js-interview',parent);

  // shows and hides interview
  interview.stop().slideToggle(600);

  // Toggles between the text content
  if ($(this).text() === 'Read Interview') {
    $(this).text('Hide Interview');
  } else {
    $(this).text('Read Interview');
  }
});


///////////////////////////////////////
//       Offer expiry countdown
///////////////////////////////////////

// loops through each offer on page and sets the current days remaining
$('.js-offer-expires').each(function() {
  // gets the expires date from the object
  var expires = $(this).data('expires');
  $(this).countdown(expires, function(event) {
    if (event.elapsed) {
      // the expired date is in the past so the expired message is removed
      $(this).remove();
    } else if (event.offset.totalDays === 0) {
      // there is 0 days left, just hours, so ends today
      $(this).html(event.strftime('Ending <strong>Today</strong>'));
    } else {
      // there are days left, outputs with either day or days
      $(this).html(event.strftime('Ending in <strong>%-D day%!D</strong>'));
    }
  });
});


///////////////////////////////////////
//    PERFECT BREAK GAME
///////////////////////////////////////

var game               = '.game',
    selectedClass      = 'is-selected',
    categoryOption     = 'js-game__category-option',
    selectedCategory   = '.'+categoryOption+'.'+selectedClass,
    submitCategoryBtn  = 'js-game__category-submit',
    userCategory       = '',
    userStyle          = '',
    categoryList       = 'js-game__category-list',
    styleList          = 'js-game__style-list',
    styleOption        = 'js-game__style-option',
    selectedStyle      = '.'+styleOption+'.'+selectedClass,
    submitStyleBtn     = 'js-game__style-submit',
    resetBtn           = 'js-game__reset';

var gameData = {
  "categories": [
      { "id": "city" },
      { "id": "stay" },
      { "id": "europe" },
      { "id": "coast" },
      { "id": "longhaul" }
    ],
  "styles": {
    "city": [
        { "id": "city-modern" },
        { "id": "city-historical" }
      ],
    "stay": [
        { "id": "stay-country" },
        { "id": "stay-coast" }
      ],
    "europe": [
        { "id": "europe-north" },
        { "id": "europe-south" }
      ],
    "coast": [
        { "id": "coast-beach" },
        { "id": "coast-city" }
      ],
    "longhaul": [
        { "id": "longhaul-asia" },
        { "id": "longhaul-america" }
      ]
    }
  };

// finds the most popular value in array
// when 2 2 1 is selected, the pair with an item that appears first in html wins
// if 1 1 1 1 1 (no duplicate) the first item in html value wins
function mostPopularValue(arr) {
  var freqs = {};
  var max_index;
  var max_value = -1/0; // Negative infinity.
  $.each(arr, function(i, v) {
    if (freqs[v] != undefined) {
      freqs[v]++;
    } else {
      freqs[v] = 1;
    }
  });
  $.each(freqs, function(num, freq) {
    if (freq > max_value) {
      max_value = freq;
      max_index = num;
    }
  });
  if (max_index != undefined) {
    return max_index;
  }
}

function randomiseList(list) {
  $(list).each(function(){
    // get current ul
    var $ul = $(this);
    // get array of list items in current ul
    var $liArr = $ul.children('li');
    // sort array of list items in current ul randomly
    $liArr.sort(function(a,b){
      // Get a random number between 0 and 10
      var temp = parseInt( Math.random()*10 );
      // Get 1 or 0, whether temp is odd or even
      var isOddOrEven = temp%2;
      // Get +1 or -1, whether temp greater or smaller than 5
      var isPosOrNeg = temp>5 ? 1 : -1;
      // Return -1, 0, or +1
      return( isOddOrEven*isPosOrNeg );
    })
    // append list items to ul
    .appendTo($ul);
  });
}

function createCategoryList() {
  var categoriesAvailable = (gameData.categories.length)-1,
      categoryCounter     = 0,
      imageCounter        = 1;
  // create 20 options using the game categories
  for (var i = 1; i <= 20; i++) {
    // adds a list item of game category to list
    $('.'+categoryList).append('<li class="game__option js-game__category-option" data-category="' + gameData.categories[categoryCounter].id + '" style="background-image:url(../img/content/perfect-summer-break/categories/'+gameData.categories[categoryCounter].id+'-'+imageCounter+'.jpg);"></li>');
    // loops through the amount of available categories if
    if (categoryCounter == categoriesAvailable) {
      // there are no more categories left, back to start
      categoryCounter = 0;
      imageCounter++;
    } else {
      // go to the next category
      categoryCounter++;
    }
  }
  // put list items in a random order
  randomiseList('.'+categoryList);
}

function createStyleList() {

  var categoryStyle   = gameData.styles[userCategory],
      stylesAvailable = (categoryStyle.length)-1,
      stylesCounter   = 0,
      imageCounter    = 1;

  // create 12 options using the game categories
  for (var i = 1; i <= 12; i++) {
    // adds a list item of game category to list
    $('.'+styleList).append('<li class="game__option js-game__style-option" data-style="' + categoryStyle[stylesCounter].id + '" style="background-image:url(../img/content/perfect-summer-break/styles/'+categoryStyle[stylesCounter].id+'-'+imageCounter+'.jpg);"></li>');

    // loops through the amount of available categories if
    if (stylesCounter == stylesAvailable) {
      // there are no more categories left, back to start
      stylesCounter = 0;
      imageCounter++;
    } else {
      // go to the next category
      stylesCounter++;
    }
  }
  // put list items in a random order
  randomiseList('.'+styleList);

}







// STARTS HERE /////////////////////////////////////////////////////////////////

// deletes the no JS message builds and shows the first category section?????
// hide style and result screens (.row)
createCategoryList();
$('.game__style, .game__result, .result').hide();

////////////////////////////////////////////////////////////////////////////////

// function for selecting category options
$('body').on('click', '.'+categoryOption, function() {
  if ($(selectedCategory).length === 5){
    // Do nothing when 5 options are already selected
    if ($(this).hasClass(selectedClass)) {
      // allow unselecting options once limit reached
      $(this).removeClass(selectedClass);
    }
  } else {
    // no limit reached, allow selection
    $(this).toggleClass(selectedClass);
  }
  // add visual feedback when 5 options are selected
  if ($(selectedCategory).length == 5){
    $('.'+categoryList).addClass('has-limit');
    $('.game__category').addClass('has-limit');
  } else {
    $('.'+categoryList).removeClass('has-limit');
    $('.game__category').removeClass('has-limit');
  }
});

// submit function for category
$('body').on('click', '.'+submitCategoryBtn, function() {
  // collect selected categories
  var selectedCategories = [];
  $(selectedCategory).each(function() {
    // put each answer into array
    selectedCategories.push($(this).data('category'));
  });
  // stores user's most selected category
  userCategory = mostPopularValue(selectedCategories);
  // build the list of options for the style section
  createStyleList();
  $('.js-game-chosen-category').text(userCategory);
  $('.game__style').show();
  $('.game__category').hide();
  // scroll back to the top of the game section
  $('html,body').scrollTop( $('.game').offset().top );
});

// function for selecting style options
$('body').on('click', '.'+styleOption, function() {
  if ($(selectedStyle).length >= 5){
    // Do nothing when 5 options are already selected
    if ($(this).hasClass(selectedClass)) {
      // allow unselecting options once limit reached
      $(this).removeClass(selectedClass);
    }
  } else {
    // no limit reached, allow selection
    $(this).toggleClass(selectedClass);
  }
  // add visual feedback when 5 options are selected
  if ($(selectedStyle).length == 5){
    $('.'+styleList).addClass('has-limit');
    $('.game__style').addClass('has-limit');
  } else {
    $('.'+styleList).removeClass('has-limit');
    $('.game__style').removeClass('has-limit');
  }
});

// submit function for style
$('body').on('click', '.'+submitStyleBtn, function() {
  // collect selected categories
  var selectedStyles = [];
  $(selectedStyle).each(function() {
    // put each answer into array
    selectedStyles.push($(this).data('style'));
  });
  // stores user's most selected category
  userStyle = mostPopularValue(selectedStyles);
  // show the user's result
  $('.game__result').show();
  $('.js-result-' + userStyle).show();
  $('.game__style').hide();
  $('.game').addClass('game--complete');
  // scroll back to the top of the game section
  $('html,body').scrollTop( $('.game').offset().top );
});

// Reset the game at the results screen
$('body').on('click', '.'+resetBtn, function() {
  $('.game').removeClass('game--complete');
  // remove the previous lists
  $('.'+styleList+', .'+categoryList).removeClass('has-limit').empty();
  $('.game__category, .game__style').removeClass('has-limit');
  // hide the previous screens
  $('.game__style, .game__result, .result').hide();
  // rebuild the category selection & show
  createCategoryList();
  $('.game__category').show();
  $('html,body').scrollTop( $('.game').offset().top );
});


// When submit is clicked the result for category is taken
// if 2,2,1 is the case then 50/50 between each of the 2 category
// with category selected, fill the options of the style list
// The category styles need to be retreaved from somewhere?
// create two options and duplicate so there are tweleve options
// the category page is hidden and the style page is shown
// same clicking funtion as before, 3 to be selected this time
// when submit is clicked the result for the style is done
// the category and style are inserted into the result
// also the product with the correct tags and description is inserted as well
// the style page is hidden and the result page is shown
// also a link to look at the collection / other options that fit the category and style
// There is either a start again option, or a switch results / see all results




///////////////////////////////////////
//      Game message fixed
///////////////////////////////////////

function offsetMsg(){
  // gives padding to the game wrap which goes underneath the
  // absolute positioned message
  var msgHeight = $('.game__message').outerHeight();
  $('.game__wrap').css('padding-top', msgHeight + 'px');
}
$(document).ready(function(){ offsetMsg(); });
$(window).resize(function(){ offsetMsg(); });

function stickMsg(){
  var st = $(document).scrollTop();
  var trigger = $('.game__wrap');
  var distance = trigger.offset().top;
  var end = distance + trigger.height();
  var msg = $('.game__message');

  // pin message to the top when scrolled to .game__wrap
  if( st > distance && st < end ){
    msg.addClass('game__message--fixed');
  }else{
    msg.removeClass('game__message--fixed');
  }
  // pin message to the bottom of the game when you scroll too far
  if( st > end ){
    msg.addClass('game__message--end');
  }else{
    msg.removeClass('game__message--end');
  }
}
if( $('body').hasClass('page--perfect-summer-break') ){
  $(document).scroll(function() { stickMsg(); });
}





///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end
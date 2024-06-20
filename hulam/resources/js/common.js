$(document).ready(function () { 
  let headerH = $('header').outerHeight(true);
  //if($("[data-numcounter]")){numberCount("[data-numcounter]")};
  if ($(".line_tab") || $(".vertical_tab")) { LineTabMenuInit() }
  if ($(".btn_toggle").find("input[disabled='true']")) { toggleBtnDisabled() }
  if($('.file_uploader')){ fileUploader() }
  if($('.input_writing_group textarea')){ initCountString() }
  if ($('.progress_bar')) { progressBarUI() }
  if ($('.pagination').length > 0) { paginationUI() }
  if($('header').length >= 1){ gnbEvent(); }
  if ($('footer .btn_srl_top').length > 0) { scrollTopBtn() }
  if( $('.marquee').length > 0){ marqueeClone() }
  if( $('.main_type').length > 0){ mainMoSwiper(); mainHdScroll(); }  
  if( $('.pricing_list').length > 0){ priceMoSwiper(); }  
  if( $('.sec_visual').length > 0){ removeVisBtn(); }  

  $(".sec_price_comparison .tab_list").click(function(){
    let index = $(this).data('tab');
    let scrollEl = $('.sec_price_comparison').find('.table_wrap');
    let scrollOff = scrollEl.find('.' + index).position().left - $('.mo_focus').outerWidth();
    scrollEl.scrollLeft(scrollOff)
  })

   /****** Tab Menu ******/
   $('.tab_menu .tab_list').click(function () { tabMenu(this) });

   function tabMenu(el) {
      var tab = $(el).parents('.tab_menu');
      var activeTab = $(el).attr('data-tab');
      $(el).siblings('li').removeClass('current');
      $(el).addClass('current');
      tab.next('.tab_cont').find('.tab_cont_item').stop().hide().removeClass('current');
      tab.next('.tab_cont').find('#' + activeTab).stop().show().addClass('current');

      if (tab.hasClass("line_tab") || tab.hasClass("vertical_tab")) {
         //클릭시 라인이동
         var tab = $(el).parents('.tab_menu');
         var tabBar = $(el).parents('.tab_menu').find('.tab_bar');
         if (tab.hasClass("line_tab")) {
            var liWidth = tab.find(".current").outerWidth();
            var marginLeft = parseInt(tab.find(".current").css("margin-left"));
            var left = tab.find(".current").position().left + marginLeft;
            tabBar.css({
               "width": liWidth,
               "left": left
            });
         } else if (tab.hasClass("vertical_tab")) {
            var liH = tab.find(".current").outerHeight();
            var marginTop = parseInt(tab.find(".current").css("margin-top"));
            var top = tab.find(".current").position().top + marginTop;
            tabBar.css({
               "height": liH,
               "top": top
            });
         }
      }
   }

   //Line Tab 초기화
   function LineTabMenuInit() {
      var tabM = $('.tab_menu');
      var lineTab = $('.line_tab');
      var verticalLineTab = $(".vertical_tab");
      if (tabM.hasClass("line_tab") || tabM.hasClass("vertical_tab")) {
         tabM.each(function () {
            if (tabM.find('.tab_bar').length < 1) {
               tabM.find('ul').append("<div class='tab_bar'></div>");
            };
         });
      }
      lineTab.each(function () {
         tabM.find('.tab_bar').css({
            "width": $(this).find(".current").outerWidth(),
            "left": $(this).find(".current").position().left + parseInt($(this).find(".current").css("margin-left"))
         });
      })
      verticalLineTab.each(function () {
         tabM.find(".tab_bar").css({
            "height": $(this).find(".current").outerHeight(),
            "top": $(this).find(".current").position().top + parseInt($(this).find(".current").css("margin-top"))
         });
      })
   };

   /****** Toggle Button ******/
   $('.btn_toggle').click(function () {
      if($(this).next('.btn_toggle_txt')){toggelBtnText(this)}
   })
   //Toggle Button Change Text
   function toggelBtnText(el){
      var toggleON = $(el).find('input[type=checkbox]').is(":checked");
      var toggleText = $(el).next('.btn_toggle_txt');
      var toggleTextValue = $(el).next('.btn_toggle_txt').text();
      if (toggleON) {
         if (toggleTextValue == 'OFF') {
            toggleText.text('ON');
         } else if (toggleTextValue == 'Unchecked toggle') {
            toggleText.text('Checked toggle');
         }
      } else {
         if (toggleTextValue == 'ON') {
            toggleText.text('OFF');
         } else if (toggleTextValue == 'Checked toggle') {
            toggleText.text('Unchecked toggle');
         }
      }
   }
   //Toggle Button Disabled
   function toggleBtnDisabled() {
      $('.btn_toggle').each(function (index, item) {
         var toggleDis = $(item).find('input[type=checkbox]').is(":disabled");
         if (toggleDis) {
            $(item).addClass('disabled');
         } else {
            $(item).removeClass('disabled');
         }
      });
   }

   /****** File Uploader ******/
   function fileUploader(){
      $('.file_uploader').each(function (index, item) {
         $(item).find('.file_name .input_delete').on('click', function () {
            $(this).parents('.file_name').remove();
         });
         $(item).find('.input_file').on('change', function () {
            var fileCheck = $(this).val();
            if (fileCheck == '') {
               alert("파일을 첨부해 주세요");
            } else {
               var $div = $('<div class="file_name"><input type="text" readonly><i class="input_delete" onclick="removeFilename(this)"></i></div>');
               $(item).append($div);
               var fileName = $(this).val();
               //경로가 있는경우
               //$div.find('input').val(fileName);
               //경로가 없어야 하는 경우
               fileName = fileName.split("\\");
               $div.find('input').val(fileName[fileName.length - 1]);
            }
         });
      });
   }


   /****** Select Box ******/
   $(document).on('click', '.select_box_value', function (e) {
      const t = $(this);
      if ($(this).parents('.select_box').hasClass('on')) {
         dropDownClose(t);
      } else {
         if ($(this).parents('.select_box').hasClass('disabled')) {
            return false;
         }
         $('.select_box').removeClass('on');
         selectBoxDown(t);
      }
   });
   $(document).on('click', '.select_box_list li', function (e) {
      selectBoxDownAction(this);
      SelectBoxChange(this);
   });

   function selectBoxDown(t) {
      const $selectBox = t.parents('.select_box');
      if (!t.hasClass('disabled')) {
         if ($selectBox.hasClass('on')) {
            $selectBox.removeClass('on')
         } else {
            $selectBox.addClass('on');
            $selectBox.siblings('.select_box').removeClass('on');
         }
         $('body').on('click', function (e) {
            if ($(e.target).closest('.select_box').length === 0 && $('.select_box').hasClass('on')) {
               dropDownClose()
            }
         });
      };
   };

   function selectBoxDownAction(el) {
      $(el).parents('.select_box_list').find('li').removeClass('selected');

      if (!$(el).parent('li').hasClass('disabled')) {
         $(el).addClass('selected');
      }
      $(el).parents('.select_box').removeClass('on')
   };

   function dropDownClose() {
      $('.select_box').removeClass('on');
   };
   //Change Select Box Value
   function SelectBoxChange(selectItem) {
      if ($(selectItem).find('ul').length <= 0) {
         var $cloneEle = $(selectItem).parents('.select_box').find('.select_box_value').children('span').children();
         var selectText = $(selectItem).text();
         clearInput(selectItem);
         $(selectItem).parents('.select_box').find('.select_box_value').children('span').text(selectText);
         $(selectItem).parents('.select_box').find('.select_box_value').children('span').append($cloneEle);
      }
   };

   function clearInput(obj) {
      $(obj).parents('.select_box').find('.select_box_value').children('span').text("");
   };


   /****** Accordion ******/
   $(".accord_head").click(function (){accordionUI(this)});
 
   /****** Data Tables ******/
   $('.dataTables_wrapper .dataTables_length').click(function () {
      $(this).toggleClass('on');
   });
   $('body').on('click', function (e) {
      if ($(e.target).closest('.dataTables_length').length === 0 && $('.dataTables_length').hasClass('on')) {
         $('.dataTables_length').toggleClass('on');
      }
   });

   /****** TextArea String Length Count ******/
   $(".input_writing_group").find('textarea').on('keyup', function () {CountString(this)});
   //textarea 기존 값이 있는 경우 Count String
   function initCountString(){
      $('.input_writing_group').each(function (index, item) {  
         var st = $(item).find('textarea').val();
         $(item).find('.txt_count').find('.current').html(st.length)
      });
   }
   //Count String
   function CountString(el){
      var regex = /[^0-9]/g; //숫자추출 정규식
      var total = $(el).next('.txt_count').find('.total').html().replace(regex, "");
      $(el).next('.txt_count').find('.current').html($(el).val().length);
      if ($(el).val().length > total) {
         alert(total + '자 이내로 작성해주세요')
         $(el).val($(el).val().substring(0, total));
         $(el).next('.txt_count').find('.current').html(total);
      };
   }

   /****** Progress bar ******/
   function progressBarUI(){
      $(".progress_bar").each(function (i, block) {
         var regex = /[^0-9]/g; //숫자추출 정규식
         var progressR = $(block).html().replace(regex, "");//끝 값   
         var width = 0; //시작값
         var id = setInterval(frame, 15);//너비, 숫자표시 증가속도
         function frame() {
            if (progressR >= 100) {
               progressR = 100;
               $(block).css('width', 100 + '%'); //너비       
            }
            if (width >= progressR) {
               clearInterval(id);
               cnt = 0;
            } else {
               width++;
               $(block).css('width', width + '%'); //너비
               $(block).find('.progress_ratio').html(width + '%');  //숫자 표시
            }
         }
      });
   }

   /****** Pagination ******/

   function paginationUI(){
      $('.pagination').each(function (index, item) {
         $(item).find('a').on('click', function () {
            if(!$(this).hasClass('arr')){
               $(this).siblings().removeClass('active')
               $(this).addClass('active');
            }
         });
      });
   }

   /****** Modal ******/
   let openModalBtn = $('.btn_modal_open');
   let modalContainer = $('.modal_container');
  
   openModalBtn.click((e) => { e.preventDefault(); openModal(e.target) }); //open modal
   modalContainer.on('click', '.btn_modal_close, .modal_overlay', (e)=>{ //close modal
     e.preventDefault();
     closeModal(e.target);
   })   
   
   let timer = null;

  function openModal(el){
    const modalName = $(el).attr('id');
    let thisModal = $(".modal_container[data-modal='" + modalName + "']")
    let documentH = $(document).height();
  
    thisModal.removeAttr("aria-hidden").addClass('open');
    $("body").addClass("no_scroll");

    modalPosition(thisModal)
    $(el).find('.modal_overlay').css('height' , documentH)
  }

  function closeModal(el){
    $(el).parents(".modal_container").attr("aria-hidden","true").removeClass('open');
    $("body").removeClass("no_scroll");
  }

  function modalPosition(el){
    let windowH = $(window).height();
    let modal;
    el == true ?  modal = $(el) :  modal = $(".modal_container.open");
    const modalH = modal.find('.modal_content').height();
    const overlay = modal.find('.modal_overlay');
    const content = modal.find('.modal_content');
    
    if( modalH >= windowH - 100 ){
      overlay.css('height', modalH + 100);
      content.css({'position':'fixed','top':'50px'});
      modal.scrollTop(0);
    }else if( modalH < windowH ){
      modal.find('.modal_overlay').css('height', windowH);
      content.css({'position':'relative','top':'auto'});
    }
  }

 /**** Window Resize  ****/ 
  $(window).on('resize', function(){
    headerH = $('header').outerHeight(true);
    clearTimeout(timer);
    //resize Modalposition
    timer = setTimeout(modalPosition, 50);
  })//resize

  /**** Window Scroll ****/
  $("[data-numcounter]").each(function () {
    let elBtm = $(this).offset().top + $(this).height();
    if( $(window).height() > elBtm){
      numberCount(this)
    }
  })
  $(window).on('scroll', debounce(scrollAction))
  
}) //ready


/**** Functions ****/
function scrollAction(){
  const viewportBtm = $(window).height() + $(window).scrollTop();
  //NumberCount scroll Action
  let numCounter = $("[data-numcounter]");
  numCounter.each(function () {
    let elBtm = $(this).offset().top
    if(viewportBtm - 200 > elBtm){
      numberCount(this)
    }
  });

  //Fade scroll Action
  const fadeUpEl = $("[class*='fade']");
  const fadeInEl = $(".fadeIn");
  fadeUpEl.each(function(){
    const ElHalfBtm = $(this).offset().top + $(this).height() * 0.25;
    if (viewportBtm > ElHalfBtm ) {
      $(this).addClass("active");
    }
  });

    var movingScroll = $(window).scrollTop() - $('.sec_solution').offset().top;
    var movingAmount = -parseInt(movingScroll/5)
    $('.sec_solution').find('.img_back').css({'transform' : 'translate3d(-50%,'+ movingAmount +'px,0)'})
}
function accordionUI(el){
  if($(el).find(".accord_cont").length < 1){
    return false;
  }
  if(!$(el).hasClass("on")){
    $(el).parents('.accord_list').find('.accord_head').removeClass("on");
    $(el).parents('.accord_list').find(".accord_cont").slideUp({duration: 500,easing: 'linear'});
    $(el).addClass("on");
    $(el).find(".accord_cont").slideDown({duration: 500,easing: 'linear'});
    return false
  }

  if ($(el).hasClass("on")) {
    $(el).removeClass("on");
    $(el).find(".accord_cont").slideUp({duration: 500,easing: 'linear'});
    return false
  }
}

//File Uploader - Remove Choosed File
function removeFilename(t) {
   $(t).parents('.file_name').remove();
};

//DataTable Select All row
function dataTableSelect(dtable) {
   var dtable = dtable;
   $(".dataTable  .checkall").prop("checked", false);
   $(".checkall").click(function () {
      if ($(this).prop("checked")) {
         dtable.rows().select();
      } else {
         dtable.rows().deselect();
      }
   });
};

//GNB hover
function gnbEvent(){
  let gnbBreak = 1280;
  let wW = $(window).width();
  let timer;
  //GNB Responsive Resizing
  $(window).resize(function () { 
    clearTimeout(timer);
    let afterwW = $(window).width();
    if(afterwW - gnbBreak > 0){
      $('nav').removeClass('mo_active');
      $('.btn_hamburger').removeClass('is_open');
      $('.depth_1').removeClass('open')
      timer = setTimeout(gnbHover, 100);
    }else{
      timer = setTimeout(gnbClick, 100);
    }
  });
  if(wW - gnbBreak > 0){
    gnbHover();
  }else{
    gnbClick();
  }
  //GNB PC Hover event
  function gnbHover(){
    $('.depth_1').off('click')
    $('.depth_1').on('mouseover', function(e){
      $(this).addClass('open');    
    }).on('mouseleave', function(e){
      $(this).removeClass('open');
    });
  }
  //GNB MO Click event
  function gnbClick(){
    $('.depth_1').off('mouseover mouseleave')
    $('.depth_1').click(function(e){
      if($(this).find('.is_depth').length <=0){return false;}
      $('.depth_1').not(this).removeClass('open');
      $(this).toggleClass('open');
    })
  }
  //Hamburger Button
  $('header .btn_hamburger').click(function(){
    if($(this).hasClass('is_open')){
      $(this).removeClass('is_open')
      $(this).addClass('is_closed')
      $('body').removeClass('no_scroll')
      $('nav').removeClass('mo_active');
    }else{
      $(this).removeClass('is_closed')
      $(this).addClass('is_open')
      $('body').addClass('no_scroll') 
      $('nav').addClass('mo_active');
    }
  })
}

//Main Header Scroll Interaction
function mainHdScroll() {
  if($('.main_type').length > 0){
    $('header').addClass('bg_transparent');
    $(window).scroll(function(){
      let st = $(window).scrollTop();
      let timer;
      clearTimeout(timer);
      timer = setTimeout(function(){
        if(st > 0){
          $('header').addClass('scrolled')
          $('header').removeClass('bg_transparent')
        }else{
          $('header').addClass('bg_transparent')
          $('header').removeClass('scrolled')
        }
      }, 100);
    })
  }
}
//Scroll Top
function scrollTopBtn() {
  $('.btn_srl_top').click(function(){
    $('html, body').animate({
      scrollTop: 0
    },1000)
  })
}
//Number Counter Animation
function numberCount(el){
  const speed = 500;
  $(el).each(function(){
    const animate = () => {      
      const regex = /[^0-9]/g; //숫자추출 정규식
      const value = + $(this).data('numcounter').toString().replace(regex, "");
      const data = + $(this).text().replace(regex, "");
      const time = value / speed;
      if(data < value) {
        $(this).text(formatNumber(Math.ceil(data + time)))
        setTimeout(animate, 1);
      }else{
        $(this).text(formatNumber(value))
      }
    }
    animate();
  });
}
//Number Format 0,000
function formatNumber(num){
  let number = String(num)
  if (number.length >= 4){
    var reversed = number.split('').reverse();
    var threes = -1;
    var numberArray = [];
    for (i of reversed){
      threes += 1
      if (threes == 3) {
        numberArray.push(',');
        threes = 0;
      }
      numberArray.push(i);
    }
    return numberArray.reverse().join('');
  } else {
    return number;
  }
}
//MarqueeClone
function marqueeClone(){
  let el = $('.marquee');
  el.each(function () {
    let elChild = $(this).find('.marquee_group').html();
    let cloneGroup = $(elChild).clone();
    let clonedDiv =  $('<div aria-hidden="true" class="marquee_group"></div>');
    clonedDiv.append(cloneGroup)
    $(this).append(clonedDiv);
  });
}
//Main Mo Swiper
function mainMoSwiper(){
  let mySwiper1 = undefined;
  let mySwiper2 = undefined;
  let mySwiper3 = undefined;
  function moSwiper(){
    let ww = $(window).width();
    if(ww <= 768){
      if(mySwiper1 == undefined){
        mySwiper1 = new Swiper('.sec_service .swiper', {
          slidesPerView:1.15,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.sec_service .swiper-pagination',
          }, 
        });
      }
      if(mySwiper2 == undefined){
        mySwiper2 = new Swiper('.sec_solution .swiper', {
          slidesPerView:1.25,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.sec_solution .swiper-pagination',
          }, 
        });
      }
      if(mySwiper3 == undefined){
        mySwiper3 = new Swiper('.sec_example .swiper', {
          slidesPerView:1.15,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.sec_example .swiper-pagination',
          }, 
        });
      }
    }else{
      if(mySwiper1 != undefined){
        mySwiper1.destroy();
        mySwiper1 = undefined;
      }
      if(mySwiper2 != undefined){
        mySwiper2.destroy();
        mySwiper2 = undefined;
      }
      if(mySwiper3 != undefined){
        mySwiper3.destroy();
        mySwiper3 = undefined;
      }
    }
  }
  moSwiper();
  let timer;
  $(window).on('resize', function(){
    clearTimeout(timer);
    timer = setTimeout(moSwiper, 100);
  })//resize
}
//Main Visual Btn Remove
function removeVisBtn(){
  if($(window).width()<=768){
    let timer;
    clearTimeout(timer);
    $(window).scroll(function(){
      let st = $(window).scrollTop();
      if(st > 0){
        timer = setTimeout(function(){
          $('.sec_visual .btn_group').addClass('fadeOut');
          $('.sec_visual .btn_group').removeClass('fadeUp');
        }, 100);
      }else{
        timer = setTimeout(function(){
          $('.sec_visual .btn_group').addClass('fadeUp');
          $('.sec_visual .btn_group').removeClass('fadeOut');
        }, 100);
      }
    })
  }
}
//Price Mo Swiper
function priceMoSwiper(){
  let priceSwiper1 = undefined;
  let priceSwiper2 = undefined;
  function priceMoSw(){
    let ww = $(window).width();
    if(ww <= 768){
      if(priceSwiper1 == undefined){
        priceSwiper1 = new Swiper('.price_swiper1', {
          slidesPerView:1.15,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.price_swiper1 .swiper-pagination',
          }, 
        });
      }
      if(priceSwiper2 == undefined){
        priceSwiper2 = new Swiper('.price_swiper2', {
          slidesPerView:1.15,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.price_swiper2 .swiper-pagination',
          }, 
        });
      }
    }else{
      if(priceSwiper1 != undefined){
        priceSwiper1.destroy();
        priceSwiper1 = undefined;
      }
      if(priceSwiper2 != undefined){
        priceSwiper2.destroy();
        priceSwiper2 = undefined;
      }
    }
  }
  priceMoSw();
  let timer;
  $(window).on('resize', function(){
    clearTimeout(timer);
    timer = setTimeout(priceMoSw, 100);
  })//resize
}
//Debounce
function debounce(func, wait = 10, immediate = true) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
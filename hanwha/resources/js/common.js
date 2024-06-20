$(document).ready(function () { 
  smoothScroll(); 
  if ($(".line_tab") || $(".vertical_tab")) { LineTabMenuInit() }
  if ($(".btn_toggle").find("input[disabled='true']")) { toggleBtnDisabled() }
  if($('.file_uploader')){ fileUploader() }
  if($('.input_writing_group textarea')){ initCountString() }
  if ($('.progress_bar')) { progressBarUI() }
  if ($('.pagination').length > 0) { paginationUI() }
  if( $('.marquee').length > 0){ marqueeClone() }
  if($('header').length >= 1){headerScroll(); gnbEvent();choiceLang();}
  if($('.sub_exist').length > 0 ){
    $('body').addClass('no_white_header');
    $('header').removeClass("t_white")
  }
  if ($('footer').length > 0) { 
    let g_footer = undefined;
    let ftH = $('.f_top').innerHeight() + $('.f_btm').innerHeight();
    let ftPt = $('footer').css('padding-top');
    if($(window).innerWidth()<= 768){
      ftH = $('.f_btm').innerHeight();
    }
    footerGsap(ftH, ftPt)
  };
  if ($('footer .btn_srl_top').length > 0) { scrollTopBtn() }
  if($('[data-anchor]').length> 0) movingAnchor();  
   /****** Tab Menu ******/
   $('.tab_menu .tab_list').click(function () { tabMenu(this) });

   function tabMenu(el) {
      var tab = $(el).parents('.tab_menu');
      var activeTab = $(el).attr('data-tab');
      $(el).siblings('li').removeClass('current');
      $(el).addClass('current');
      tab.next('.tab_cont').find('.tab_cont_item').stop().hide();
      tab.next('.tab_cont').find('#' + activeTab).stop().show();

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
            if ($(this).find('.tab_bar').length < 1) {
               tabM.append("<div class='tab_bar'></div>");
            };
         });
      }
      lineTab.each(function () {
         $(this).find('.tab_bar').css({
            "width": $(this).find(".current").outerWidth(),
            "left": $(this).find(".current").position().left + parseInt($(this).find(".current").css("margin-left"))
         });
      })
      verticalLineTab.each(function () {
         $(this).find(".tab_bar").css({
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

  //header lang choice
  function choiceLang() {    
    $(document).on('click', function (e) {
      if( $(e.target).is('.ico_global')){
        if(!$('.h_language').hasClass('open')) {
          $('.h_language').addClass('open');
        }else{
          $('.h_language').removeClass('open');
        }
      }else{
        $('.h_language').removeClass('open');
      }
    })
  }

  //Site Map Accordion
  const siteHead= $(".site_map .accord_head");
  if( $(window).outerWidth() > 768){
    $(".site_map .accord_head").off('click');
  }



 /**** Window Resize  ****/ 
  $(window).on('resize', function(){
    headerH = $('header').outerHeight(true);
    clearTimeout(timer);
    //resize Modalposition
    timer = setTimeout(modalPosition, 50);

    //resize SiteMapAccordion
    timer = setTimeout(siteAccord, 200);
    function siteAccord(){
      let wW =   $(window).outerWidth();
      $(".site_map .accord_cont").css('display', 'none')
      if(wW > 768){
        siteHead.off('click');
        siteHead.removeClass('on')
      }else{
        siteHead.on('click', function(){accordionUI(this)});
      }
    }

    //resize footer Gsap
    ftH = $('.f_top').innerHeight() + $('.f_btm').innerHeight();
    ftPt = $('footer').css('padding-top');  
    if($(window).innerWidth()<= 768){ftH = $('.f_btm').innerHeight();}
    timer = setTimeout(function(){footerGsap(ftH, ftPt);}, 200);

  })//resize
  
 /**** Window Scroll  ****/ 
  $(window).on('scroll', debounce(scrollAction));

}) //ready


/**** Functions ****/
function scrollAction(){
  let viewportBtm = $(window).height() + $(window).scrollTop();
  let headerH = $('header').outerHeight(true);

  if($(window).scrollTop() <= 0 && $('.sub_exist').length > 0){
    $('body').addClass('no_white_header');
  }

  //Fade scroll Action
  const fadeUpEl = $("[class*='fade']");
  fadeUpEl.each(function(){
    if($(this).parents('.sec_closing')){
      return false
    }
    if($(this).hasClass('mo_action') && $(window).width() > 768){
        return false;
    }else{
      const ElHalfBtm = $(this).offset().top ///+ $(this).height() * 0.25;
      if (viewportBtm > ElHalfBtm ) {
        $(this).addClass("active");
      }
     
    } 
  });
  /*   var movingScroll = $(window).scrollTop() - $('.sec_solution').offset().top;
    var movingAmount = -parseInt(movingScroll/5) */

  //exist subpage Scroll menu
  if ($('.sub_menu').length > 0) existSubmenu();
  function existSubmenu(){
    let fixedST = $('.sec_devotion').offset().top;
    let fixedET = $('.sec_closing').offset().top;

    if($(window).scrollTop() >= fixedST){
      $('.sub_menu').addClass('fixed');
      $('.parallax').each(function(){
        let start = $(window).scrollTop() >= $(this).offset().top - headerH;
        let end = $(window).scrollTop() > ($(this).offset().top + $(this).height());
        if( start ) $('.sub_menu').addClass('type_white');
        if(end) $('.sub_menu').removeClass('type_white');
      })
    }else if($(window).scrollTop() >= fixedET){
      $('.sub_menu').removeClass('fixed')
    }else{
      $('.sub_menu').removeClass('fixed');
    };

    $('.sub_menu li').each(function(){
      let anchor = $(this).attr('data-anchor')
      let targetT = $("#" + anchor).offset().top;
      if($(window).scrollTop() >= targetT){
        $('.sub_menu li').removeClass('active');
        $(this).addClass('active')
      }
    });
    
  } 
}//scrollAction()

function movingAnchor(){
  $('[data-anchor]').on('click',function(){
    $(this).siblings().removeClass('active')
    var anchorId = $(this).attr('data-anchor');
    //$(this).addClass('active')
    scrollToAnchorTab(anchorId);
  });
}

function scrollToAnchorTab(targetId, speed) {
    if( !speed ) var speed = 'slow';
    var target = $("#" + targetId);
    if(target.length > 0){
      $('html, body').animate({
          scrollTop: target.offset().top
      }, speed);
    }
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

function gnbEvent(){
  $('.gnb').on('mouseover', function(e){
    let menuH = 0;
    if($(e.target).is('.depth_1 > li > a')){
      gnbPointer(e.target)
      if($(e.target).siblings('.depth_2').length <= 0 || $(e.target).siblings('.depth_2').find('li').length <= 0){
        $('header').addClass('short');
      }else{
        $('header').removeClass('short');
      };
      $('.depth_2').removeClass('open');
      $(e.target).siblings('.depth_2').addClass('open');
      menuH = $(e.target).siblings('.depth_2').outerHeight();
      $('.gnb_hover').css('paddingBottom', `${menuH} - 36px`);
      $('.gnb_hover').css('paddingBottom', menuH);
    }
    $('header').addClass('gnb_hover');
  });
  $('header').mouseleave(function () {
    $('.gnb_hover').css('paddingBottom', 0);
    $('.depth_2').removeClass('open');
    $('header').removeClass('gnb_hover');
  });
}
//gnb pointer
function gnbPointer(target){
  let $pos = parseInt($(target).parents('li').position().left + 16);
  let $menuW = $(target).width();
  $('.gnb_pointer').css('width', `${$menuW}px`)
  $('.gnb_pointer').animate({
    width: $menuW,
    left: $pos 
  }, 100, 'linear');
}

//header Scroll Interaction
function headerScroll() {
  gsap.registerPlugin(ScrollTrigger);

  //스크롤 방향 헤더 움직임
  const headerScroll = gsap.from('header', {
    yPercent:-100,
    paused: true,
  }).progress(1);
  
  ScrollTrigger.create({
     //scroller: '#wrap',
    start: "top top",
    end: "max",
    //markers:true,
    onUpdate: (self) => {
      document.querySelector('.h_language').classList.remove('open');
      self.direction === -1 ? headerScroll.play() : headerScroll.reverse();
    }
  });
  
  //아래로 스크롤 되면 헤더 숨기기 //스크롤 젤 상단에서 헤더 투명하게
  gsap.to("header", {
    scrollTrigger: { //트리거 지정해서 스크롤 애니메이션 주기
      trigger: 'header',
      start: '100% top',
      endTrigger:'html',
      end: '+= element.height',
      //markers: true,
      //toggleActions:첫 입장(enter) 첫 퇴장(leave) 재입장(reEnter) 재퇴장(reLeave)
      toggleActions:"play",
      toggleClass: 't_white',
      //scroller: '#wrap',
    },
  })
  
  $('.h_allmenu button').click(function(){    
    if($(this).hasClass('is_open')){
      $(this).removeClass('is_open')
      $(this).addClass('is_closed')
      $('body').removeClass('no_scroll')
      $('.site_map').delay(300).fadeOut(300);
      $('.gnb').removeClass('hidden');
      $('header').removeClass('mo_sitemap_on');
    }else{
      $(this).removeClass('is_closed')
      $(this).addClass('is_open')
      $('body').addClass('no_scroll') 
      $('.site_map').fadeIn(300);
      $('.gnb').addClass('hidden');
      $('header').addClass('mo_sitemap_on');
    }
  })
  //$('.site_map')
}//headerScroll()

//Main Video Control
window.addEventListener('load', function(){
  if($('.main_type video').length > 0){ mainVideo()};
})
function mainVideo(){
  const videoDuration = document.querySelector('video').duration;
  const MainVideo = $('.sec_visual').find('video').get(0);
  $(MainVideo).on('timeupdate', function(){
    let videoCurrent = (MainVideo.currentTime / videoDuration * 100);
    $('.sec_visual .progressbar').find('span').css('width', `${videoCurrent}%`)
  });
  MainVideo.paused ? MainVideo.play() : MainVideo.pause();
}

//Scroll Section
function scrollSection(section){
  let headerH = $('header').outerHeight(true);
  let goal = parseInt($(section).offset().top) - parseInt($(section).css('margin-top'))  - headerH;
  if(section == '.sec_slogan'){
    goal = parseInt($(section).children().eq(0).offset().top) - headerH;
    let $g1Top = $('.sec_visual .text_area').innerHeight() + 200;
    goal = goal - $g1Top;
  }
  $('html, body').animate({
    scrollTop: goal
  },1000)
}
//Scroll Top
function scrollTopBtn() {
  $('footer .btn_srl_top').click(function(){
    $('html, body').animate({
      scrollTop: 0
    },1000)
  })
}
//footer gsap
function footerGsap(fH, fPt) {
  g_footer = gsap.from('.f_top, .f_btm', {
    scrollTrigger: {
      trigger: '#container',
      start:()=>`bottom+=${fPt} bottom`,
      end:()=>`bottom+=${fPt} bottom-=${fH}`,
      //markers: true,
      scrub: 1,
    },
    y: -fH,
  })
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
function smoothScroll(){
  const lenis = new Lenis()
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
}


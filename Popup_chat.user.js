// ==UserScript==
// @name        Popup Chat
// @namespace   ssm
// @description Instead of an in screen chat, pop it allllll up!
// @include     http://*.grepolis.*/game*
// @version     0.3.2
// @grant       none
// @downloadURL https://www.slingshotmedia.nl/Popup_chat.user.js
// @updateURL https://www.slingshotmedia.nl/Popup_chat.meta.js
// ==/UserScript==

function popupChat() {

    var $ = window.jQuery,
        open = false,
        win = undefined,
        S = '&',
        url = document.URL;

    var initAll = function(){
        $('#ui_box').css('min-width','1px');
        $('body').css('overflow','hidden');
        if(url.indexOf('onlyChat')!==-1){
            addJS_Node("GPWindowMgr.Create(GPWindowMgr.TYPE_CHAT);Tracking.trackEvent(Tracking.events.OnNavigationClickEvent,{option:'chat'});$.Observer(GameEvents.menu.click).publish({option_id:'chat'});");
            MakeBridge(); //still needs work
            SizeChat();
        }else{
            addJS_Node("",true);
            if($('.chat.main_menu_item').length < 1){
                window.setTimeout(initAll,200);
                return false;
            }
            var openChat = $('.chat.main_menu_item');
            var closedChat = function (){
                open = false;
            }
            openChat.addClass('openChat');
            openChat.attr('data-option-id','none'); //disable chat popup
            $('.openChat').click(function (){
                if(open==true && !win.closed){
                    win.focus(); //focus when popup is open
                    return false;
                }
                if(url.substring(url.length-1)=='#')
                    url = url.substring(0,url.length-1);
                if(url.indexOf('?') > -1)
                    S = '?';
                open = true;
                win = window.open(url+S+'onlyChat', "Grepolis Chat", //open popup
                    "height=366,width=525,status=yes,scrollbar=no,toolbar=no,menubar=no,location=no");
                window.setInterval(function() {
                    if (win.closed !== false) { // !== is required for compatibility with Opera
                        window.clearInterval(pollTimer);
                        closedChat();
                    }
                }, 200);
            });
        }
        function addJS_Node (text,n) {
            var D                                   = document;
            var script                              = "<script type='text/javascript'>";

            if(n){
                script += "function addChatMessage(x){var i=$('.openChat').find('.indicator');if(x==false){i.css('display','none');}else{i.css('display','block');i.html(parseInt(x));}}";
            }else{
                script += "function execPC(){";
                if (text)
                    script += text;

                script += "} execPC();";
            }
            script += "</script>";
            $("head").append(script);
        }
        function SizeChat(){
            if($('.js-window-main-container').length < 1){
                window.setTimeout(SizeChat,100);
                return false;
            }
            $('.js-window-main-container').css({
                top:'-32px',
                left:'12px'
            });
        }
        function MakeBridge(){
            if($('#chat_history').length < 1){
                window.setTimeout(MakeBridge,100);
                return false;
            }
            var c = $('#chat_history');
            window.setInterval(function() {
                if(document.hasFocus()){
                    c.parent().attr('data-chat', c.find('.chat_line').length);
                    window.opener.addChatMessage(false);
                }
                if(!document.hasFocus())
                    checkChat(c);
            },2000);
        }
        function checkChat(c){
            var l = c.find('.chat_line').length;
            var ol = c.parent().attr('data-chat');
            if(ol < l){
                window.opener.addChatMessage(l-ol);
            }
        }
    };

    $(window).load(initAll);
}

function appendScript() {
    if (window) {
        var SM_script = document.createElement('script');
        SM_script.type = 'text/javascript';
        SM_script.textContent = popupChat.toString() + "\n popupChat();";
        document.body.appendChild(SM_script);
    } else {
        setTimeout(function () {
            appendScript();
        }, 100);
    }
}

appendScript();

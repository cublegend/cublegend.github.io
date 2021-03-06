var t;
var l;

$(document).ready(function() {
    t = $('.circle').css("top");
    l = $('.circle').css("left");

    $('#gear').on('click', ()=> {
        let sn = document.querySelector('.star-night');
        console.log(document.querySelector('.star-night').getAttribute('cube-manager').active);
        if (!sn.getAttribute('cube-manager').active) {
            sn.setAttribute('cube-manager', 'active', 'true');
            $('.rain-main').css('display', 'none');
        }
        else {
            sn.setAttribute('cube-manager', 'active', 'false');
            $('.rain-main').css('display', 'block');
        }
    })

    $("#num1").on('click', () => {
        $('.circle').css({'animation': 'shadow 1s forwards'});
        $('.AR').css("display", "block");
        $("#num2").animate({
            left: "+=100%",
            opacity: 0
        }, "slow");
        $("#num3").animate({
            left: "-=50%",
            top: "+=100%",
            opacity: 0
        }, "slow");
        setTimeout(() => {
            $("#num1").animate({
                left: "+=5%",
                top: "+=10%"
            }, "slow", () => {
                $('a-scene').css('display', 'none');
                $("#num1").animate({
                    left: "-=50%",
                    top: "-=100%"
                }, 800);
                $('.img-container').css("display", "none");
                $(".circle").animate({
                    width: "+=500vh",
                    height: "+=500vh",
                    top: "-=250vh",
                    left: "-=250vh"
                }, 800, () => {
                    $('.circle').css("display", "none");
                    $(".button-cover").animate({
                        borderRadius: "50%"
                    }, "slow")
                });
                $(".AR").animate({
                    paddingTop: "-=10%",
                    opacity:"1"
                }, 300);
            });
            
        }, 200);
    });
    $("#num2").on('click', () => {
        $('.circle').css({'animation': 'shadow 1s forwards'});
        $('.Game').css("display", "block");
        $("#num1").animate({
            left: "-=50%",
            top:"-=100%",
            opacity: 0
        }, "slow");
        $("#num3").animate({
            left: "-=50%",
            top: "+=100%",
            opacity: 0
        }, "slow");
        
        setTimeout(() => {
            $("#num2").animate({
                left: "-=5%"
            }, "slow", () => {
                $('a-scene').css('display', 'none');
                $("#num2").animate({
                    left: "+=100%"
                }, 800);
                $('.img-container').css("display", "none");
                $(".circle").animate({
                    width: "+=500vh",
                    height: "+=500vh",
                    top: "-=250vh",
                    left: "-=250vh"
                }, 800, () => {
                    $('.circle').css("display", "none");
                    $(".button-cover").animate({
                        borderRadius: "50%"
                    }, "slow")
                });
                $(".Game").animate({
                    paddingTop: "-=10%",
                    opacity:"1"
                }, 300);
            });
            
        }, 200);
    });
    $("#num3").on('click', () => {
        $('.circle').css({'animation': 'shadow 1s forwards'});
        $('.Music').css("display", "block");
        $("#num2").animate({
            left: "+=100%",
            opacity: 0
        }, "slow");
        $("#num1").animate({
            left: "-=50%",
            top: "-=100%",
            opacity: 0
        }, "slow");
        
        setTimeout(() => {
            $("#num3").animate({
                left: "+=5%",
                top: "-=10%"
            }, "slow", () => {
                $('a-scene').css('display', 'none');
                $("#num3").animate({
                    left: "-=50%",
                    top: "+=100%"
                }, 800);
                $('.img-container').css("display", "none");
                $(".circle").animate({
                    width: "+=500vh",
                    height: "+=500vh",
                    top: "-=250vh",
                    left: "-=250vh"
                }, 800, () => {
                    $('.circle').css("display", "none");
                    $(".button-cover").animate({
                        borderRadius: "50%"
                    }, "slow")
                });
                $(".Music").animate({
                    paddingTop: "-=10%",
                    opacity:"1"
                }, 300);
            });
            
        }, 200);
    });
})

function back_to_menu() {
    console.log("we're back!");
    $("#num1").animate({
        left: "50%",
        top: "50%",
        opacity: 1
    }, "slow");
    $("#num2").animate({
        left: "50%",
        top: "50%",
        opacity: 1
    }, "slow");
    $("#num3").animate({
        left: "50%",
        top: "50%",
        opacity: 1
    }, "slow");
    $('.circle').css("display", "inline-block");
    $(".circle").animate({
        width: "10vh",
        height: "10vh",
        top: t,
        left: l
    }, 800, () => {
        $('.img-container').css("display", "block");
        $('a-scene').css('display', 'block');
        $(".button-cover").css("border-radius", '0');
        $(".AR").css("display", "none");
        $(".Game").css("display", "none");
        $(".Music").css("display", "none");

        $(".AR").css("opacity", "0");
        $(".Game").css("opacity", "0");
        $(".Music").css("opacity", "0");
        $('.circle').css({'animation': 'shadow-back 0.3s forwards'});
    });
}

function toggle_play_button(el) {
    $('.soundcloud').css('opacity', '1');
    $('.soundcloud').css('pointer-events', 'all');
    $('.play-button').css('display', 'none');
}
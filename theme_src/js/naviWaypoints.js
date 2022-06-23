export default function naviWaypoints() {
    //shows logo on nav
    if ($(".siteNavi").length) {
        var topofDiv = $(".bodyEl").offset().top
        var $window = $(window);


        $window.on('scroll', false, function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > topofDiv) {
                $(".triggerWrapper").addClass('triggered');
            }
            else {
                $(".triggerWrapper").removeClass('triggered');
            }
        });
    }
}
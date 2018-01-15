var a = <div class="star_rating">
    <small>Rate This Student</small><br></br>
    <div class="star_rating_dummy">
        <i id="1" class="fa fa-star  starred"></i>
        <i id="2" class="fa fa-star  starred"></i>
        <i id="3" class="fa fa-star  starred"></i>
        <i id="4" class="fa fa-star  starred"></i>
        <i id="5" class="fa fa-star  starred"></i>
    </div>
</div>;

jQuery(document).ready(function () {
    var star_rating = jQuery(".star_rating");
    var star = star_rating.find(".fa-star");

    star.click(function () {
        star.removeClass("starred");

        var dom = jQuery(this);
        var num = Number(dom.attr("id"));

        for (var i = 1; i <= num; i++) {
            star_rating.find("#" + i).addClass("starred");
        }

        var params = {};
        params["action"] = "wzs21_update_db";
        params["table"] = "sessions";
        params["ID"] = "83";
        params["rating"] = num;

        jQuery.ajax({
            url: ajaxurl,
            type: "POST",
            data: params,
            success: function (res) {
                res = JSON.parse(res);
                console.log(res);
                if (res.status === "Success") {
                    //var title = "Thank you for your feedback";
                    //var body = "Your response successfully recorded";
                    //popup.openPopup(title, body);
                } else {
                    failResponse();
                }
            },
            error: function (err) {
                failResponse();
            }
        });

        function failResponse() {
            var title = "Something went wrong";
            var body = "Your response failed to be submitted.<br>Please try again later";
            popup.openPopup(title, body, true);
        }

    });
});

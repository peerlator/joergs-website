// alert("Happy Birthday")
function resizeGridItem(item) {
    grid = document.getElementById("social-media");
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight +
        rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems() {
    allItems = document.getElementsByClassName("item");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
    }
}
window.addEventListener("load", resizeAllGridItems);
window.addEventListener("resize", resizeAllGridItems);

 var twitter_template = '<div class="item twitter-container z-depth-3"><a href="https://twitter.com/joerg/status/[TWEET_ID]" style="color: inherit;"><div class="content"><div class="twitter-info"><img src="[PROFILE_IMG_URL]" class="responsive-image circle profile-pic"></img><div class="twitter-user-info"><b>[USER_NAME]</b> &nbsp @joerg <br>[DATE]</div></div><div class="twitter-text">[TWEET_TEXT]</div></div></a></div>'

function check_display(tweet) {
    if (tweet["in_reply_to_screen_name"] != null) {
        return false
    }
    if (tweet.text.startsWith("RT")) {
        return false
    }
    return true
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function date_to_text(text) {
    var list_of_elements = text.split(" ")
    return list_of_elements[1] + " " + list_of_elements[2] + " " + list_of_elements[5]
}

cb.__call("statuses/userTimeline", {
    "user_id": "5305502",
    "count": "60"
}, function (reply, rate, err) {
    console.log(reply)
    for (i = 0; i < 30; i++) {
        if (check_display(reply[i]) == true) {
            document.getElementById("social-media").innerHTML += twitter_template.replace("[TWEET_ID]", reply[i].id_str).replace("[PROFILE_IMG_URL]", reply[i].user.profile_image_url).replace("[TWEET_TEXT]", urlify(reply[i].text)).replace("[USER_NAME]", reply[i].user.name).replace("[DATE]", date_to_text(reply[i].created_at))
        }
    }
    resizeAllGridItems()
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
});


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

var twitter_template = '<div class="item twitter-container z-depth-3"><a href="https://twitter.com/joerg/status/[TWEET_ID]" style="color: inherit;"><div class="content"><div class="twitter-info"><img width="48" height="48" src="[PROFILE_IMG_URL]" class="responsive-image circle profile-pic"></img><div class="twitter-user-info"><b>[USER_NAME]</b> &nbsp @joerg <br>[DATE]</div></div><div class="twitter-text">[TWEET_TEXT]</div></div></a></div>'

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

function load_twitter(start, end) {
    cb.__call("statuses/userTimeline", {
        "user_id": "5305502",
        "count": String(end)
    }, function (reply, rate, err) {
        // console.log(reply)
        for (i = start; i < end; i++) {
            if (check_display(reply[i]) == true) {
                document.getElementById("social-media").innerHTML += twitter_template.replace("[TWEET_ID]", reply[i].id_str).replace("[PROFILE_IMG_URL]", reply[i].user.profile_image_url).replace("[TWEET_TEXT]", urlify(reply[i].text)).replace("[USER_NAME]", reply[i].user.name).replace("[DATE]", date_to_text(reply[i].created_at))
            }
        }
        resizeAllGridItems()
    });
}

load_twitter(0, 30)

var n_tweets = 30;

function more_tweets() {
    n_tweets += 20;
    load_twitter(n_tweets - 20, n_tweets)
}

// Medium

medium_html = "<div class='carousel-item'><a style='color: inherit;' href='[POST_URL]'><div class='medium-wrapper'><img src='[IMG_URL]' style='width: 100%'><div class='medium-trapezoid'></div><h1>[TITLE]</h1></div></a></div>"

function get_img_url(text) {
    var pattern = /\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/;
    return String(text).match(pattern)[0]
}

const Http = new XMLHttpRequest();
const url = 'https://cors-anywhere.herokuapp.com/https://medium.com/feed/@joerg';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e) => {
    medium_feed = Http.responseXML
    if (medium_feed != null) {
        console.log(medium_feed)
        posts = medium_feed.getElementsByTagName("item")
        for (i = 0; i < posts.length; i++) {
            if (posts[i].getElementsByTagName("category").length > 0) {
                console.log(posts[i])
                console.log(get_img_url(posts[i].getElementsByTagName("content:encoded")[0].firstChild.nodeValue))
                // document.getElementById("medium-posts").innerHTML += "<div class='carousel-item medium-wrapper'" + get_img_url(posts[i].getElementsByTagName("content:encoded")[0].firstChild.nodeValue) + "><h1>" + posts[i].getElementsByTagName("title")[0].firstChild.nodeValue + "</h1></div>"
                document.getElementById("medium-posts").innerHTML += medium_html.replace("[POST_URL]", posts[i].getElementsByTagName("link")[0].firstChild.nodeValue).replace("[TITLE]", posts[i].getElementsByTagName("title")[0].firstChild.nodeValue).replace("[IMG_URL]",get_img_url(posts[i].getElementsByTagName("content:encoded")[0].firstChild.nodeValue))
            }
        }
    }
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
        fullWidth: true
    });
}
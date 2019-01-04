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

var twitter_template = '<div class="item twitter-container z-depth-3"><a href="https://twitter.com/joerg/status/[TWEET_ID]" style="color: inherit;"><div class="content"><div class="twitter-info"><img width="48" height="48" src="[PROFILE_IMG_URL]" class="responsive-image circle profile-pic"></img><div class="twitter-user-info"><b>[USER_NAME]</b> @joerg <br>[DATE]</div></div><div class="twitter-text">[TWEET_TEXT]</div></div></a></div>'


function check_display(tweet) {
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

function date_to_text_twitter(text) {
    var list_of_elements = text.split(" ")
    return list_of_elements[2] + " " + list_of_elements[1] + " " + list_of_elements[5]
}

function load_twitter(start, end) {
    const TwitterHTTP = new XMLHttpRequest();
    const twitter_url = 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=5305502&count='+String(end)+'screen_name=twitterapi';
    TwitterHTTP.open("GET", twitter_url);
    TwitterHTTP.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAAI5n9AAAAAAAxpERlwfdm3drgTOHgIPpMZycxao%3Dkgi24BaAjVyD9eFw0qXcBYNlcgHRWQl3KWbNtXlSR9qd4JQuv3")
    TwitterHTTP.send();
    TwitterHTTP.onreadystatechange = (e) => {
        tweets = JSON.parse(TwitterHTTP.response)
        for (i = start; i < end; i++) {
            if (check_display(tweets[i]) == true) {
                document.getElementById("social-media").innerHTML += twitter_template.replace("[TWEET_ID]", tweets[i].id_str).replace("[PROFILE_IMG_URL]", tweets[i].user.profile_image_url).replace("[TWEET_TEXT]", urlify(tweets[i].text)).replace("[USER_NAME]", tweets[i].user.name).replace("[DATE]", date_to_text_twitter(tweets[i].created_at))
            }
        }
        resizeAllGridItems()
    }
}
load_twitter(0, 30)

var n_tweets = 30;

function more_tweets() {
    n_tweets += 20;
    load_twitter(n_tweets - 20, n_tweets)
    if (n_tweets > 100) {
        console.log(n_tweets)
        document.getElementById("LoadMoreBtn").style = "display: none;"
    }
}

// Medium

function date_to_text_medium(text) {
    var list_of_elements = text.split(" ")
    return list_of_elements[1] + " " + list_of_elements[2] + " " + list_of_elements[3]
}

medium_html = "<div class='carousel-item'><a style='color: inherit;' href='[POST_URL]'><div class='medium-wrapper' style='overflow: hidden; background-size: cover;background-position: center;background-image: url([IMG_URL]);'><div class='medium-content'><div class='medium-triangle'></div><div class='info'><div><h1>[TITLE]</h1><div>[DATE]</div></div></div></div></a></div>"

function get_img_url(text) {
    var pattern = /\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/;
    return String(text).match(pattern)[0]
}

const MediumHTTP = new XMLHttpRequest();
const medium_url = 'https://cors-anywhere.herokuapp.com/https://medium.com/feed/@joerg';
MediumHTTP.open("GET", medium_url);
MediumHTTP.send();
MediumHTTP.onreadystatechange = (e) => {
    medium_feed = MediumHTTP.responseXML
    if (medium_feed != null) {
        posts = medium_feed.getElementsByTagName("item")
        for (i = 0; i < posts.length; i++) {
            if (posts[i].getElementsByTagName("category").length > 0) {
                document.getElementById("medium-posts").innerHTML += medium_html.replace("[POST_URL]", posts[i].getElementsByTagName("link")[0].firstChild.nodeValue).replace("[TITLE]", posts[i].getElementsByTagName("title")[0].firstChild.nodeValue).replace("[IMG_URL]", get_img_url(posts[i].getElementsByTagName("content:encoded")[0].firstChild.nodeValue)).replace("[DATE]", date_to_text_medium(posts[i].getElementsByTagName("pubDate")[0].firstChild.nodeValue))
            }
        }
    }
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
        fullWidth: true
    });
}

function resize_triangle() {
    if (window.innerWidth > 700) {
        info_elems = document.getElementsByClassName("info")
        triangle_elems = document.getElementsByClassName("medium-triangle")
        for (i = 0; i < triangle_elems.length; i++) {

            triangle_elems[i].style["height"] = String(info_elems[i].clientHeight) + "px"
        }
    } else {
        triangle_elems = document.getElementsByClassName("medium-triangle")
        for (i = 0; i < triangle_elems.length; i++) {

            triangle_elems[i].style["height"] = ""
        }
    }
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function resize() {
    resizeAllGridItems()
    resize_triangle()
}

window.addEventListener("load", resize);
window.addEventListener("resize", resize);

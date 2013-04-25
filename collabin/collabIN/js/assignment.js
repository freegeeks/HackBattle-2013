$(document).ready(function() {
	loadNews();
});

function loadNews() {
		$.ajax({
		type:'GET',
		dataType:'jsonp',
		url:"http://hndroidapi.appspot.com/best/format/json/page/",
		success:function(data) {
		for(var i = 0, l = data.items.length; i < l && i < 10; ++i) 
			{
				var title = data.items[i].title;
				var url = data.items[i].url;
				var id = data.items[i].item_id;
				$('#new').append('<article><h2>' + title + '</h2><i class="vcomments" onClick="javascript:showComment();">view comments</i><a href="' + url + '" class="url">' + title + '</a><div  id="news-' + id + '" class="comment"></div></article>');
				loadComment (id);
			}				
			//remove loading gif
			$('#new span').remove();
		}
	});
}

function loadComment (id) {
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			url:"http://hndroidapi.appspot.com/nestedcomments/format/json/id/" + id,
			
			success:function(data) {
			for(var i = 0, l = data.items.length; i < l && i < 1000; ++i) 
				{
					var comment = data.items[i].comment;
					$('#news-' + id).append('<p>' + comment + '</p>');
					loadRemove();
				}
			}
	});
}

function loadRemove() {
			var str=document.getElementById("new").innerHTML; 
			var n=str.replace(/__BR__/gm,"<br><br>");
			document.getElementById("new").innerHTML=n;
}

function counter() {
var n = $(".comment p").length;
$("p.counter span").append(n);
}

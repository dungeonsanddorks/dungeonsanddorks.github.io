async function loadPosts() {
	globalThis.postData = await fetch('/blog/post-data/posts.json').then(response => response.json())
	globalThis.posts = this.postData.posts
	globalThis.posts.sort((a,b) => b.dateLastModified - a.dateLastModified);
}

function renderPost(post) {
	// Render Post Header
	var imageHTML = ""
	if (post.image !== "placeholder.jpeg") imageHTML = `<div class="post-thumb-img-content post-thumb">
		<img width="1024" height="768" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" class="attachment-large size-large wp-post-image" alt="${post.imageAlt}" itemprop="image" decoding="async" sizes="(max-width: 1024px) 100vw, 1024px">
	</div>
	`
	var output = `<header class="entry-header">
	<h1 class="entry-title" itemprop="headline">${post.title}</h1>
	<div class="entry-meta">
	` +  /* TODO: Comments <span class="comments-link"><a href="https://dungeonsanddorks.github.io/blog/?post=${post.id}#respond">Leave a Comment</a></span> / */ /* TODO: Catagoreies <span class="ast-terms-link"><a href="https://dungeonsanddorks.github.io/category/uncategorized/">Uncategorized</a></span> / */ `By <span class="posted-by vcard author" itemtype="https://schema.org/Person" itemscope="itemscope" itemprop="author"><a title="View all posts by ${post.author}" href="https://dungeonsanddorks.github.io/author/${post.author.replaceAll(" ", "-").toLowerCase()}/" rel="author" class="url fn n" itemprop="url"><span class="author-name" itemprop="name">${post.author}</span> </a> </span> 
	</div>
	${imageHTML}
	</header>
`
	document.getElementsByClassName("ast-post-format-")[0].innerHTML += output;

	// Render Post Content
	document.getElementsByClassName("ast-post-format-")[0].innerHTML += '<div class="entry-content clear" itemprop="text">' + postRenderer(post.entries, 0) + '</div>';

	// Render Navigation Links
	document.getElementsByClassName("nav-links")[0].innerHTML = checkForNavigation(post);
} 

function postRenderer(lineArr, depth) {
	var output = ""
	for (let i = 0; i < lineArr.length; i++) {
		let line = lineArr[i]
		if (line.type == "h3") {
			output += `<h3 class="wp-block-heading">${checkForTags(line.entries[0])}</h3>`
		} else if (line.type == "list") {
			output += `<${line.typeOf}l class="${line.classes}" style="${line.style}">`
			line.entries.forEach(listItem => {
				output += `<li>${checkForTags(listItem)}</li>`
			});
			output += `</${line.typeOf}l>`
		} else {
			output += `<p>${checkForTags(line)}</p>`
		}
	}

	return output
}

function checkForTags(txt) {
	output = txt
	output = output.replaceAll(/{@b (.*)}/g, "<strong>$1</strong>") // Bold
	output = output.replaceAll(/{@link (.*)\|(.*)}/g, "<a target=\"_blank\" href=\"$2\">$1</a>") // Links

	return output
}

function checkForNavigation(post) {
	var output = ""

	var next = globalThis.posts.find(obj => {
		return obj.id == post.id - 1
	})

	var previous = globalThis.posts.find(obj => {
		return obj.id == post.id + 1
	})

	if (next) {
		output += `<div class="nav-previous"><a href="https://dungeonsanddorks.github.io/blog/?post=${post.id - 1}" rel="prev"><span class="ast-left-arrow">←</span> Previous Post</a></div>`
	}
	
	if (previous) {
		output += `<div class="nav-next"><a href="https://dungeonsanddorks.github.io/blog/?post=${post.id + 1}" rel="next">Next Post <span class="ast-right-arrow">→</span></a></div>`
	}

	return output
}

async function init() {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString);
	var currentPost = {};
	await loadPosts()
	
	const page = urlParams.has('post') ? urlParams.get('post').split('#')[0] : 0;
	const result = globalThis.posts.find(obj => {
		return obj.id == page
	})

	if (result == undefined) {
		renderPost(globalThis.posts[0])
	} else {
		renderPost(result)
	}}

init()
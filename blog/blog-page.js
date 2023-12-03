async function loadPosts() {
	globalThis.postData = await fetch('/blog/post-data/posts.json').then(response => response.json())
	globalThis.posts = this.postData.posts
	globalThis.posts.sort((a,b) => b.dateLastModified - a.dateLastModified);
}

function renderPost(post) {
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
	output = recursiveRenderer(post.entries, 0)
	document.getElementsByClassName("ast-post-format-")[0].innerHTML += '<div class="entry-content clear" itemprop="text">' + output + '</div>';
} 

function recursiveRenderer(lineArr, depth) {
	var output = ""
	for (let i = 0; i < lineArr.length; i++) {
		let line = lineArr[i]
		if (line.type == "h3") {
			output += `<h3 class="wp-block-heading">${checkForTags(line.entries[0])}</h3>`
		} else if (line.type == "list" && line.typeOf == 'o') {
			output += `<ol class="${line.classes}" style="${line.style}">`
			line.entries.forEach(listItem => {
				output += `<li>${checkForTags(listItem)}</li>`
			});
			output += `</ol>`
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

async function init() {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString);
	var currentPost = {};
	await loadPosts()
	
	const page = urlParams.has('post') ? urlParams.get('post').split('#')[0] : 0;
	for (let i = 0; i < globalThis.posts.length; i++) {
		if (globalThis.posts[i].id == page) {
			currentPost = globalThis.posts[i]
			renderPost(currentPost)
			return
		}
	}

	renderPost(globalThis.posts[0])
}

init()
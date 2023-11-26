async function loadPosts() {
	globalThis.postData = await fetch('/blog/post-data/posts.json').then(response => response.json())
	globalThis.posts = this.postData.posts
	globalThis.posts.sort((a,b) => b.dateLastModified - a.dateLastModified);
}

function renderPost(post) {
	var output = `<header class="entry-header">
<h1 class="entry-title" itemprop="headline">${post.title}</h1>
<div class="entry-meta">
` +  /* TODO: Comments <span class="comments-link"><a href="https://dungeonsanddorks.github.io/blog/#respond?post=${post.id}">Leave a Comment</a></span> / */ /* TODO: Catagoreies <span class="ast-terms-link"><a href="https://dungeonsanddorks.github.io/category/uncategorized/">Uncategorized</a></span> / */ `By <span class="posted-by vcard author" itemtype="https://schema.org/Person" itemscope="itemscope" itemprop="author"><a title="View all posts by ${post.author}" href="https://dungeonsanddorks.github.io/author/${post.author.replaceAll(" ", "-").toLowerCase()}/" rel="author" class="url fn n" itemprop="url"><span class="author-name" itemprop="name">${post.author}</span> </a> </span> 
</div>
<div class="post-thumb-img-content post-thumb"><img width="1024" height="768"
		src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" class="attachment-large size-large wp-post-image" alt="${post.imageAlt}" itemprop="image" decoding="async"
		sizes="(max-width: 1024px) 100vw, 1024px"></div>
</header>
`
	document.getElementsByClassName("ast-post-format-")[0].innerHTML += output;
} 

async function init() {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString);
	var currentPost = {};
	await loadPosts()
	
	const page = urlParams.has('post') ? urlParams.get('post') : 0;
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
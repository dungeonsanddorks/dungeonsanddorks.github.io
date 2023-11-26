async function loadPosts() {
	globalThis.postData = await fetch('/post-data/posts.json').then(response => response.json())
	globalThis.posts = this.postData.posts
}

function renderPost() {
	
} 

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const page = urlParams.has('post') ? urlParams.get('post') : 0;
var currentPost = {};
await loadPosts()

for (let i = 0; i < globalThis.posts.length; i++) {
	if (globalThis.posts[i].id == page) {
		currentPost = globalThis.posts[i]
	}
}

renderPost(currentPost)
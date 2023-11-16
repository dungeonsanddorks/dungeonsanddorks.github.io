class Blog {
	init () {
		this.loadPosts()
	}

	async loadPosts () {
		this.postData = await fetch('/blog/post-data/posts.json').then(response => response.json())
		this.posts = this.postData.posts
		console.log(this.posts)
	}
}

const blog = new Blog
blog.init()
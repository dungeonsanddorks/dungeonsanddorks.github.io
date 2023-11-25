class Blog {
	async initBlogPage () {
		await this.loadPosts()
		this.setUpBlogPageList()
	}

	async loadPosts () {
		this.postData = await fetch('/blog/post-data/posts.json').then(response => response.json())
		this.posts = this.postData.posts
	}

	setUpBlogPageList () {
		this.output = "";
		this.posts.forEach(post => {
			let date = new Date(post.dateLastModified * 1000)
			this.output += `<div class="uc_post_list_box">
	<div class="uc_post_list_image">
		<a href="https://dungeonsanddorks.github.io/" target="_self" title="${post.title}">
			<img decoding="async" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" alt="${post.imageAlt}" width="768" height="576">
		</a>
	</div>
	<div class="uc_post_list_content">
		<div class="uc_post_list_content_inside">
			<div class="uc_post_list_title">
				<a target="_self" href="https://dungeonsanddorks.github.io/" title="${post.title}">
					${post.title}
				</a>
			</div>	
			<div class="ue-meta-data">
				<div class="ue-grid-item-meta-data">
					<span class="ue-grid-item-meta-data-icon"> <i class="fas fa-calendar-week"></i></span> ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}
				</div>                                   
			</div>
			<div class="uc_post_content">
				${post.exerpt}
			</div>      
		</div>
	</div>
</div>
`
		});
		document.getElementsByClassName("uc_post_list")[0].innerHTML += this.output;
	}
}

const blog = new Blog
blog.initBlogPage()
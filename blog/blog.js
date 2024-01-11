class Blog {
	async initBlogPage() {
		this.postIndex = await fetch("/blog/post-data/index.json").then((response) =>
			response.json()
		);
		this.setUpBlogPageList();
	}

	async loadPosts(arrToLoad) {
		return await Promise.all(arrToLoad.map(id => fetch(`/blog/post-data/posts/post-${id}.json`).then(response => response.json())))
	}

	async setUpBlogPageList() {
		this.output = "";
		if (document.getElementsByClassName("uc_post_list")?.length > 0) {
			this.pages = Object.keys(this.postIndex)
			this.pages.sort((a, b) => {
				return Number(b) - Number(a)
			})

			const numPerPage = 4 // This can be changed to whatever seems appropriate

			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const blogPageNum = urlParams.has("page")
				? Number(urlParams.get("page").split("#")[0])
				: 1;

			let pageNav = ""
			if (blogPageNum > 1) {
				pageNav += `<a href="?page=${blogPageNum - 1}#uc_post_list_elementor_919c7ef"><span class="ast-left-arrow post-list-number arrow">←</span></a>`
			}


			if (blogPageNum > 1) {
				if (blogPageNum - 1 > 1) {
					if (blogPageNum - 2 > 1) {
						if (blogPageNum - 3 > 1) {
							pageNav += `<div class="more-post-lists"></div>`
						}

						pageNav += `<a href="?page=${blogPageNum - 3}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum - 3}</div></a> `
					}

					pageNav += `<a href="?page=${blogPageNum - 2}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum - 2}</div></a> `
				}

				pageNav += `<a href="?page=${blogPageNum - 1}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum - 1}</div></a> `
			}

			pageNav += `<a href="?page=${blogPageNum}#uc_post_list_elementor_919c7ef"><div class="post-list-number num selected">${blogPageNum}</div></a>`

			if (blogPageNum < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a href="?page=${blogPageNum + 1}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum + 1}</div></a>`
			}

			if (blogPageNum + 1 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a href="?page=${blogPageNum + 2}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum + 2}</div></a>`
			}

			if (blogPageNum + 2 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a href="?page=${blogPageNum + 3}#uc_post_list_elementor_919c7ef"><div class="post-list-number num">${blogPageNum + 3}</div></a>`
			}

			if (blogPageNum + 3 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += `<div class="more-post-lists"></div>`
			}

			if (blogPageNum < Math.ceil(this.pages.length / numPerPage)) {
        pageNav += `<a href="?page=${blogPageNum + 1}#uc_post_list_elementor_919c7ef"><span class="ast-right-arrow post-list-number arrow">→</span></a>`
      }

			document.getElementById("post_list_navigation").innerHTML = pageNav

			let toLoad = []
			for (let i = 0; i < numPerPage; i++) {
				if (this.pages[i + numPerPage * (blogPageNum - 1)]) {
					toLoad.push(this.pages[i + numPerPage * (blogPageNum - 1)])
				}
			}

			this.posts = await this.loadPosts(toLoad);
			
			this.posts.forEach((post) => {
				let date = new Date(post.dateLastModified * 1000);
				this.output += `<div class="uc_post_list_box">
	<div class="uc_post_list_image">
		<a href="https://dungeonsanddorks.github.io/blog/?post=${
			post.id
		}" target="_self" title="${post.title}">
			<img decoding="async" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${
				post.image
			}" alt="${post.imageAlt}" width="768" height="576">
		</a>
	</div>
	<div class="uc_post_list_content">
		<div class="uc_post_list_content_inside">
			<div class="uc_post_list_title">
				<a target="_self" href="https://dungeonsanddorks.github.io/blog/?post=${
					post.id
				}" title="${post.title}">
					${post.title}
				</a>
			</div>	
			<div class="ue-meta-data">
				<div class="ue-grid-item-meta-data">
					<span class="ue-grid-item-meta-data-icon"> <i class="fas fa-calendar-week"></i></span> ${date.toLocaleString(
						"default",
						{ month: "long" }
					)} ${date.getDate()}, ${date.getFullYear()}
				</div>                                   
			</div>
			<div class="uc_post_content">
				${post.exerpt}
			</div>      
		</div>
	</div>
</div>
`;
			});
			document.getElementsByClassName("uc_post_list")[0].innerHTML +=
				this.output;
			this.applyHash(window.location.hash)
		} else if (document.getElementsByClassName("ue_post_blocks")?.length > 0) {
			this.pages = Object.keys(this.postIndex)
			this.pages.sort((a, b) => {
				return Number(b) - Number(a)
			})

			let posts = await this.loadPosts([this.pages[0], this.pages[1], this.pages[2], this.pages[3], this.pages[4], this.pages[5]]);

			for (var i = 0; i < 6; i++) {
				let post = posts[i];
				this.output += `<div class="ue_post_blocks_box">
<div class="ue_post_blocks_image">
			<a href="https://dungeonsanddorks.github.io/blog/?post=${post.id}" style="display:block;">
		<img decoding="async" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" alt="${post.imageAlt}" width="768" height="576"/>
	</a>
</div>
<div class="ue_post_blocks_content">
	<div class="ue_post_blocks_title">
		<a href="https://dungeonsanddorks.github.io/blog/?post=${post.id}">
		${post.title}
		</a>
	</div>    
	<div class="ue_post_blocks_text">
	${post.exerpt}
	</div>
	<div class="ue_post_blocks_link">
		<a href="https://dungeonsanddorks.github.io/blog/?post=${post.id}">
			Read More
		</a>
	</div>
</div>
</div>
`;
			}
			document.getElementsByClassName("ue_post_blocks")[0].innerHTML +=
				this.output;
		}
	}

	applyHash(hash) {
		window.location.hash = ""
		console.log("Applying Hash: " + hash)
		window.location.hash = hash;

		if (history.replaceState) {
			history.replaceState(null, null, "#");
		}
	}
}

const blog = new Blog();
blog.initBlogPage();

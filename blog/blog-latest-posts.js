class LastestBlogPosts {
  async initBlogList() {
		this.postIndex = await fetch("/blog/posts/post-data/index.json").then((response) =>
			response.json()
		);
		this.setUpBlogPageList();
	}

	async loadPosts(arrToLoad) {
		return await Promise.all(arrToLoad.map(id => fetch(`/blog/posts/post-data/posts/post-${id}.json`).then(response => response.json())))
	}

  async setUpBlogPageList() {
		this.output = "";
		console.log("Setting up blog page list");
    // 4 horizontal stack layout
		if (document.getElementsByClassName("blog-posts-long")?.length > 0) {
			this.pages = Object.keys(this.postIndex)
			this.pages.sort((a, b) => {
				return Number(b) - Number(a)
			})

			const numPerPage = 4 // This can be changed to whatever seems appropriate (but see the below note on line 34)

			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const blogPageNum = urlParams.has("page")
				? Number(urlParams.get("page").split("#")[0])
				: 1;

			console.log(this.pages)
			console.log(blogPageNum)

      // TODO: Modify to be variable based on numPerPage
			let pageNav = "<div class=\"blog-page-navigation\">"
			if (blogPageNum > 1) {
				pageNav += `<a class="link-no-underline" href="?page=${blogPageNum - 1}#blog-posts-title"><span class="ast-left-arrow post-list-number arrow">←</span></a>`
			}

			if (blogPageNum > 1) {
				if (blogPageNum - 1 > 1) {
					if (blogPageNum - 2 > 1) {
						if (blogPageNum - 3 > 1) {
							pageNav += `<div class="more-post-lists"></div>`
						}

						pageNav += `<a class="link-no-underline" href="?page=${blogPageNum - 3}#blog-posts-title"><div class="post-list-number num">${blogPageNum - 3}</div></a> `
					}

					pageNav += `<a class="link-no-underline" href="?page=${blogPageNum - 2}#blog-posts-title"><div class="post-list-number num">${blogPageNum - 2}</div></a> `
				}

				pageNav += `<a class="link-no-underline" href="?page=${blogPageNum - 1}#blog-posts-title"><div class="post-list-number num">${blogPageNum - 1}</div></a> `
			}

			pageNav += `<a class="link-no-underline" href="?page=${blogPageNum}#blog-posts-title"><div class="post-list-number num selected">${blogPageNum}</div></a>`

			if (blogPageNum < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a class="link-no-underline" href="?page=${blogPageNum + 1}#blog-posts-title"><div class="post-list-number num">${blogPageNum + 1}</div></a>`
			}

			if (blogPageNum + 1 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a class="link-no-underline" href="?page=${blogPageNum + 2}#blog-posts-title"><div class="post-list-number num">${blogPageNum + 2}</div></a>`
			}

			if (blogPageNum + 2 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += ` <a class="link-no-underline" href="?page=${blogPageNum + 3}#blog-posts-title"><div class="post-list-number num">${blogPageNum + 3}</div></a>`
			}

			if (blogPageNum + 3 < Math.ceil(this.pages.length / numPerPage)) {
				pageNav += `<div class="more-post-lists"></div>`
			}

			if (blogPageNum < Math.ceil(this.pages.length / numPerPage)) {
        pageNav += `<a class="link-no-underline" href="?page=${blogPageNum + 1}#blog-posts-title"><span class="ast-right-arrow post-list-number arrow">→</span></a>`
      }

			pageNav += `</div>`

			let toLoad = []
			for (let i = 0; i < numPerPage; i++) {
				if (this.pages[i + numPerPage * (blogPageNum - 1)]) {
					toLoad.push(this.pages[i + numPerPage * (blogPageNum - 1)])
				}
			}

			this.posts = await this.loadPosts(toLoad);
			
			this.posts.forEach((post) => {
				let date = new Date(post.dateLastModified * 1000);
				this.output += `<article class="blog-post-card">
    <img decoding="async" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${
				post.image
			}" alt="${post.imageAlt}" width="768" height="576">
    <div class="blog-post-card-content">
      <a href="https://dungeonsanddorks.github.io/blog/posts/?post=${
					post.id
				}" class="blog-post-card-title" target="_self" title="${post.title}">${post.title}</a>
      <div class="blog-post-card-meta">${date.toLocaleString(
						"default",
						{ month: "long" }
					)} ${date.getDate()}, ${date.getFullYear()} • ${post.author}</div>
      <div class="blog-post-card-excerpt">
        ${post.exerpt}
      </div>
      <a href="https://dungeonsanddorks.github.io/blog/posts/?post=${
					post.id
				}" class="blog-post-card-readmore">Read More</a>
    </div>
  </article>
`;
			});
			document.getElementsByClassName("blog-posts-long")[0].innerHTML =
				this.output + pageNav;
			this.applyHash(window.location.hash)

      // 6 box layout
		} else if (document.getElementsByClassName("blog-posts-box")?.length > 0) {
			this.pages = Object.keys(this.postIndex)
			this.pages.sort((a, b) => {
				return Number(b) - Number(a)
			})

			let posts = await this.loadPosts([this.pages[0], this.pages[1], this.pages[2], this.pages[3], this.pages[4], this.pages[5]]);

			for (var i = 0; i < 6; i++) {
        let post = posts[i];
				let date = new Date(post.dateLastModified * 1000)
				this.output += `
        <a href="https://dungeonsanddorks.github.io/blog/posts/?post=${post.id}" class="blog-post-menu-item">
    <img decoding="async" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" alt="${post.imageAlt}" width="768" height="576" class="blog-post-menu-thumb">
    <div class="blog-post-menu-title">${post.title}</div>
    <div class="blog-post-menu-meta">${date.toLocaleString(
						"default",
						{ month: "long" }
					)} ${date.getDate()}, ${date.getFullYear()}</div>
		<div class="blog-post-menu-excerpt">
			${post.exerpt}
		</div>
  </a>
`;
			}
			document.getElementsByClassName("blog-posts-box")[0].innerHTML =
				this.output + `<a href="https://dungeonsanddorks.github.io/blog/#blog-posts-title" class="blog-post-menu-more button">More Posts</a>`;
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

const blog = new LastestBlogPosts();
blog.initBlogList();
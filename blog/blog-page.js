async function loadData() {
	let [posts, comments] = await Promise.all([
		fetch("/blog/post-data/posts.json").then((response) => response.json()),
		fetch("/blog/comment-data/comments.json").then((response) =>
			response.json()
		),
	]);
	globalThis.posts = posts.posts.sort(
		(a, b) => b.dateLastModified - a.dateLastModified
	);

	var approvedComments = comments.comments;
	try {
		var newComments = JSON.parse(localStorage.pendingComments);
	} catch (error) {
		var newComments = [];
	}

	if (Array.isArray(newComments)) {
		for (let i = 0; i < newComments.length; i++) {
			let comment = newComments[i]
			var matchingComment = globalThis.comments.find((obj) => {
				return (
					obj.commentID == comment.commentID &&
					obj.postID == comment.postID
				);
			});

			if (matchingComment) {
				newComments.splice(i, 1)
				console.log("Pending Comment Removed")
				i--
			}
		}

		localStorage.pendingComments = JSON.stringify(newComments)
		globalThis.comments = approvedComments.concat(newComments);
	} else {
		globalThis.comments = approvedComments;
	}
}

function renderPost(post) {
	// Render Post Header
	var imageHTML = "";
	if (post.image !== "placeholder.jpeg")
		imageHTML = `<div class="post-thumb-img-content post-thumb">
		<img width="1024" height="768" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/post-data/images/${post.image}" class="attachment-large size-large wp-post-image" alt="${post.imageAlt}" itemprop="image" decoding="async" sizes="(max-width: 1024px) 100vw, 1024px">
	</div>
	`;
	var output =
		`<header class="entry-header">
	<h1 class="entry-title" itemprop="headline">${post.title}</h1>
	<div class="entry-meta">
	` +
		/* TODO: Catagoreies <span class="ast-terms-link"><a href="https://dungeonsanddorks.github.io/category/uncategorized/">Uncategorized</a></span> / */ `By <span class="posted-by vcard author" itemtype="https://schema.org/Person" itemscope="itemscope" itemprop="author"><a title="View all posts by ${
			post.author
		}" href="https://dungeonsanddorks.github.io/author/${post.author
			.replaceAll(" ", "-")
			.toLowerCase()}/" rel="author" class="url fn n" itemprop="url"><span class="author-name" itemprop="name">${
			post.author
		}</span> </a> </span> 
	</div>
	${imageHTML}
	</header>
`;
	document.getElementsByClassName("ast-post-format-")[0].innerHTML += output;

	// Render Post Content
	document.getElementsByClassName("ast-post-format-")[0].innerHTML +=
		'<div class="entry-content clear" itemprop="text">' +
		postRenderer(post.entries, 0) +
		"</div>";

	// Render Navigation Links
	document.getElementsByClassName("nav-links")[0].innerHTML =
		checkForNavigation(post);

	// Render Comments
	const renderedComments = checkForComments(post);
	if (renderedComments.title) {
		document.getElementById(
			"comments"
		).innerHTML += `<div class="comments-count-wrapper"><h3 class="comments-title">${renderedComments.title}</h3></div>`;
	}

	if (renderedComments.comments) {
		document.getElementById(
			"comments"
		).innerHTML += `<ol class="ast-comment-list">${renderedComments.comments}</ol>`;
	}

	if (globalThis.replyTo == 0) {
		document.getElementById("comments").innerHTML += renderCommentBox();
	}
}

function postRenderer(lineArr, depth) {
	var output = "";
	for (let i = 0; i < lineArr.length; i++) {
		let line = lineArr[i];
		if (line.type == "h3") {
			output += `<h3 class="wp-block-heading">${checkForTags(
				line.entries[0]
			)}</h3>`;
		} else if (line.type == "list") {
			output += `<${line.typeOf}l class="${line.classes}" style="${line.style}">`;
			line.entries.forEach((listItem) => {
				output += `<li>${checkForTags(listItem)}</li>`;
			});
			output += `</${line.typeOf}l>`;
		} else {
			output += `<p>${checkForTags(line)}</p>`;
		}
	}

	return output;
}

function checkForTags(txt) {
	output = txt;
	output = output.replaceAll(/{@b (.*)}/g, "<strong>$1</strong>"); // Bold
	output = output.replaceAll(/{@i (.*)}/g, "<i>$1</i>"); // Italic
	output = output.replaceAll(
		/{@link (.*)\|(.*)}/g,
		'<a target="_blank" href="$2">$1</a>'
	); // Links

	return output;
}

function checkForNavigation(post) {
	var output = "";

	var next = globalThis.posts.find((obj) => {
		return obj.id == post.id - 1;
	});

	var previous = globalThis.posts.find((obj) => {
		return obj.id == post.id + 1;
	});

	if (next) {
		output += `<div class="nav-previous"><a href="https://dungeonsanddorks.github.io/blog/?post=${
			post.id - 1
		}" rel="prev"><span class="ast-left-arrow">←</span> Previous Post</a></div>`;
	}

	if (previous) {
		output += `<div class="nav-next"><a href="https://dungeonsanddorks.github.io/blog/?post=${
			post.id + 1
		}" rel="next">Next Post <span class="ast-right-arrow">→</span></a></div>`;
	}

	return output;
}

function checkForComments(post) {
	var totalComments = globalThis.comments.filter(
		(obj) => obj.postID == post.id
	);
	globalThis.lastCommentID = totalComments.sort((a, b) => {
		return b.commentID - a.commentID;
	})[0].commentID;
	var isPural = totalComments.length > 1 ? "s" : "";
	var topComments = globalThis.comments.filter(
		(obj) => obj.postID == post.id && obj.depth == 1
	);

	if (topComments.length == 0) {
		document.getElementsByClassName("entry-meta")[0].innerHTML =
			`<span class="comments-link"><a href="https://dungeonsanddorks.github.io/blog/?post=${globalThis.currentPage}#respond">Leave a Comment</a></span> /` +
			document.getElementsByClassName("entry-meta")[0].innerHTML;
		return { comments: "", title: "" };
	} else if (topComments.length == 1) {
		document.getElementsByClassName("entry-meta")[0].innerHTML =
			`<span class="comments-link"><a href="https://dungeonsanddorks.github.io/blog/?post=${globalThis.currentPage}#comments">${totalComments.length} Comment${isPural}</a></span> /` +
			document.getElementsByClassName("entry-meta")[0].innerHTML;
		return {
			comments: renderComment(topComments[0]),
			title: `${totalComments.length} thought${isPural} on “${post.title}”`,
		};
	} else {
		document.getElementsByClassName("entry-meta")[0].innerHTML =
			`<span class="comments-link"><a href="https://dungeonsanddorks.github.io/blog/?post=${globalThis.currentPage}#comments">${totalComments.length} Comments</a></span> /` +
			document.getElementsByClassName("entry-meta")[0].innerHTML;
	}

	var output = "";
	for (const comment of topComments) {
		output += renderComment(comment);
	}

	return {
		comments: output,
		title: `${topComments.length} thoughts on “${post.title}”`,
	};
}

function renderComment(comment) {
	var moreComments = globalThis.comments.filter(
		(obj) =>
			obj.postID == comment.postID &&
			obj.depth == comment.depth + 1 &&
			obj.replyToID == comment.commentID
	);
	var moreCommentTxt = "";
	var replyBox = "";
	if (globalThis.replyTo == comment.commentID) {
		replyBox = renderCommentBox();
	}

	if (moreComments.length > 0 || replyBox.length > 0) {
		moreCommentTxt = '<ol class="children">';
		for (const comment of moreComments) {
			moreCommentTxt += renderComment(comment);
		}

		moreCommentTxt += replyBox + "</ol>";
	}

	var avatar =
		comment.avatar == "default"
			? "c5653504f48da574115fdf053f96db62.png"
			: comment.avatar;

	var date = new Date(comment.datePosted * 1000);
	var hours = date.getHours() % 12 || 12;
	var meridiem = date.getHours() > 12 ? "pm" : "am";
	var time = `${date.toLocaleString("default", {
		month: "long",
	})} ${date.getDate()}, ${date.getFullYear()} at ${hours}:${date.getMinutes()} ${meridiem}`;

	var output = "<p>";
	for (let i = 0; i < comment.comment.length; i++) {
		let commentLine = checkForTags(comment.comment[i]);
		output += commentLine;

		if (commentLine !== "<hr>") output += "<br>";
	}
	output = output.substring(0, output.length - 4) + "</p>";

	return `<li class="comment even thread-even depth-${
		comment.depth
	}" id="li-comment-${comment.commentID}">
	<article id="comment-${comment.commentID}" class="ast-comment">
		<div class="ast-comment-info">
			<div class="ast-comment-avatar-wrap">
				<img alt="" src="https://raw.githubusercontent.com/dungeonsanddorks/dungeonsanddorks.github.io/main/blog/comment-data/avatar-images/${avatar}" class="avatar avatar-50 photo" height="50" width="50" decoding="async">
			</div>
			<div class="ast-comment-data-wrap">
				<div class="ast-comment-meta-wrap">
					<header class="ast-comment-meta ast-row ast-comment-author vcard capitalize">
						<div class="ast-comment-cite-wrap ast-col-lg-12">
							<cite>
								<b class="fn">
									${comment.author}
								</b> 
							</cite>
						</div>
						<div class="ast-comment-time ast-col-lg-12">
							<span class="timendate">
								<a href="https://dungeonsanddorks.github.io/blog/?post=${
									comment.postID
								}#comment-${comment.commentID}">
									<time datetime="${date.toISOString()}">${time}</time>
								</a>
							</span>
						</div>
					</header>
				</div> <!-- .ast-comment-meta -->
			</div>
			<section class="ast-comment-content comment">
				${output}
				<div class="ast-comment-edit-reply-wrap">
					<span class="ast-reply-link">
						<a rel="nofollow" class="comment-reply-link" href="https://dungeonsanddorks.github.io/blog/?post=${
							comment.postID
						}&replytocom=${comment.commentID}#respond" data-commentid="${
		comment.commentID
	}" data-postid="${comment.postID}" data-belowelement="comment-${
		comment.commentID
	}" data-respondelement="respond" data-replyto="Reply to ${
		comment.author
	}" aria-label="Reply to ${comment.author}">
							Reply
						</a>
					</span>
				</div>
			</section> <!-- .ast-comment-content -->
		</div>
	</article><!-- #comment-## -->
	${moreCommentTxt}
</li><!-- #comment-## -->`;
}

function renderCommentBox() {
	var titleTxt = "Leave a Comment";
	var depth = 1;

	if (globalThis.replyTo) {
		var commentReplyedTo = globalThis.comments.find((obj) => {
			return (
				obj.commentID == globalThis.replyTo &&
				obj.postID == globalThis.currentPage
			);
		});

		titleTxt = `Reply to ${commentReplyedTo.author}
		<small
			><a
				rel="nofollow"
				id="cancel-comment-reply-link"
				href="/blog/?post=${globalThis.currentPage}#respond"
				>Cancel Reply</a
			></small
		>`;

		depth = commentReplyedTo.depth + 1;
	}

	var savedCommentInfo = {};
	try {
		savedCommentInfo = JSON.parse(localStorage.savedCommentInfo);
	} catch (error) {
		savedCommentInfo = {
			save: "",
			author: "",
			email: "",
			url: "",
		};
	}

	return `<div id="respond" class="comment-respond">
	<h3 id="reply-title" class="comment-reply-title">
		${titleTxt}
	</h3>
	<p class="comment-notes">
		<span id="email-notes">Your email address will not be published.</span>
		<span class="required-field-message"
			>Required fields are marked <span class="required">*</span></span
		>
	</p>
	<div class="ast-row comment-textarea">
		<fieldset class="comment-form-comment">
			<legend class="comment-form-legend"></legend>
			<div class="comment-form-textarea ast-col-lg-12">
				<label for="comment" class="screen-reader-text">Type here..</label
				><textarea
					id="comment"
					name="comment"
					placeholder="Type here.."
					cols="45"
					rows="8"
					aria-required="true"
				></textarea>
			</div>
		</fieldset>
	</div>
	<div class="ast-comment-formwrap ast-row">
		<p
			class="comment-form-author ast-col-xs-12 ast-col-sm-12 ast-col-md-4 ast-col-lg-4"
		>
			<label for="author" class="screen-reader-text">Name*</label
			><input
				id="author"
				name="author"
				type="text"
				value="${savedCommentInfo.author || ""}"
				placeholder="Name*"
				size="30"
				aria-required="true"
			/>
		</p>
		<p
			class="comment-form-email ast-col-xs-12 ast-col-sm-12 ast-col-md-4 ast-col-lg-4"
		>
			<label for="email" class="screen-reader-text">Email*</label
			><input
				id="email"
				name="email"
				type="text"
				value="${savedCommentInfo.email || ""}"
				placeholder="Email*"
				size="30"
				aria-required="true"
			/>
		</p>
		<p
			class="comment-form-url ast-col-xs-12 ast-col-sm-12 ast-col-md-4 ast-col-lg-4"
		>
			<label for="url"
				><label for="url" class="screen-reader-text">Website</label
				><input
					id="url"
					name="url"
					type="text"
					value="${savedCommentInfo.url || ""}"
					placeholder="Website"
					size="30"
			/></label>
		</p>
	</div>
	<p class="comment-form-cookies-consent">
		<input
			id="wp-comment-cookies-consent"
			name="wp-comment-cookies-consent"
			type="checkbox" ${savedCommentInfo.save || ""}
		/>
		<label for="wp-comment-cookies-consent"
			>Save my name, email, and website in this browser for the next time I
			comment.</label
		>
	</p>
	<p class="form-submit">
		<input
			name="submit"
			type="submit"
			id="submit"
			class="submit"
			value="Post Comment »"
			onclick="submitComment(${depth})"
		/>
	</p>
</div>
`;
}

function submitComment(depth) {
	console.log('Ran "submitComment()"');
	if (document.getElementById("wp-comment-cookies-consent").checked) {
		localStorage.savedCommentInfo = JSON.stringify({
			save: "checked",
			author: document.getElementById("author").value,
			email: document.getElementById("email").value,
			website: document.getElementById("url").value,
		});
	} else {
		localStorage.savedCommentInfo = JSON.stringify({
			save: "",
			author: "",
			email: "",
			url: "",
		});
	}

	var newComment = {
		postID: globalThis.currentPage,
		commentID: globalThis.lastCommentID + 1,
		depth: depth,
		replyToID: globalThis.replyTo == 0 ? undefined : globalThis.replyTo,
		author: document.getElementById("author").value,
		avatar: "default",
		datePosted: Date.now() / 1000,
		comment: document.getElementById("comment").value.split("\n"),
	};

	// TODO: Use Firebase to save comments for moderation

	var pendingComments = {};
	try {
		pendingComments = JSON.parse(localStorage.pendingComments);
	} catch (error) {
		pendingComments = [];
	}

	newComment.comment.unshift(
		"{@b {@i This comment is pending approval}}",
		"<hr>"
	);
	newComment.pending = true;
	pendingComments.push(newComment);

	localStorage.pendingComments = JSON.stringify(pendingComments);

	location.href = `/blog/?post=${globalThis.currentPage}#comment-${newComment.commentID}`
}

async function init() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	await loadData();

	globalThis.currentPage = urlParams.has("post")
		? Number(urlParams.get("post").split("#")[0])
		: 0;
	globalThis.replyTo = urlParams.has("replytocom")
		? Number(urlParams.get("replytocom").split("#")[0])
		: 0;
	const result = globalThis.posts.find((obj) => {
		return obj.id == globalThis.currentPage;
	});

	if (result == undefined) {
		renderPost(globalThis.posts[0]);
	} else {
		renderPost(result);
	}
}

init();

<template>
	<div class="suite novel article">
		<section class="main"
		         v-bind:class="[typeface1]"
		         v-bind:style="{maxWidth: typography.width + 'rem'}">
			<h3>{{sample.title}} (@{{typography.size}}px)</h3>
			<article class="content"
			     itemprop="articleBody"
			     v-bind:style="{fontSize: typography.size + 'px', textAlign: typography.align}"
			     ref="article1"
			     v-html="rendered_content"></article>
		</section>
		<section class="opposite"
		         v-bind:class="[typeface2]"
		         v-bind:style="{maxWidth: typography.width + 'rem'}">
			<h3>{{sample.title}} (@{{typography.size}}px)</h3>
			<article class="content"
			     itemprop="articleBody"
			     v-bind:style="{fontSize: typography.size + 'px', textAlign: typography.align}"
			     ref="article2"
			     v-html="rendered_content"></article>
		</section>
	</div>
</template>

<script>
const axios = require('axios');
const marked = require('marked');
module.exports = {
	props: ["typeface1", "typeface2", "sxs", "typography", "sample"],
	data: () => ({ rendered_content: '' }),
	created: function () {
		const t = this;
		axios.get(this.sample.src)
			.then(function (response) {
				t.rendered_content = marked(response.data, { sanitize: true });
				setTimeout(function () { Han(t.$refs.article1).render() }, 100);
				setTimeout(function () { Han(t.$refs.article2).render() }, 100);
			})
	}
}
</script>
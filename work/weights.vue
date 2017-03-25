<template>
	<div class="suite weights">
		<section class="main" v-bind:class="[typeface1]" v-bind:style="{maxWidth: typography.width + 'rem'}">
			<h3>Weights &amp; Styles</h3>
			<article ref="article2">
				<div class="sample"
				     v-for="(s, sid) in styles"
				     v-bind:class="{unsupported: !(typefaces[typeface1]) || !(typefaces[typeface1].supports[sid])}"
				     v-bind:style="{fontSize: typography.size + 'px', textAlign: typography.align}">
					<h4>{{sid}}</h4>
					<span v-bind:style="{fontWeight: s.weight || 400, fontStyle: s.style || 'normal'}">{{sample}}</span>
				</div>
			</article>
		</section>
		<section class="opposite" v-bind:class="[typeface2]" v-bind:style="{maxWidth: typography.width + 'rem'}">
			<h3>Weights &amp; Styles</h3>
			<article ref="article2">
				<div class="sample"
				     v-for="(s, sid) in styles"
				     v-bind:class="{unsupported: !(typefaces[typeface2]) || !(typefaces[typeface2].supports[sid])}"
				     v-bind:style="{fontSize: typography.size + 'px', textAlign: typography.align}">
					<h4>{{sid}}</h4>
					<span v-bind:style="{fontWeight: s.weight || 400, fontStyle: s.style || 'normal'}">{{sample}}</span>
				</div>
			</article>
		</section>
	</div>
</template>

<script>
module.exports = {
	props: ['typeface1', 'typeface2', 'typography', 'typefaces', 'styles', 'sample'],
	mounted: function () {
		const t = this;
		setTimeout(function () { Han(t.$refs.article1).render() }, 100);
		setTimeout(function () { Han(t.$refs.article2).render() }, 100);
	}
}
</script>
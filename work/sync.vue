<template>
	<div class="suite sync">
		<section class="main"
		         v-bind:style="{maxWidth: typography.width + 'rem'}">
			<div class="toolbar">Current Style: <select v-model="currentStyle">
				<option v-for="(sty, sid) in styles"
				        v-bind:value="sid">{{sid}}</option>
			</select> | Text size synchronized with global config.</div>
			<textarea v-bind:class="[typeface1]"
			          v-model="sample"
			          v-on:keypress.stop
			          v-bind:style="{
							  fontSize: typography.size + 'px',
							  textAlign: typography.align,
							  fontWeight: (styles[currentStyle]||{}).weight||400,
							  fontStyle: (styles[currentStyle]||{}).style||'normal',
							  }"></textarea>
		</section>
		<section class="opposite"
		         v-bind:style="{maxWidth: typography.width + 'rem'}">
			<div class="toolbar">Current Style: <select v-model="currentStyle">
				<option v-for="(sty, sid) in styles"
				        v-bind:value="sid">{{sid}}</option>
			</select> | Text size synchronized with global config.</div>
			<textarea v-bind:class="[typeface2]"
			          v-model="sample"
			          v-on:keypress.stop
			          v-bind:style="{
							  fontSize: typography.size + 'px',
							  textAlign: typography.align,
							  fontWeight: (styles[currentStyle]||{}).weight||400,
							  fontStyle: (styles[currentStyle]||{}).style||'normal',
							  }"></textarea>
		</section>
	</div>
</template>

<script>
module.exports = {
	props: ['typeface1', 'typeface2', 'typography', 'styles', 'sample'],
	data: () => ({
		currentStyle: "regular"
	})
}
</script>
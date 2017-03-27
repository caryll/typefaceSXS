<template>
	<div id="page"
	     v-bind:class="{oneside:!sxs,night:night}"
	     v-on:click="hideOTPanel">
		<header>
			<nav>
				<div class="group"
				     id="sel-left">
					<select v-model="typeface_1">
						<option v-for="(ty, id) in typefaces"
						        v-bind:value="id">{{ty.name}}</option>
					</select>
				</div>
				<div class="group">
					<label>night<br>mode</label><button class="toggle"
					        v-bind:class="{on:night}"
					        v-on:click="togglenight">{{night ? "on" : "off"}}</button>
				</div>
				<div class="group">
					<label>text<br>size</label><button class="pm"
					        v-on:click="smaller(1)">−</button><input v-model="typography.size"
					       v-on:keypress.stop
					       value=""><button class="pm"
					        v-on:click="larger(1)">+</button>
				</div>
				<div class="group">
					<label>column<br>width</label><button class="pm"
					        v-on:click="narrower(1)">−</button><input v-model="typography.width"
					       v-on:keypress.stop
					       value=""><button class="pm"
					        v-on:click="wider(1)">+</button>
				</div>
				<div class="group sp">
					<button class="toggle narrow"
					        v-bind:class="{on:typography.align=='left'}"
					        v-on:click="alignTo('left')"
					        title="Align left (Q)"><i class="icons8-align-left"></i></button><button class="toggle narrow"
					        v-bind:class="{on:typography.align=='center'}"
					        v-on:click="alignTo('center')"><i class="icons8-align-center"
						   title="Align Center (W)"></i></button><button class="toggle narrow"
					        v-bind:class="{on:typography.align=='right'}"
					        v-on:click="alignTo('right')"
					        title="Align Right (E)"><i class="icons8-align-right"></i></button><button class="toggle narrow"
					        v-bind:class="{on:typography.align=='justify'}"
					        v-on:click="alignTo('justify')"
					        title="Align Justify (R)"><i class="icons8-align-justify"></i></button>
				</div>
				<div class="group ot sp">
					<button class="toggle wide"
					        v-on:click.stop="toggleOTPanel"
					        v-bind:class="{on:showOTPanel}"><span>OpenType</span></button>
					<table v-show="showOTPanel"
					       v-on:click.stop>
						<tr v-for="(feat, fid) in features"
						    v-if="!feat.hidden">
							<td class=label>{{feat.title}}
								<kbd v-if="feat.key">{{feat.key}}</kbd>
							</td>
							<td class=button>
								<button class="toggle"
								        v-bind:class="{on:feat.on}"
								        v-on:click="toggleFeature(fid)">{{feat.on ? "on" : "off"}}</button>
							</td>
						</tr>
					</table>
				</div>
	
				<div class="group sxs">
					<label>side<br>by side</label><button class="toggle"
					        v-bind:class="{on:sxs}"
					        v-on:click="togglesxs">{{sxs ? "on" : "off"}}</button><select v-model="typeface_2"
					        v-bind:disabled="!sxs">
						<option v-for="(ty, id) in typefaces"
						        v-bind:value="id">{{ty.name}}</option>
					</select>
				</div>
			</nav>
		</header>
		<main id="intro"
		      v-bind:style="{fontFeatureSettings:otFeatureCSS}">
			<component v-for="suite in testSuites"
			           v-bind:key="suitkey"
			           v-bind:is="suite.is"
			           v-bind:typeface1="typeface_1"
			           v-bind:typeface2="typeface_2"
			           v-bind:typefaces="typefaces"
			           v-bind:styles="styles"
			           v-bind:typography="typography"
			           v-bind:sample="suite.sample"></component>
		</main>
		<footer>{{samples.footer || 'TypefaceSXS'}}</footer>
	</div>
</template>

<script>
const axios = require('axios');
const Novel = require('./novel.vue');
const Weights = require('./weights.vue');
const Sync = require('./sync.vue');

module.exports = {
	components: {
		'weights': Weights,
		'novel': Novel,
		'sync': Sync
	},
	data: () => ({
		typeface_1: "unknown",
		typeface_2: "unknown",
		typefaces: { unknown: { name: "unknown", supports: {} } },
		styles: {},
		samples: {},
		typography: { size: 16, width: 40, align: "justify" },
		features: {},
		articles: [],
		sxs: true,
		night: false,
		showOTPanel: false
	}),
	computed: {
		otFeatureCSS: function () {
			let a = [];
			for (let f in this.features) {
				if (this.features[f].on) { a.push(f); }
			}
			return a.map(x => '"' + x + '"').join(', ');
		},
		testSuites: function () {
			return [
				{ is: 'sync', sample: this.samples.sync || '', key: 'test%sync' },
				{ is: 'weights', sample: this.samples.weights || '', key: 'test%weights' }
			].concat(this.articles.map(a => ({ is: 'novel', sample: a, key: 'test%' + a.source })));
		}
	},

	mounted: function(){
		const vRoot = this;
		axios.get("config.json").then(function (response) {
			const data = response.data;
			console.log("Loaded data", data);
			vRoot.typefaces = {};
			for (let f in data.typefaces) {
				if (data.typefaces[f].name) {
					vRoot.typefaces[f] = data.typefaces[f];
				}
			}
			vRoot.styles = data.styles;
			vRoot.articles = data.articles;
			vRoot.samples = data.samples;
			vRoot.features = data.features;
			setTimeout(function () {
				vRoot.setType(1, data.typefaces.init_l);
				vRoot.setType(2, data.typefaces.init_r);
			}, 1);
		})
	},

	methods: {
		setType: function (j, n) {
			if (this.typefaces[n]) {
				this['typeface_' + j] = n
			} else {
				this['typeface_' + j] = Object.keys(this.typefaces)[0];
			}
		},
		toggleFeature: function (f) {
			if (!this.features[f]) return;
			this.features[f].on = !this.features[f].on;
		},
		larger: function (n) {
			this.typography.size = Math.min(40, (this.typography.size - 0) + (n || 1));
		},
		smaller: function (n) {
			this.typography.size = Math.max(10, (this.typography.size - 0) - (n || 1));
		},
		wider: function (n) {
			this.typography.width = Math.min(80, (this.typography.width - 0) + (n || 1));
		},
		narrower: function (n) {
			this.typography.width = Math.max(10, (this.typography.width - 0) - (n || 1));
		},
		togglesxs: function () { this.sxs = !this.sxs },
		togglenight: function () { this.night = !this.night },
		toggleOTPanel: function () { this.showOTPanel = !this.showOTPanel },
		hideOTPanel: function () { this.showOTPanel = false },
		alignTo: function (s) { this.typography.align = s },
		
		handleKey: function (key) {
			switch (key) {
				case 'q': this.alignTo('left'); break;
				case 'w': this.alignTo('center'); break;
				case 'e': this.alignTo('right'); break;
				case 'r': this.alignTo('justify'); break;

				case 's': this.togglesxs(); break;
				case 'n': this.togglenight(); break;
				case 'o': this.toggleOTPanel(); break;

				case '=': this.larger(1); break;
				case '+': this.larger(4); break;
				case '-': this.smaller(1); break;
				case '_': this.smaller(4); break;
				case ']': this.wider(1); break;
				case '[': this.narrower(1); break;
			}
			for (let f in this.typefaces) {
				const family = this.typefaces[f];
				if (family.key_l && family.key_l === key) {
					this.setType(1, f);
				}
				if (family.key_r && family.key_r === key) {
					this.setType(2, f);
				}
			}
			for (let f in this.features) {
				const feat = this.features[f];
				if (feat.key && feat.key === key) {
					this.toggleFeature(f);
				}
			}
		}
	}
}
</script>
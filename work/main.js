const axios = require('axios');

const Vue = require('vue');
const Novel = require('./novel.vue');
const Weights = require('./weights.vue');
const Sync = require('./sync.vue');

const vRoot = new Vue({
	el: '#page',
	components: {
		'weights': Weights,
		'novel': Novel,
		'sync': Sync
	},
	data: {
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
	},
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
	}
});

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

document.documentElement.onkeypress = function (e) {
	switch (e.key) {
		case 'q': vRoot.alignTo('left'); break;
		case 'w': vRoot.alignTo('center'); break;
		case 'e': vRoot.alignTo('right'); break;
		case 'r': vRoot.alignTo('justify'); break;

		case 's': vRoot.togglesxs(); break;
		case 'n': vRoot.togglenight(); break;
		case 'o': vRoot.toggleOTPanel(); break;

		case '=': vRoot.larger(1); break;
		case '+': vRoot.larger(4); break;
		case '-': vRoot.smaller(1); break;
		case '_': vRoot.smaller(4); break;
		case ']': vRoot.wider(1); break;
		case '[': vRoot.narrower(1); break;
	}
	for (let f in vRoot.typefaces) {
		const family = vRoot.typefaces[f];
		if (family.key_l && family.key_l === e.key) {
			vRoot.setType(1, f);
		}
		if (family.key_r && family.key_r === e.key) {
			vRoot.setType(2, f);
		}
	}
	for (let f in vRoot.features) {
		const feat = vRoot.features[f];
		if (feat.key && feat.key === e.key) {
			vRoot.toggleFeature(f);
		}
	}
}
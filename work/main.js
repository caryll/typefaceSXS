const axios = require('axios');

const Vue = require('vue');
const TypefaceSXS = require('./main.vue');


const vRoot = new Vue({
	el: '#page',
	render: function (createElement) {
		return createElement(TypefaceSXS)
	}
}).$children[0];

document.documentElement.onkeypress = function (e) { vRoot.handleKey(e.key) }
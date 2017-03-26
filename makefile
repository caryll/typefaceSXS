preview : public/index.html public/main.packed.css public/main.packed.js
public/index.html : work/index.html
	html-minifier $< -o $@ --html5 --remove-attribute-quotes --remove-comments --collapse-whitespace
public/main.packed.css : work/main.styl work/fonts.styl work/punct.styl
	stylus $< -o $@.tmp.css
	cleancss $@.tmp.css -o $@
	rm $@.tmp.css
public/main.packed.js : work/main.js work/novel.vue work/weights.vue work/sync.vue work/main.vue
	browserify -t vueify -e $< -o $@
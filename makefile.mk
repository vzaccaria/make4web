# Makefile generated automatically on July 3rd 2013, 11:23:27 am
# (c) 2013 - Vittorio Zaccaria, all rights reserved

# Current configuration: 
BUILD_DIR=./build
DEPLOY_DIR=lib
LOCAL_SERVER_DIR=.
LOCAL_CLIENT_DIR=.
SERVER_DIR=lib/.
CLIENT_DIR=lib/.
CLIENT_DIR_IMG=lib/./img
CLIENT_DIR_FONTS=lib/./font

# Deploy all targets
.PHONY: all
all: 
	 make deploy

# 
SERVER_SOURCES= \
	$(strip $(patsubst %, ./build/%, $(patsubst %.ls, %.js, $(notdir ./src/lakefile.ls)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.ls, %.js, $(notdir ./src/plugins.ls))))

# Create temporary directories
.PHONY: pre-build
pre-build: 
	 @mkdir -p ./build

# Create deploy directories
.PHONY: pre-deploy
pre-deploy: 
	 @mkdir -p lib
	 @mkdir -p lib/.

# Deploy files
.PHONY: _deploy
_deploy: 
	 @for i in $(SERVER_SOURCES); do \
		 install -m 555 $$i lib/.; \
	 done 
	 @echo ' [34m└─(deployed.[0m' 1>&2
	 @echo ' [34m[0m' 1>&2

# Post deploy files
.PHONY: post-deploy
post-deploy: 
	 @echo ' [34m└─(post deploy done.[0m' 1>&2
	 @echo ' [34m[0m' 1>&2

# Build completed
.PHONY: _build
_build:  $(SERVER_SOURCES) 
	 @echo ' [34m└─(build completed.[0m' 1>&2
	 @echo ' [34m[0m' 1>&2

# Runs task deploy
.PHONY: deploy
deploy: 
	 @make pre-deploy
	 @make build
	 @make _deploy
	 @make post-deploy


# Runs task build
.PHONY: build
build: 
	 @make pre-build
	 @make _build


# Vpath definition
VPATH =  \
	 $(dir ./src/lakefile.ls)  \
	 $(dir ./src/plugins.ls)  \

# Start continuous build
.PHONY: server
server: 
	 @touch ./.client-changed
	 @touch ./.recompile-all
	 echo '' > ./.watches.pid
	 @watchman -w ./src 'touch ./.client-changed' & echo "$$!" >> "./.watches.pid" 
	 @watchman -w ./.client-changed 'make deploy; chromereload;' & echo "$$!" >> "./.watches.pid" 
	 @watchman -w ./.recompile-all 'make clean && make deploy; chromereload;' & echo "$$!" >> "./.watches.pid" 

# Stops the continuous build
.PHONY: reverse
reverse: 
	 cat ./.watches.pid | xargs -n 1 kill -9

# Tests server files
.PHONY: test
test: 

# Converting from ls to js
./build/%.js: %.ls
	 lsc --output $(BUILD_DIR) -c $<

# Converting from coffee to js
./build/%.js: %.coffee
	 coffee -b --output $(BUILD_DIR) $<

# Converting from jade to html
./build/%.html: %.jade
	 @jade -P --out $(BUILD_DIR) $<

# Converting from styl to css
./build/%.css: %.styl
	 stylus $< -o $(BUILD_DIR)

# Converting from less to css
./build/%.css: %.less
	 lessc --verbose $< > $@

# Converting from sass to css
./build/%.css: %.sass
	 sass $< $@

# Converting from scss to css
./build/%.css: %.scss
	 sass --scss $< $@

# Converting from js to min.js
./build/%.min.js: ./build/%.js
	 uglifyjs      $< > $@

# Converting from css to min.css
./build/%.min.css: ./build/%.css
	 uglifycss     $< > $@

# Converting from js to js
./build/%.js: %.js
	 cp $< $@

# Converting from css to css
./build/%.css: %.css
	 cp $< $@
help:
	 @echo 'Makefile targets'
	 @echo ''
	 @echo '    [31mCommon[0m:' 
	 @echo '        [1mdeploy         [0m: (default). complete deal, create directories, build and install; eventually install assets.' 
	 @echo '        [1mbuild          [0m: Compile all files into build directory.' 
	 @echo ''
	 @echo '    [31mContinuous build[0m:' 
	 @echo '        [1mserver         [0m: Starts continuous build.' 
	 @echo '        [1mreverse        [0m: Stops continuous build.' 
	 @echo ''
	 @echo '    [31mOther[0m:' 
	 @echo '        [1mtest           [0m: Run mocha tests.' 
	 @echo ''
	 @echo '    [31mRelease management[0m:' 
	 @echo '        [1mgit-{patch, minor, major}[0m: Commits, tags and pushes the current branch.' 
	 @echo '        [1mnpm-{patch, minor, major}[0m: As git *, but it does publish on npm.' 
	 @echo '        [1mnpm-install    [0m: Install a global link to this package, to use it: [4mnpm link pkgname[0m in the target dir.' 
	 @echo '        [1mnpm-prepare-x  [0m: Prepare npm version update and gittag it x={ patch, minor, major }.' 
	 @echo '        [1mnpm-commit     [0m: Commit version change.' 
	 @echo '        [1mnpm-finalize   [0m: Merge development branch into master and publish npm.' 
	 @echo ''


# Installs a link globally on this machine
.PHONY: npm-install
npm-install: 
	 @echo ' [34m└─(remember to do a `npm link pkg name` in the.[0m' 1>&2
	 @echo ' [34m[0m' 1>&2
	 @echo ' [34m└─(directory of the modules that are going to use this..[0m' 1>&2
	 @echo ' [34m[0m' 1>&2
	 npm link .

# Npm patch
npm-prepare-patch:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 @echo ' [34mAfter this action, do `make npm commit` and `make npm finalize` to[0m' 1>&2
	 @echo ' [34mPublish to the npm repository.[0m' 1>&2
	 git checkout development
	 npm version patch 

npm-patch:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch and the package will be published on npm.[0m' 1>&2
	 git checkout development
	 npm version patch 
	 make npm-finalize

# Npm minor
npm-prepare-minor:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 @echo ' [34mAfter this action, do `make npm commit` and `make npm finalize` to[0m' 1>&2
	 @echo ' [34mPublish to the npm repository.[0m' 1>&2
	 git checkout development
	 npm version minor 

npm-minor:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch and the package will be published on npm.[0m' 1>&2
	 git checkout development
	 npm version minor 
	 make npm-finalize

# Npm major
npm-prepare-major:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 @echo ' [34mAfter this action, do `make npm commit` and `make npm finalize` to[0m' 1>&2
	 @echo ' [34mPublish to the npm repository.[0m' 1>&2
	 git checkout development
	 npm version major 

npm-major:
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo ' [34mThe tag will be brought to the master branch and the package will be published on npm.[0m' 1>&2
	 git checkout development
	 npm version major 
	 make npm-finalize

# Git patch
git-patch:
	 @echo ' [34mUpdate version, commit and tag the current branch[0m' 1>&2
	 @echo ' [34mDoes not publish to the npm repository.[0m' 1>&2
	 npm version patch 
	 git push

# Git minor
git-minor:
	 @echo ' [34mUpdate version, commit and tag the current branch[0m' 1>&2
	 @echo ' [34mDoes not publish to the npm repository.[0m' 1>&2
	 npm version minor 
	 git push

# Git major
git-major:
	 @echo ' [34mUpdate version, commit and tag the current branch[0m' 1>&2
	 @echo ' [34mDoes not publish to the npm repository.[0m' 1>&2
	 npm version major 
	 git push

# Commits changes to git
.PHONY: npm-commit
npm-commit: 
	 git commit -a

# Merges changes into master and publish
.PHONY: npm-finalize
npm-finalize: 
	 git checkout master
	 git merge development
	 npm publish .
	 git push
	 git push --tags
	 git checkout development

# Cleanup all files in build and deploy
.PHONY: distclean
distclean: 
	 -rm -rf ./build
	 -rm -rf lib
	 -rm -f ./.client-changed
	 -rm -f ./.recompile-all
	 -rm -f ./.watches.pid

# Cleanup
.PHONY: clean
clean: 
	 -rm -rf ./build
	 -rm -rf lib

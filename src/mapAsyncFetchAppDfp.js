(function(window,document){
  var TOUT = window.TOUT = window.TOUT || {};

  var utils = {
    getCanonicalLinkHref: function(){
      var links = document.getElementsByTagName('link');

      for(var i=0; i < links.length; i++){
        if(links[i].getAttribute('rel') === 'canonical'){
          return links[i].getAttribute('href');
        }
      }

      return '';
    },

    getMetaTagContentByProperty: function(metaTagProperty){
      var metaTags = document.getElementsByTagName('meta');
      for(var i=0; i < metaTags.length; i++){
        if(metaTags[i].getAttribute('property') === metaTagProperty){
          return metaTags[i].getAttribute('content');
        }
      }

      return '';
    },

    getWindowLocationOrigin: function(){
      // NOTE: this helper is needed because window.location.origin doesn't exist in Internet Explorer
      return window.location.protocol + '//' + window.location.host;
    },

    getCanonicalUrl: function() {
      var canonicalUrl = utils.getCanonicalLinkHref() || utils.getMetaTagContentByProperty('og:url');

      if(canonicalUrl && canonicalUrl[0] === '/'){
        canonicalUrl = utils.getWindowLocationOrigin() + canonicalUrl;
      }

      return canonicalUrl;
    },

    getOgUrl: function() {
      var ogUrl = utils.getMetaTagContentByProperty('og:url');

      if(ogUrl && ogUrl[0] === '/'){
        ogUrl = utils.getWindowLocationOrigin() + ogUrl;
      }

      return ogUrl;
    },


    getRelCanonical: function() {
      var relCanonical = utils.getCanonicalLinkHref();

      if(relCanonical && relCanonical[0] === '/'){
        relCanonical = utils.getWindowLocationOrigin() + relCanonical;
      }

      return relCanonical;
    },

    getExternalArticleId: function() {
      return utils.getMetaTagContentByProperty('tout:article:id');
    },

    getCurrentProtocol: function(){
      return document.location.protocol === 'https:' ? 'https:' : 'http:';
    },

    getPlatformHost: function(){
      return TOUT.SDK_HOST || 'platform.tout.com';
    }
  };

  TOUT.mapAsyncFetchApp = {
    init: function(brandUid, options){
      this.brandUid = brandUid;
      this.active = true;
      this.productFetched = false;
      this.dataLoaded = false;
      this.startedSuccessfully = false;
      this.options = options || {};

      if(!this.options.paramsWhitelist){
        this.options.paramsWhitelist = ['brand_uid', 'external_article_id', 'og_url', 'window_location', 'rel_canonical', 'async_fetch'];
      }
    },

    fetch: function(){
      var script = document.createElement('script'),
        src = utils.getCurrentProtocol() + '//' + utils.getPlatformHost() + '/mid_article_player.js',
        params = TOUT.mapAsyncFetchApp.getMidArticleQueryParams(),
        joinCharacter = '?';

      for(var param in params){
        if(params.hasOwnProperty(param)){
          if(params[param] !== ''){
            src += joinCharacter + param + '=' + encodeURIComponent(params[param]);
            joinCharacter = '&';
          }
        }
      }

      script.src = src;
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    },

    start: function(){
      if(this.productFetched && this.dataLoaded && !this.startedSuccessfully){
        this.startedSuccessfully = true;
        TOUT.midArticleProductLoader.start(TOUT.data.mid_article_player_experiment);
      }
    },

    getMidArticleQueryParams: function(){
      var params = {};

      if(this._whitelistContains('brand_uid')){
        params.brand_uid = this.brandUid;
      }

      if(this._whitelistContains('content_referrer')){
        params.content_referrer = document.referrer;
      }

      if(this._whitelistContains('external_article_id')){
        params.external_article_id = utils.getExternalArticleId();
      }

      if(this._whitelistContains('og_url')){
        params.og_url = utils.getOgUrl();
      }

      if(this._whitelistContains('window_location')){
        params.window_location = document.location.href;
      }

      if(this._whitelistContains('rel_canonical')){
        params.rel_canonical = utils.getRelCanonical();
      }

      if(this._whitelistContains('async_fetch')){
        params.async_fetch = true;
      }

      return params;
    },

    _whitelistContains: function(value){
      return this.options.paramsWhitelist && this.options.paramsWhitelist.indexOf(value) > -1;
    }
  };
})(window.parent,window.parent.document);
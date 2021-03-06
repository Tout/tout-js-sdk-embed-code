<!---
  The README.md file is autogenerated when you run make. Do not
  modify the README.md file directly, instead go into the docs folder
  and modify the README.md.template.
-->
# Tout JS SDK Embed Code

This project contains the JS SDK Embed Code that [Tout](http://www.tout.com)
partners can use to embed the Tout video player technology on their
website. For more detailed instructions or support, please contact 
your Tout account manager. 

## Version
The current version of the JS SDK Embed Code is: 1.1.1

## Usage
To use the embed code on your site, insert the following script before
the ending ```</head>``` tag in your site template:

```
<script>
  !function(){if(window.TOUT=window.TOUT||{},!TOUT._sdkScriptTagParsedAt){TOUT._sdkScriptTagParsedAt=new Date,TOUT.EMBED_CODE_VERSION="1.1.1";var e=TOUT.SDK_HOST||"platform.tout.com",t=TOUT.SDK_ANALYTICS_HOST||"analytics.tout.com";TOUT.onReady=function(e){return TOUT._onReadyQueue=TOUT._onReadyQueue||[],TOUT._onReadyQueue.push(e),TOUT},TOUT.init=function(n,T){T=T||{};var o="tout-js-sdk";if(document.getElementById(o)&&!T.forceInit)return TOUT;if(n=TOUT.SDK_BRAND_UID||n,"undefined"==typeof n||"string"!=typeof n||0===n.length||n.length>7){var r=new Image;return r.src="http://"+t+"/events?trigger=sdk_log&log_level=error&log_message=BRAND_UID_NOT_DEFINED&content_page_url="+encodeURIComponent(window.location.href),console&&console.error&&console.error("TOUT - Invalid Brand UID: "+n),TOUT}TOUT._initOptions=T;var a=document.createElement("script");a.type="text/javascript",a.src="//"+e+"/sdk/v1/"+n+".js",a.id=o,a.className="tout-sdk";var s=document.getElementsByTagName("script")[0];return s.parentNode.insertBefore(a,s),TOUT}}}();
  TOUT.init("PUT_YOUR_BRAND_UID_HERE");
</script>
```

You must replace the string `PUT_YOUR_BRAND_UID_HERE` with the Tout
Brand UID that was provided to you by your Tout account manager.

You will also have to place our custom product ```<div>``` codes in the
appropriate places where you want our products to appear in your page 
template. For more details, please contact your Tout account manager.

## For developers who are updating the embed code itself

### Building the distribution
Run the following command to generate the minified distribution of the
js code, the unit test helpers, and the project documentation. You must 
run this command before creating a new release.

```
make
```

### Running tests
Run the following command to execute the unit tests.

```
make test
```

### Running the lint tool
Run the following command to execute the lint tool.

```
make lint
```

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
VERSION=$(grep TOUT.EMBED_CODE_VERSION ${PROJECT_DIR}/src/index.js | cut -d"'" -f2)

# The sed command escapes ampersands so that they don't do the grouping
# replacement in the subsequent sed command.
MINIFIED_EMBED_CODE=$(cat ${PROJECT_DIR}/dist/tout-js-sdk-embed-code.min.js | sed 's/&/\\&/g')

# The sed delimiters for the embed code are CTRL-A to avoid conflict with characters in the replacement code itself. You can use a CTRL-A in the code by typing CTRL + V + A
sed -e"s##MINIFIED_JS_SDK_EMBED_CODE##$MINIFIED_EMBED_CODE" -e"s/##JS_SDK_EMBED_CODE_VERSION##/$VERSION/" <docs/README.md.template > README.md

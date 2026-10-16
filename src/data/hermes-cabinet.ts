// One place for how people install Cabinet, the Hermes Desktop plugin.
//
// Hermes Desktop opens hermes:// links and installs the plugin they name. Until Cabinet is listed in the Hermes
// plugin catalog (NousResearch/hermes-agent#139267), the button installs straight from GitHub and Hermes marks it
// Unverified. Once the catalog lists it, flip CABINET_CATALOG_LISTED to true: the button then installs the reviewed
// catalog pin, and the in-app steps point people to Capabilities, then Plugins.
export const CABINET_CATALOG_LISTED = false;

export const CABINET_CATALOG_NAME = "bot-cabinet";
export const CABINET_REPO = "Dgardenhire/hermes-cabinet";
export const CABINET_REPO_URL = `https://github.com/${CABINET_REPO}`;
export const CABINET_VERSION = "0.3.9";
export const CABINET_MIN_HERMES = "0.22.0";

export const CABINET_INSTALL_URL = CABINET_CATALOG_LISTED
  ? `hermes://plugin/install?catalog=${CABINET_CATALOG_NAME}`
  : `hermes://plugin/install?repo=${CABINET_REPO}&enable=1`;

export const CABINET_INSTALL_COMMAND = `hermes plugins install ${CABINET_REPO} --enable`;

export const CABINET_MANUAL_PATH = "/hermes/manual/";
export const CABINET_MANUAL_URL = `https://botcabinet.com${CABINET_MANUAL_PATH}`;

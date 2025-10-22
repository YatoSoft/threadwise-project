import debug from "debug";

export default {
	log: debug("app:log"),
	error: debug("app:error"),
	warning: debug("app:warning"),
	debug: debug("app:debug"),
};

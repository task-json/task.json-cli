const re = /\.version\("v(\d\.\d\.\d)"\)/;

const appTracker = {
	filename: "src/app.ts",
	updater: {
		readVersion: (contents) => contents.match(re)[1],
		writeVersion: (contents, version) => contents.replace(re, `.version("v${version}")`)
	}
};

module.exports = {
	// read version
	packageFiles: [appTracker, "package.json", "package-lock.json"],
	// write version
	bumpFiles: [appTracker, "package.json", "package-lock.json"]
};

const re = /\.version\("v(\d\.\d\.\d)"\)/;

const appTracker = {
	filename: "src/app.ts",
	updater: {
		readVersion: (contents) => contents.match(re)[1],
		writeVersion: (contents, version) => contents.replace(re, `.version("v${version}")`)
	}
};

module.exports = {
  types: [
    {"type": "feat", "section": "Features"},
    {"type": "fix", "section": "Bug Fixes"},
    {"type": "chore", "section": "Misc"},
    {"type": "docs", "section": "Misc"},
    {"type": "style", "section": "Misc"},
    {"type": "refactor", "section": "Misc"},
    {"type": "perf", "section": "Misc"},
    {"type": "test", "section": "Misc"}
  ],
	// read version
	packageFiles: [appTracker, "package.json", "package-lock.json"],
	// write version
	bumpFiles: [appTracker, "package.json", "package-lock.json"]
};

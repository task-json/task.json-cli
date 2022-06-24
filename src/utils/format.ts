/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 * 
 * Format output
 */

import chalk, { Color } from "chalk";
import { X509Certificate } from "node:crypto";

const colorize = (key: string, color?: Color) => {
	if (!color) {
		return key;
	}
	return chalk[color](key);
};


/**
 * Print attributes.
 * Each row is formatted as `key: value`
 * 
 * @param rows 
 */
export function printAttrs(attrs: [string, string][], options?: {
	keyColor?: Color,
	/// prefix in each row
	prefix?: string
}) {
	const prefix = options?.prefix ?? "";
	for (const [key, value] of attrs) {
		console.log(`${prefix}${colorize(key, options?.keyColor)}: ${value}`);
	}
}


export function printCert(cert: X509Certificate, options?: {
	keyColor?: Color,
	/// prefix in each row
	prefix?: string
}) {
	const prefix = options?.prefix ?? "";
	console.log(`${prefix}${colorize("Subject", options?.keyColor)}:`);
	console.log(
		cert.subject.split("\n")
			.map(v => `${prefix}  ${v}`)
			.join("\n")
	);
	console.log(`${prefix}${colorize("Fingerprint", options?.keyColor)}: ${cert.fingerprint}`);
}

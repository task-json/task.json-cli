/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 * 
 * Format output
 */

import chalk, { Color } from "chalk";

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
	const colorize = (key: string) => {
		const color = options?.keyColor;
		if (!color) {
			return key;
		}
		return chalk[color](key);
	};

	const prefix = options?.prefix ?? "";
	for (const [key, value] of attrs) {
		console.log(`${prefix}${colorize(key)}: ${value}`);
	}
}

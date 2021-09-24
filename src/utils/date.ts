import { DateObjectUnits, DateTime, DurationLike, DurationUnit, DurationUnits, Interval } from "luxon";

export function parseDate(dateStr: string) {
	let dt: DateTime | undefined = undefined;
	// relative date
	if (/^(\d+[a-z])+$/.test(dateStr)) {
		// get all matches
		const groups = dateStr.match(/\d+[a-z]/g)!;
		for (const group of groups) {
			const num = parseInt(group.substr(0, group.length - 1));
			const unit = group.charAt(group.length - 1);
			const duration: DurationLike = {};
			switch (unit) {
				case "y":
					duration.years = num;
					break;
				case "q":
					duration.quarters = num;
					break;
				case "M":
					duration.months = num;
					break;
				case "w":
					duration.weeks = num;
					break;
				case "d":
					duration.days = num;
					break;
				case "h":
					duration.hours = num;
					break;
				case "m":
					duration.minutes = num;
					break;
				case "s":
					duration.seconds = num;
					break;
				default:
					throw new Error(`Invalid date: ${dateStr}`)
			}
			dt = DateTime.now().plus(duration);
		}
	}
	// absolute (with optional date or optional time)
	else if (dateStr.length !== 0 && /^((\d{4}-)?\d{2}-\d{2})?([.\s]\d{2}:\d{2})?$/.test(dateStr)) {
		const date: DateObjectUnits = {};

		const dateGroups = dateStr.match(/((\d{4})-)?(\d{2})-(\d{2})/);
		if (dateGroups) {
			if (dateGroups[2])
				date.year = parseInt(dateGroups[2]);
			date.month = parseInt(dateGroups[3]);
			date.day = parseInt(dateGroups[4]);
		}

		const timeGroups = dateStr.match(/(\d{2}):(\d{2})/)
		if (timeGroups) {
			date.hour = parseInt(timeGroups[1]);
			date.minute = parseInt(timeGroups[2]);
		}

		dt = DateTime.fromObject(date);
	}

	if (dt === undefined)
		throw new Error(`Invalid date: ${dateStr}`)
	
	return dt.toISO();
}

export function showDate(dateStr: string) {
	const dt = DateTime.fromISO(dateStr);
	const units: DurationUnits = ["years", "months", "days", "hours", "minutes", "seconds"];
	const shortUnit = (unit: DurationUnit) => {
		let short = unit.charAt(0);
		if (short === "m" && unit === "months")
			short = "M";
		return short;
	};

	const duration = dt.diffNow(units);
	for (const unit of units) {
		const value = duration[unit];
		if (value < 0)
			return "x";
		if (value > 0) {
			if (unit === "seconds")
				return "<1m";
			return `${value}${shortUnit(unit)}`;
		}
	}

	return "0";
}

import {InfluxDB, Point} from '@influxdata/influxdb-client';


/**
 * Initialize InfluxDB Client.
 *
 * @param url
 * @param token
 */
export function initClient(url: string, token: string): InfluxDB {
	return new InfluxDB({url, token});
}


/**
 * Write data to InfluxDB 2.x.
 *
 * https://influxdata.github.io/influxdb-client-js/influxdb-client.writeprecisiontype.html
 * ttps://influxdata.github.io/influxdb-client-js/influxdb-client.writeoptions.html
 *
 * @param client
 * @param data
 * @param org
 * @param bucket
 * @param measurement
 * @param tags
 * @param fields
 * @param defaultTags
 * @param timestampField
 */
export async function writeData(client: InfluxDB, data: [], org: string, bucket: string, measurement: string, tags: string[], fields: string[], defaultTags = {}, timestampField = '') {
	const writeApi = client.getWriteApi(org, bucket); //: WriteApi
	writeApi.useDefaultTags(defaultTags);
	for (const dataItem of data) {
		// initialize point
		let point = new Point(measurement);

		// adding tags
		for (const tag of tags) {
			point = point.tag(tag, dataItem[tag] as string);
		}

		// adding fields
		for (const field of fields) {
			switch (typeof dataItem[field]) {
				case 'boolean': {
					point = point.booleanField(field, dataItem[field] as boolean);
					break;
				}
				case 'number': {
					if (Number.isInteger(dataItem[field])) { // int
						point = point.intField(field, dataItem[field] as number);
						break;
					} else { // float
						point = point.floatField(field, dataItem[field] as number);
						break;
					}
				}
				case 'string': {
					point = point.stringField(field, dataItem[field] as string);
					break;
				}
				default: {
					point = point.stringField(field, dataItem[field]);
					break;
				}
			}
		}

		// adding timestamp
		if (timestampField) {
			if (dataItem[timestampField]) {
				const timestampValue = new Date(dataItem[timestampField]);
				if (timestampValue) {
					point = point.timestamp(timestampValue);
				}
			}
		}

		// writing data
		writeApi.writePoint(point);
	}

	await writeApi.close();
	return data;
}


/**
 * Query data from InfluxDB 2.x.
 *
 * @param client
 * @param org
 * @param query
 */
export function queryData(client: InfluxDB, org: string, query: string): Promise<object[]> {
	const queryApi = client.getQueryApi(org);
	const results: object[] = [];
	return new Promise<object[]>((resolve, reject) => {
		queryApi.queryRows(query, {
			next(row, tableMeta) {
				const parsedObject = tableMeta.toObject(row);
				results.push(parsedObject);
			},
			error(error) {
				reject(error);
			},
			complete() {
				resolve(results);
			},
		});
	});
}

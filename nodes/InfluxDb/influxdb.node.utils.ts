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
					point = point.stringField(field, dataItem[field] as string);
					break;
				}
			}
		}

		// adding timestamp
		if (timestampField) {
			point = point.timestamp(new Date(dataItem[timestampField]));
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
				// const columns = tableMeta.columns;
				// console.log('columns => ', columns);
				// console.log('row => ', row);
				// console.log('object => ', parsedObject);
				// console.log(`object_formatted => ${parsedObject._time} ${parsedObject._measurement}: ${parsedObject._field}=${parsedObject._value}`);
				results.push(parsedObject);
			},
			error(error) {
				// console.error(error);
				// console.log('Finished ERROR');
				reject(error);
			},
			complete() {
				// console.log('Finished SUCCESS');
				resolve(results);
			},
		});
	});
}

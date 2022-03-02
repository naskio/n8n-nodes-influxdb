import {InfluxDB} from '@influxdata/influxdb-client';
import {initClient, queryData, writeData} from '../nodes/InfluxDb/influxdb.node.utils';

const URL = process.env.URL as string;
const TOKEN = process.env.TOKEN as string;
const ORGANIZATION = process.env.ORGANIZATION as string;
const BUCKET = process.env.BUCKET as string;


test('Init Client', async () => {
	const client = initClient(URL, TOKEN);
	expect(client).toBeInstanceOf(InfluxDB);
});


test('Write Data', async () => {
	const client = initClient(URL, TOKEN);

	const measurement = 'test_measurement';
	const tags = ['tag1', 'tag2'];
	const fields = ['valueFloat', 'valueInt', 'valueString', 'valueBoolean'];
	const defaultTags = {region: 'north_africa_0', host: 'nask.io'};
	const timestampField = 'createdAt';
	// const timestampField = '';

	const data = [{
		tag1: 'tagValue1',
		tag2: 'tagValue2',
		valueFloat: 11.85,
		valueInt: 3,
		valueString: 'stringValue',
		valueBoolean: true,
		createdAt: new Date(2025, 3).toISOString(),
	}];

	const res = await writeData(client, data as [], ORGANIZATION, BUCKET, measurement, tags, fields, defaultTags, timestampField);
	console.log(res);
});


test('Query Data', async () => {
	const client = initClient(URL, TOKEN);

	const query = `from(bucket: "${BUCKET}") |> range(start: -1h)`;

	const res = await queryData(client, ORGANIZATION, query);
	console.log('--- Query Data ---');
	console.log('res', res);
});

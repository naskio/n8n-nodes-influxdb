import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError
} from 'n8n-workflow';

import {
	nodeDescription,
} from './influxdb.node.options';

import {initClient, queryData, writeData} from './influxdb.node.utils';


export class InfluxDb implements INodeType {
	description: INodeTypeDescription = nodeDescription;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let results: IDataObject[] | IDataObject = [];
		try {
			// get credentials
			const credentials = await this.getCredentials('influxDb');
			if (credentials === undefined) {
				throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
			}
			const url = credentials.url as string;
			const token = credentials.token as string;
			const defaultOrg = credentials.org as string;
			const defaultBucket = credentials.bucket as string;

			// get params
			const operation = this.getNodeParameter('operation', 0) as string;

			const client = initClient(url, token);

			if (operation === 'write') {
				const measurement = this.getNodeParameter('measurement', 0) as string;
				const tags = (this.getNodeParameter('tags', 0) as string).split(',')
					.map(f => f.trim())
					.filter(f => !!f);
				const fields = (this.getNodeParameter('fields', 0) as string).split(',')
					.map(f => f.trim())
					.filter(f => !!f);
				const defaultTagsOptions = this.getNodeParameter('defaultTags', 0) as IDataObject;
				const defaultTagsList = (defaultTagsOptions.defaultTag as IDataObject[]).map(v => {
					return {
						defaultTagName: (v.defaultTagName as string).trim(),
						defaultTagValue: v.defaultTagValue,
					};
				}).filter(v => !!v.defaultTagName);
				const defaultTags = defaultTagsList.reduce((obj: IDataObject, item) => {
					obj[item.defaultTagName as string] = item.defaultTagValue;
					return obj;
				}, {});

				const options = this.getNodeParameter('options', 0) as IDataObject;
				const orgOverride = options.org as string;
				const bucketOverride = options.bucket as string;
				const timestampField = ((options.timestampField || '') as string).trim();

				const org = (orgOverride || defaultOrg) as string;
				const bucket = (bucketOverride || defaultBucket) as string;

				const data = this.getInputData().map(v => v.json) as [];
				results = await writeData(client, data, org, bucket, measurement, tags, fields, defaultTags, timestampField);

			} else if (operation === 'query') {
				const query = this.getNodeParameter('query', 0) as string;
				const options = this.getNodeParameter('options', 0) as IDataObject;
				const orgOverride = options.org as string;

				const org = (orgOverride || defaultOrg) as string;

				results = await queryData(client, org, query) as IDataObject[];

			} else {
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
			}
		} catch (err) {
			const exception = err as Error;
			if (this.continueOnFail()) {
				results = {error: exception.toString()};
			} else {
				throw err;
			}
		}
		return this.prepareOutputData(this.helpers.returnJsonArray(results));
	}
}

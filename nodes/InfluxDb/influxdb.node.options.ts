import {
	INodeTypeDescription,
} from 'n8n-workflow';

/**
 * Options to be displayed
 */
export const nodeDescription: INodeTypeDescription = {
	displayName: 'InfluxDB',
	name: 'influxDb',
	icon: 'file:influxdb.svg',
	group: ['input'],
	version: 1,
	description: 'Write query data in InfluxDB 2.x',
	defaults: {
		name: 'InfluxDB',
		color: '#22ADF6',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'influxDb',
			required: true,
		},
	],
	properties: [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			options: [
				{
					name: 'Write',
					value: 'write',
					description: 'Write data.',
				},
				{
					name: 'Query',
					value: 'query',
					description: 'Query data.',
				},
			],
			default: 'write',
			description: 'The operation to perform.',
			required: true,
		},

		// ----------------------------------
		//         write
		// ----------------------------------
		{
			displayName: 'Measurement',
			name: 'measurement',
			type: 'string',
			displayOptions: {
				show: {
					operation: [
						'write',
					],
				},
			},
			required: true,
			default: '',
			placeholder: 'my_measurement',
			description: 'Measurement (ie table).',
		},
		{
			displayName: 'Tags',
			name: 'tags',
			type: 'string',
			displayOptions: {
				show: {
					operation: [
						'write',
					],
				},
			},
			required: true,
			default: '',
			placeholder: 'host,region',
			description:
				'Comma separated list of the properties which will be used as tags (ie indexed columns).',
		},
		{
			displayName: 'Fields',
			name: 'fields',
			type: 'string',
			displayOptions: {
				show: {
					operation: [
						'write',
					],
				},
			},
			required: true,
			default: '',
			placeholder: 'name,value,price',
			description:
				'Comma separated list of the properties which will be used as fields (ie no-indexed columns).',
		},
		{
			displayName: 'Default Tags',
			name: 'defaultTags',
			placeholder: 'Add new default tag',
			description: 'Add default tags.',
			type: 'fixedCollection',
			displayOptions: {
				show: {
					operation: [
						'write',
					],
				},
			},
			typeOptions: {
				multipleValues: true,
				sortable: true,
			},
			default: {},
			options: [
				{
					displayName: 'Default Tag',
					name: 'defaultTag',
					values: [
						{
							displayName: 'Default Tag Name',
							name: 'defaultTagName',
							type: 'string',
							default: '',
							required: true,
							placeholder: 'region',
							description: 'The default tag name.',
						},
						{
							displayName: 'Default Tag Value',
							name: 'defaultTagValue',
							type: 'string',
							default: '',
							required: true,
							placeholder: 'north-africa-1',
							description: 'The default tag value.',
						},
					],
				},
			],
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			displayOptions: {
				show: {
					operation: [
						'write',
					],
				},
			},
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Timestamp Field',
					name: 'timestampField',
					type: 'string',
					default: '',
					placeholder: 'createdAt',
					description:
						'The name of the property which will be used to get the timestamp.',
				},
				{
					displayName: 'Organization',
					name: 'org',
					type: 'string',
					default: '',
					placeholder: 'my_org',
					description: 'Override default organization (ie workspace).',
				},
				{
					displayName: 'Bucket',
					name: 'bucket',
					type: 'string',
					default: '',
					placeholder: 'my_bucket',
					description: 'Override default bucket (ie database).',
				},
			],
		},

		// ----------------------------------
		//         query
		// ----------------------------------
		{
			displayName: 'Query (Flux Language)',
			name: 'query',
			type: 'string',
			typeOptions: {
				alwaysOpenEditWindow: true,
				rows: 5,
			},
			displayOptions: {
				show: {
					operation: [
						'query',
					],
				},
			},
			required: true,
			default: '',
			placeholder: `from(bucket: "my_bucket")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r["_measurement"] == "my_measurement")`,
			description: 'InfluxDB query in Flux Language.',
			// noDataExpression: true,
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			displayOptions: {
				show: {
					operation: [
						'query',
					],
				},
			},
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Organization',
					name: 'org',
					type: 'string',
					default: '',
					placeholder: 'my_org',
					description: 'Override default organization (ie workspace).',
				},
			],
		},
	],
};

import {ICredentialType, INodeProperties} from 'n8n-workflow';


export class InfluxDb implements ICredentialType {
	name = 'influxDb';
	displayName = 'InfluxDB 2.x';
	properties: INodeProperties[] = [
		{
			displayName: 'Url',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'http://127.0.0.1:8086',
			required: true,
			description: 'url of InfluxDB 2.x instance.',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Generated API Token from InfluxDB 2.x.',
		},
	];
}

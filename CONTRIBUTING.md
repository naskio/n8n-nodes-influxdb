# Contributing

## Setup

Install dependencies:

```shell
yarn install
```

## Update dependencies and dev dependencies to latest versions

```shell
yarn run update
```

## Run

Use `demo/run_demo.sh` to run n8n with `n8n-nodes-influxdb` installed.

```shell
./demo/run_demo.sh
# or
yarn run demo
# or
yarn run demo:build
```

## Release

To release a new version, create a new release (with tag) on GitHub.

To cancel a release, delete the release on GitHub, remove the tag on GitHub and un-publish the version from npmjs.org.

```shell
VERSION=0.1.0; npm unpublish n8n-nodes-influxdb@$VERSION
```

## Overview

This n8n-node use [@influxdata/influxdb-client](https://github.com/influxdata/influxdb-client-js) to connect and run
queries to InfluxDB 2.x.


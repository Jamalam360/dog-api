A reimplementation of [the dog API](https://dog.ceo/dog-api/) with Deno, Oak and
the GitHub API.

To submit an image, use the repository
[dog-images](https://github.com/dog-jamalam-tech/images).

## Usage

The current API version is `v0`. It's documentation can be found
[here](docs/V0.md)

The base endpoint for every version is
`https://dog.jamalam.tech/api/<api version>` (example:
`https://dog.jamalam.tech/api/v0`).

## Self Hosting

This reimplementation was designed to be much easier to self-host. To get
started, simply clone this repository and run the following commands:

`deno run -A --import-map=import_map.json index.ts`

You will then be prompted on whether you want to generate a default
configuration file. After answering yes, the program will exit and you should
navigate to `api_config.json` and fill in your values.

This is the configuration file that the `dog.jamalam.tech` instance uses, for
reference:

```json
{
  "port": 8004, //Redirected via NGINX in the case of this instance
  "https": {
    "secure": true,
    "certFile": "/path/to/cert/file",
    "keyFile": "/path/to/key/file"
  },
  "imageRepository": "https://github.com/dog-jamalam-tech/images",
  "recacheInterval": "1 */30 * * * *", //Every 30 minutes. This is cron syntax
  "githubToken": "REDACTED",
  "cacheFile": "cache.json"
}
```

You **must** generate a personal access token from your GitHub account and enter
it into `githubToken`, without this the GitHub API has a rate limit of 60
requests per hour, which won't work for this project.

> Smuggle


## Install

```shell
$ npm i
```


## Config

Generate a starter config.

```shell
$ smuggle init
```


## Run

```shell
$ smuggle [--config smuggle.json]
```


## Options

**Example Config**

```json
{
    "repos": {
        "smuggle-test": {
            "type": "gitlab",
            "path": "/home/user/localhost/smuggle-test",
            "requiredHeaders": {
                "x-gitlab-event": "Pipeline Hook",
                "x-gitlab-token": "abc123"
            },
            "reset": true,
            "action": "pull",
            "branch": "master",
            "postActions": [
                "echo 'Building application'",
                "npm run build",
                "echo 'Restarting PM2 instance'",
                "sudo pm2 restart smuggle-test",
                "echo 'Cleaning up'",
                "sh /path/to/cleanup.sh"
            ]
        }
    }
}
```

| Key                             | Type                          | Required | Default    | Description
| ------------------------------- | ----------------------------- | -------- | ---------- | -------------
| repos                           | `Object`                      | Yes      | -          | One or more repository config
| repos.{name}                    | `Object`                      | Yes      | -          | Name of the repo (key) and config options (value)
| repos.{name}.type               | `Enum("gitlab", "github")`    | Yes      | -          | Type of Git hosting service
| repos.{name}.path               | `String`                      | Yes      | -          | Source location of the repo
| repos.{name}.requiredHeaders    | `Object`                      | No       | `{}`       | Optional required headers to expect from webhook
| repos.{name}.reset              | `Boolean`                     | No       | `False`    | If a `git reset --hard` should be performed before updating repo
| repos.{name}.action             | `Enum("pull", "fetch/merge")` | No       | `"pull"`   | Type of operation to use when updating repo
| repos.{name}.branch             | `String`                      | No       | `"master"` | Branch to perform `action` on
| repos.{name}.postActions        | `Array[String]`               | No       | `[]`       | Optional, arbitrary commands to execute after updating repo


## Running `sudo` Commands

> *Experimental*

If you need to execute `postActions` as root, run Smuggle as a user with privileges.

```shell
# Run Smuggle as 'myuser', assuming there
# is a 'smuggle.json' in the same directory
$ su -c smuggle myuser

# Run Smuggle as 'myuser' with options
$ su - myuser -c 'smuggle --config "/path/to/smuggle.json"'
```


## TODO

- Add option to verify os.hostname() matches payload's reported host
- Handle `sudo` more intelligently
- Docker container for testing

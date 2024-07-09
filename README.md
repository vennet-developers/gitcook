<br>
<p align="center">
  <a href="https://vennet.dev/projects/gitcook">
    <img src="https://cdn.vennet.dev/gitcook/logo.png" width="300px" height="92px" alt="Vennet | Git Cook"/>
  </a>
</p>

<h1 align="center">✨ CLI tool for everybody ✨</h1>

<br>

Esto es un cambio

Cli tools is a powerfull tool for standarize the commits and changelogs for your teams.

<br />

## Minimum requirements

- Node v20.0.0 or higher / npm v9.5.4 or higher
- Git v2.23 or higher

<br />

## Roadmap

- Command to changelog generation based from coventional commits standar.
- Validates tags format in the commit footer.
- Command to register local git projects and automatize the sync of multiple repositories.
- Integrate ChatGPT to generation of conventional commits quickly.

<br />

## Installation

To use Git Cook, all you need to do is install the
`@vennet/gitcook` package globally:

```sh
# with yarn
$ yarn add @vennet/gitcook -g

# with npm
$ npm i @vennet/gitcook -g

# with pnpm
$ pnpm add @vennet/gitcook -g

# with bun
$ bun add @vennet/gitcook -g
```

<br>

## Usage

The command base for execute the tool is `gcook` with the following base and specific commands availables.

<br>

### Base Commands

```sh
gcook [options] [command]
```

| Commands | Description                                    | Examples       |
|----------|------------------------------------------------|----------------|
| `check`  | Check if the package is up to date             | `gcook check`  |
| `stats`  | Get all downloads of the package               | `gcook stats`  |
| `help`   | Get all descriptions from command or from base | `gcook help`   |
| `init`   | Wizard to create a branch               | `gcook init`   |
| `commit` | Wizard to create a conventional commit         | `gcook commit` |

### Base Options

```sh
gcook [options]
```

| Options          | Description                   | Examples                     |
| ---------------- | ----------------------------- | ---------------------------- |
| `-h` `--help`    | Display help for command      | `gcook -h` `gcook --help`    |
| `-V` `--version` | Get latest version of package | `gcook -V` `gcook --version` |

### `init` Options

```sh
gcook init [options]  Wizard to create a branch
```

| Options         | Description                                                               | Examples                              |
|-----------------|---------------------------------------------------------------------------|---------------------------------------|
| `-c` `--custom` | Active custom branch name creation | `gcook init -c` `gcook init --custom` |

### `commit` Options

```sh
gcook commit [options]  Wizard to create a conventional commit
```

| Options                | Description                                                               | Examples                                       |
|------------------------|---------------------------------------------------------------------------|------------------------------------------------|
| `-pm` `--preview-mode` | Generate the final commit message without execute git commands internally | `gcook commit -pm` `gcook commit --preview-mode` |
| `-cm` `--compact-mode` | Generate a simple commit message without body and footer                  | `gcook commit -cm` `gcook commit --compact-mode`   |

<br>

### Output example from help command

```sh
$: gcook -h

Usage: gcook [options] [command]

CLI to manage git actions easily

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  check             Checks if you are up to date
  stats             Check how many downloads has the tool
  init [options]    Init a new branch locally and remotely based of user selection
  commit [options]  Wizard to create a conventional commit
  help [command]    display help for command
```

<br>

## License

[Vennet @ MIT](https://github.com/vennet-developers/gitcook/blob/main/LICENSE)

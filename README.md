# dbt Studio Templates

A public registry of pipeline templates for [dbt Studio](https://github.com/rosettadb). Studio's "Browse Templates" option reads `pipelines.json` from this repo to list available templates and lets users scaffold a pipeline from one with a single click.

## Structure


## `pipelines.json` schema

An array of template entries:

| Field         | Required | Description                                                              |
|---------------|----------|---------------------------------------------------------------------------|
| `id`          | yes      | Unique, stable identifier for the template                               |
| `label`       | yes      | Display name shown in Studio                                             |
| `description` | yes      | Short description shown in Studio                                        |
| `badge`       | no       | Small label chip (e.g. `"Community"`, `"Recommended"`)                   |
| `badgeColor`  | no       | One of `success`, `warning`, `primary`, `info`                           |
| `steps`       | yes      | Ordered list of human-readable step names, shown as a preview in Studio  |
| `fileName`    | yes      | File name the pipeline will be saved as inside the user's `.rosetta/` dir |
| `url`         | yes      | Raw GitHub URL to the corresponding file under `pipelines/`              |

## Adding a new template

1. Add a `pipelines/{your-template}.yml` file. It must be a valid dbt Studio pipeline config: a top-level `name` plus a `jobs` list, where each job has a `name` and `steps`, and each step has a `name`, `plugin`, and `command`.
2. Add an entry to `pipelines.json` pointing `url` at the raw GitHub URL for that file (`https://raw.githubusercontent.com/rosettadb/dbt-studio-templates/main/pipelines/{your-template}.yml`).
3. Open a PR.

## License

MIT

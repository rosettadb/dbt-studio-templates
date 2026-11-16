# Publishing a product on the Rosetta Hub

The [Hub](https://cloud.rosettadb.io/products) lists public **datasets**,
**pipelines** and **projects** for Rosetta dbt Studio. It only lists them: your
files stay where you publish them. There are two ways to get listed.

| | Pull request to this repository | Form on the Hub |
|---|---|---|
| Where | `products/<id>/product.json` here | *Submit a product* on the Hub (needs an account) |
| Review | Maintainers review the pull request; merging publishes it within the hour | A reviewer approves it; you get a notification |
| Updates | Another pull request | *Edit* on your product's page; the change is reviewed again |

Both produce the same listing. Use a pull request if you want the history in
git; use the form if you just want to fill in fields.

## What can be listed

- **Dataset**: a link to the dataset's public page (Hugging Face, GitHub,
  Zenodo, or any https page).
- **Pipeline**: one Rosetta pipeline file (`.yml`) in a public GitHub
  repository. Studio saves it as `rosetta/pipelines/<fileName>` in a project.
- **Project**: a whole public GitHub repository that Studio extracts into a
  project folder (a dbt project, usually with a pipeline).

Rules:

- You must have the right to publish it, and it needs a license
  ([SPDX identifier](https://spdx.org/licenses/), e.g. `MIT`, `Apache-2.0`,
  `CC-BY-4.0`).
- Pipelines and projects are **pinned to one commit**. What was reviewed is
  what people get; to publish a newer version, change the commit in a new pull
  request (or edit your submission on the Hub).
- Pipelines and projects run commands on other people's machines. Keep them
  readable: no obfuscated commands, no downloads from places a reviewer cannot
  inspect, no secrets.
- Write the summary and description yourself. Do not paste another site's
  text, and only add a logo you may publish.

## Adding a product with a pull request

1. Create a folder `products/<id>/`. The id is 3 to 64 lowercase letters,
   digits and single dashes; it becomes the product's address
   (`/products/<id>`) and cannot change later.
2. Add `product.json` (fields below). Optionally add `README.md` (the long
   description on the product's page, plain text) and a logo (PNG, JPEG, GIF
   or WebP, up to 2 MB, no SVG; it is resized to at most 512 pixels).
3. Open the pull request. The *Validate products* check must be green.

### Dataset

```json
{
  "schemaVersion": 2,
  "id": "nyc-taxi-trips",
  "type": "dataset",
  "name": "NYC Taxi Trips",
  "summary": "Yellow and green taxi trip records, monthly Parquet files.",
  "author": { "name": "Jane Doe", "url": "https://github.com/janedoe" },
  "license": "CC0-1.0",
  "tags": ["parquet", "transport"],
  "logo": "logo.png",
  "source": {
    "provider": "huggingface",
    "url": "https://huggingface.co/datasets/janedoe/nyc-taxi-trips"
  }
}
```

`source.provider` is `huggingface`, `github`, `zenodo` or `url`; `source.url`
must be on that site (any https page for `url`).

### Pipeline

A pipeline file kept in this repository, next to its `product.json` (leave
`source.ref` out: it is pinned to the commit that gets published):

```json
{
  "schemaVersion": 2,
  "id": "basic-dbt",
  "type": "pipeline",
  "name": "Basic dbt Pipeline",
  "summary": "Installs dependencies and runs dbt tests.",
  "license": "MIT",
  "tags": ["dbt", "starter"],
  "source": {
    "provider": "github",
    "repo": "rosettadb/dbt-studio-templates",
    "path": "products/basic-dbt/pipeline.yml"
  },
  "fileName": "basic-dbt.yml",
  "steps": ["dbt deps", "dbt test", "teardown"]
}
```

A pipeline file in **your own** repository needs the full commit SHA:

```json
"source": {
  "provider": "github",
  "repo": "janedoe/analytics",
  "ref": "0123456789abcdef0123456789abcdef01234567",
  "path": "rosetta/pipelines/daily.yml"
}
```

The pipeline file must be a valid Rosetta pipeline: a top-level `name` and a
`jobs` list; each job has a `name` and `steps`; each step has a `name`, a
`plugin` and a `command`.

### Project

```json
{
  "schemaVersion": 2,
  "id": "bigquery-pipeline",
  "type": "project",
  "name": "BigQuery Pipeline Project",
  "summary": "Full dbt project for BigQuery with Terraform setup and teardown.",
  "license": "MIT",
  "tags": ["bigquery", "terraform", "dbt"],
  "source": {
    "provider": "github",
    "repo": "rosettadb/bigquery-pipeline-template",
    "ref": "7cd8142f2573f25d44d6fc0c5a0ed8aabec871be"
  },
  "steps": ["terraform apply", "rosetta apply", "dbt seed", "dbt run", "dbt test", "terraform destroy"]
}
```

The whole repository at that commit is the project.

## `product.json` fields

| Field | Required | Description |
|---|---|---|
| `schemaVersion` | yes | `2` |
| `id` | yes | Equals the folder name. Lowercase letters, digits, single dashes; 3 to 64 characters. |
| `type` | yes | `dataset`, `pipeline` or `project`. Cannot change later. |
| `name` | yes | Display name, up to 80 characters. |
| `summary` | yes | One or two sentences for the card, up to 200 characters. |
| `description` | no | Long text for the product's page (plain text). Left out: `README.md` of the folder is used. |
| `author` | no | `{ "name": "...", "url": "https://..." }` |
| `license` | yes | SPDX identifier. |
| `tags` | no | Up to 10; lowercase letters, digits, `+ . _ -`. |
| `logo` | no | File name of the logo in the product's folder. |
| `homepage` | no | https link to documentation or a project site. |
| `source.provider` | yes | `github` for pipelines and projects; `huggingface`, `github`, `zenodo` or `url` for datasets. |
| `source.url` | datasets | The dataset's public page. |
| `source.repo` | pipelines, projects | `owner/name` of a public GitHub repository. |
| `source.ref` | pipelines, projects | Full commit SHA (40 characters). May be left out only for a file in this repository. |
| `source.path` | pipelines | Path of the pipeline file in the repository. |
| `fileName` | pipelines | File name the pipeline is saved as in a project. |
| `steps` | no | Ordered step names shown as a preview (up to 20). |

The schema is `schema/product.schema.json`; unknown fields are rejected.

## Check locally

```sh
docker run --rm -v "$PWD:/repo" -w /repo node:24-alpine \
  sh -c "npm install --no-save ajv@8 >/dev/null && node scripts/validate.mjs"
```

## Removing or updating

- Update: change `product.json` (for a new version of a pipeline or project
  in another repository, the `source.ref` commit) in a pull request.
- Remove: delete the folder. The product is unlisted at the next sync.

## The older `pipelines.json` and `projects.json`

Studio 1.7 and older read `pipelines.json`, `projects.json` and `pipelines/`
directly. They stay as they are for those versions and are not used by the
Hub. New templates go under `products/`.

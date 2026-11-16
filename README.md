# dbt Studio Templates

The public registry behind the [Rosetta Hub](https://cloud.rosettadb.io/products):
datasets, pipeline templates and dbt projects for
[Rosetta dbt Studio](https://github.com/rosettadb).

Everything under `products/` is published on the Hub (synced every hour). A
merged pull request is the approval.

## Structure

```
products/<id>/product.json   one product (dataset, pipeline or project)
products/<id>/README.md      optional long description
products/<id>/pipeline.yml   a pipeline's file, when it is kept here
products/<id>/logo.png       optional logo
schema/product.schema.json   the product.json format (schemaVersion 2)
scripts/validate.mjs         the check pull requests must pass

pipelines.json, projects.json, pipelines/   legacy registry read by Studio 1.7 and older
```

## Publishing a product

See [CONTRIBUTING.md](CONTRIBUTING.md): the `product.json` format with
examples, the rules, and how to check a product before opening a pull
request. Prefer a form? Use *Submit a product* on the Hub.

## License

MIT (this repository's own templates). Every product states its own license
in `product.json`.

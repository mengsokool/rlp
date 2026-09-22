# docs.beenut

Developer documentation site for BeeNut.

BeeNut is a desktop runtime and operator UI for custom YOLO ONNX models. This repository contains the public documentation site, including English and Thai content, search data generation, localized routes, and the docs UI shell.

## Content

English docs live in:

```text
contents/docs/
```

Thai docs live in:

```text
contents/i18n/th/docs/
```

The site currently documents:

- Getting started
- Model files, labels, targets, and ONNX export
- Runtime configuration
- Camera and preview behavior
- Deployment on macOS and Linux
- Troubleshooting common model, camera, and detection issues

## Development

Install dependencies:

```bash
pnpm install
```

Generate search indexes:

```bash
pnpm run generate-content-json
```

Run the docs site:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

Build the production container:

```bash
docker build -t docs.beenut .
```

## Localization

The site supports:

- `/en`
- `/th`
- `/en/docs/...`
- `/th/docs/...`

Search indexes are generated per locale:

```text
public/search-data/documents.en.json
public/search-data/documents.th.json
```

`public/search-data/documents.json` remains as the default English index for compatibility.

## Project Notes

The project is built with Next.js, MDX, Tailwind CSS, TypeScript, and pnpm. The package metadata expects Node `24.x`; local builds on older Node versions may warn even when they still complete.

## License and Attribution

docs.beenut is licensed under the MIT License. This project includes code derived from Rubix Documents; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Deployment

The production site is deployed to Cloud Run as `docs-beenut` in `asia-southeast1`.

Pushes to `main` run `.github/workflows/deploy.yml`, build the Docker image, push it to Artifact Registry, and deploy the new revision.

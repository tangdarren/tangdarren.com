# Project screenshots

Drop project screenshots and hero images here. Suggested convention:

```
public/projects/<project-id>/hero.png
public/projects/<project-id>/screen-01.png
```

Then reference them from `src/data/projects.ts`:

- `image` — card/thumbnail hero image
- `screenshots` or `caseStudy.screenshots` — `{ src, alt }[]` for project case studies

Everything in `public/` is served directly. Only add images meant to be public.

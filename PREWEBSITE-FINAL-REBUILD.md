# Tervyxa Prewebsite — Final Rebuild

Scope: temporary public website / authority foundation while the full Tervyxa Systems website is developed separately.

## Non-negotiable rules

- Repository scope: this repository only.
- Public truth: Tervyxa Systems, Szczecin, Polska, kontakt@tervyxa.pl.
- No fabricated clients, case studies, testimonials, certifications, benchmark results, street address, founder/person identity or unapproved sameAs profiles.
- Preserve the existing hero asset `assets/tervyxa-hero-8k.png` and responsive WebP delivery.
- Polish remains the canonical primary language. `/en/` is an English overview only.
- No thin-content expansion merely to increase URL count.
- The future full Tervyxa Systems website remains a separate project and repository.

## Rebuild completed on 2026-08-11

The temporary site was normalized in-place instead of being expanded with new URL categories.

### Core and mobile layer

- Homepage and core company/service/solution/technology/contact architecture retained and normalized.
- Shared `content-pages.css` includes safe-area handling, mobile horizontal navigation, touch-scroll tables and an iOS/Safari fallback without expensive backdrop-filter composition.
- Homepage styling retains the responsive hero delivery and iOS/Safari stability treatment.

### Technology Authority

Existing technology leaves were upgraded for LLM, RAG, embeddings, reranking, Local AI, API integrations and AI infrastructure. Pages distinguish technology explanation from claims about any private production stack.

### Comparison Engine

Existing comparison pages were converted into decision-oriented pages with distinct criteria instead of generic template text. The cluster includes agent vs workflow, RAG vs fine-tuning, LLM vs classical automation, AI vs rules, RAG vs search, public vs private AI, Local AI vs cloud and open source vs SaaS.

### Solution Engine

Existing solution pages were normalized for:

- private AI assistant,
- AI knowledge base,
- document AI,
- AI agents,
- Local AI,
- process automation,
- integration of AI with existing systems.

The solution contract covers canonical metadata, social metadata, structured data, breadcrumbs/navigation, architecture, decision criteria, limitations/control and relevant internal links.

### Industry Authority

Existing pages for office work, logistics, small businesses, production and services were normalized around real process classes, boundaries of AI use and human control.

### Knowledge Authority

The ten existing `/wiedza/*` articles and the `/wiedza/` hub were cleaned of accumulated template layers and normalized around distinct intent. They use organizational authorship rather than an invented Person entity.

### Trust, evidence and tools

Verified public architecture includes:

- `/autor/` — organizational authorship and editorial responsibility; it does not identify a founder or Person entity,
- `/standardy/` and `/standardy-redakcyjne/`,
- `/laboratorium/` and `/laboratorium/metodologia-benchmarkow/`,
- `/benchmarki/` and `/research/benchmarki/`,
- `/centrum-wiedzy/`,
- `/narzedzia/`, checklist, automation calculator and `/raport-ai/`.

Benchmark and laboratory pages describe methodology and evidence gates. They do not publish invented benchmark results.

## Final normalization gates

### Public truth canaries

PASS:

- repository search for `Paweł`: no public match,
- repository search for `founder`: no public match,
- repository search for `streetAddress`: no public match,
- repository search for `sameAs`: no public match.

The absence of those tokens is not the only policy control, but it confirms that the final public layer did not accidentally introduce the prohibited founder/address/social-profile declarations.

### Domain and crawl infrastructure

PASS:

- `CNAME` = `tervyxa.pl`,
- `robots.txt` allows crawling and points to `https://tervyxa.pl/sitemap.xml`,
- sitemap was reconciled against the verified public architecture,
- `llms.txt` and `llms-full.txt` were reconciled with the same verified architecture and public-truth rules,
- `entity.json` remains the machine-readable organization record.

### Hero asset invariant

PASS:

- `assets/tervyxa-hero-8k.png`
- Git blob: `7fc62d33c3d5dd18c3e8c511cdb1b78da8b30bbc`
- size: 15,276,093 bytes

The file is preserved as the master/fallback asset. It is an upscale and must not be described as native 8K.

Responsive assets remain available at 640, 1280, 1920 and 2560 widths, plus `assets/tervyxa-og-1200.jpg`.

### GitHub Pages gate

PASS:

- source: `main` / `/`,
- custom domain: `tervyxa.pl`,
- HTTPS certificate: approved,
- HTTPS enforced: true,
- Pages build `1145924525` for content HEAD `3102763a89af3b2816e8fbb1e43527323f60b83b`: `built`, error `null`,
- freeze-check build `1145929389` for documentation checkpoint `14022760054c0928c756b76a0e8c016be5d5b484`: `built`, error `null`.

## Final verdict state

`PASS / REBUILD_COMPLETE / FORMALLY_FROZEN`

The temporary prewebsite rebuild is complete within the approved scope. Do not add new URL categories or broaden this repository into the future full Tervyxa Systems website unless the freeze is explicitly reopened.

Future changes to this temporary site should be limited to verified corrections, approved public facts, security/accessibility fixes or deliberate content updates. Any larger architecture belongs to the separate full Tervyxa Systems website project.

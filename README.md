# Tervyxa Systems — prewebsite

Oficjalna tymczasowa witryna Tervyxa Systems dla domeny `https://tervyxa.pl/`.

Prewebsite istnieje do czasu publikacji docelowego serwisu Tervyxa Systems. Jego rolą jest przedstawienie firmy, usług i kompetencji, zapewnienie spójnej publicznej warstwy informacji dla wyszukiwarek i systemów AI oraz utrzymanie lekkiego, statycznego frontendu.

## Public truth

- marka: **Tervyxa Systems**,
- alias: **Tervyxa**,
- domena kanoniczna: `https://tervyxa.pl/`,
- publiczna lokalizacja: **Szczecin, Polska**,
- publiczny kontakt: `kontakt@tervyxa.pl`,
- adres uliczny nie jest publikowany,
- osoba założyciela / Person schema nie jest publikowana,
- brak publicznie potwierdzonych klientów, case studies, referencji, certyfikatów i wyników wdrożeń,
- benchmarki mogą być publikowane wyłącznie z jawną metodyką i dowodem pomiaru.

## Główna architektura

### Firma i kontakt
- `/firma/`
- `/dlaczego-tervyxa/`
- `/o-nas/`
- `/standardy-redakcyjne/`
- `/kontakt/`
- `/ai-szczecin/`
- `/en/`

### Usługi i intencja komercyjna
- `/uslugi/`
- `/wdrozenie-ai-dla-firm/`
- `/audyt-ai/`
- `/automatyzacja-firmy-ai/`
- `/systemy-ai-dla-firm/`
- `/lokalne-ai-dla-firm/`
- `/ai-do-dokumentow/`
- `/automatyzacja-procesow/`

### Rozwiązania
- `/rozwiazania/`
- `/rozwiazania/prywatny-asystent-ai/`
- `/rozwiazania/baza-wiedzy-ai/`
- `/rozwiazania/ai-do-dokumentow/`
- `/rozwiazania/agent-ai/`
- `/rozwiazania/lokalne-ai/`
- `/rozwiazania/automatyzacja-procesow/`
- `/rozwiazania/integracja-ai-z-systemami/`

### Technologie
- `/technologie/`
- `/technologie/llm/`
- `/technologie/rag/`
- `/technologie/embedding/`
- `/technologie/reranking/`
- `/technologie/local-ai/`
- `/technologie/integracje-api/`
- `/technologie/infrastruktura-ai/`

### Wiedza, odpowiedzi i porównania
- `/wiedza/` — 10 artykułów,
- `/pytania/` — answer-first / AEO,
- `/porownania/` — strony decyzyjne,
- `/research/` — metodologia, wzorce oceny i warstwa evidence-first.

### Branże
- `/ai-dla-biura/`
- `/ai-dla-logistyki/`
- `/ai-dla-malych-firm/`
- `/ai-dla-produkcji/`
- `/ai-dla-uslug/`

## Warstwa AI Search / GEO / AEO

Repo zawiera:
- `entity.json`,
- `llms.txt`,
- `llms-full.txt`,
- `robots.txt`,
- `sitemap.xml`,
- kanoniczne URL-e,
- structured data dobrane do intencji strony,
- answer-first pages,
- comparison pages,
- research/evidence layer,
- spójne internal linking.

GEO/AEO jest traktowane jako warstwa nad poprawnym SEO, spójnym entity i public truth — nie jako osobny „magiczny algorytm”.

## Frontend

- statyczny HTML + CSS,
- GitHub Pages,
- brak ciężkiego runtime JavaScript,
- responsive desktop / tablet / mobile,
- iOS/Safari fallback dla kosztownych efektów kompozytowych,
- hero master: `assets/tervyxa-hero-8k.png`,
- responsive WebP: 640 / 1280 / 1920 / 2560,
- OG image: `assets/tervyxa-og-1200.jpg`.

8K PNG jest masterem/upscale i nie jest opisywany jako natywnie wygenerowane 8K.

## Zasady treści

1. Brak publicznego dowodu = brak publicznego potwierdzenia.
2. Nie publikujemy fikcyjnych wdrożeń, klientów ani benchmarków.
3. Nie ujawniamy prywatnego stosu technicznego jako oficjalnego stosu produkcyjnego bez osobnej decyzji.
4. Nie publikujemy danych osoby założyciela ani adresu ulicznego bez osobnej zgody.
5. Każdy publiczny URL musi mieć odrębną intencję i realną wartość; bez masowego thin content.

## Stan przebudowy

W 2026-08-11 wykonano przebudowę głównych hubów, Technology Authority, Comparison Engine, Solution Engine, Industry Authority oraz całego klastra `/wiedza/*`. Następnie rozpoczęto final normalization / crawl QA: usuwanie martwych URL-i, wyrównanie sitemap i plików AI-readable oraz finalną walidację GitHub Pages.

## Granica projektu

To repo jest wyłącznie tymczasowym prewebsite. Nie zastępuje docelowej, znacznie większej witryny Tervyxa Systems i nie powinno przejmować jej przyszłej architektury aplikacyjnej, portfolio ani prywatnych danych projektowych.

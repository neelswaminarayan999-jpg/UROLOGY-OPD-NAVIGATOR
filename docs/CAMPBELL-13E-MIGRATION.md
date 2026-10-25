# Campbell-Walsh-Wein Urology 13th Edition — Oracle Migration Layer

## Included in this branch
- A source-index module with 166 table-of-contents entries. Chapter 89 is eBook-only in the supplied contents; Chapter 96 has a listed TOC page range, but the uploaded inspection PDF says full content is available through Elsevier eBooks or Chapter 95 and includes only an excerpt.
- Page-range / volume metadata based on the uploaded 13th-edition table of contents.
- Topic mapping for 28 Oracle-related clinical areas, spanning diagnostic evaluation/imaging, surgical principles, stones, urinary infection, LUT dysfunction/urodynamics, female continence/pelvic floor, reconstruction, gender-affirming urology, transplant, trauma, and uro-oncology (bladder, renal, UTUC, prostate, urethral, testis and penile disease).
- A visible chapter-coverage status distinguishes chapter-specific synthesis, broader topic mapping/checklist, TOC-only entries, partial Chapter 96 excerpt, and Chapter 89 eBook-only. This prevents an index or cross-reference from being mistaken for full chapter extraction.
- Original concise clinical-context summaries and safety gates that link Oracle module topics to relevant 13e chapters.
- **67 chapter-specific original syntheses** for priority clinical chapters: hematuria; UTI/prostatitis; upper-tract obstruction; lower urinary tract physiology, continence and urodynamics; fistula/diverticula and sphincteric incontinence; genital/lower-tract trauma; benign/malignant renal masses and adrenal disease; hypospadias/undescended testis; ED/priapism; urethral stricture; stone pathogenesis, acute colic, ureteral/renal/bladder stones and prevention; NMIBC/MIBC and diversion; RCC/UTUC; BPH and localized/advanced prostate cancer; testis, penile and urethral malignancy.
- These chapter syntheses are visible in the searchable index and inside the collapsed chapter-level section under matching selected-disease output. The running counter is generated from the synthesis registry. They provide concise clinical reasoning and decision checks, not copied textbook passages.
- A non-destructive server bootstrap that adds the layer to the rendered app without replacing the large existing frontend file.

## Important status distinction
This is a **staged content migration**, not proof that every legacy treatment algorithm has been rewritten or validated against the 13th edition. The UI explicitly distinguishes chapter-specific syntheses from mapped-only and TOC-only chapters. This migration layer is based on the deployed `v13.2-final` tree and preserves its V14/V15 clinical engines and operative-atlas modules. Existing pathways, scores, dose rules and guideline-specific recommendations must be audited individually before they are labelled fully reconciled. Textbook background must not silently supersede current guidelines or local protocols.

## Local/Render smoke test
1. Deploy this branch to a preview service before merging.
2. Open the app and confirm the fixed **Campbell 13e** control appears.
3. Search the chapter index for chapters 8, 26, 86, 95–100, 129–139 and 149–166.
4. Select the topic cards and confirm source chapters/pages and safety gates render.
5. Open and use the existing disease selector, treatment plan, calculators, investigation AI handoff and Book Lab; confirm none of the legacy interactions are blocked.
6. Check the browser console for JavaScript errors, then compare the preview against main before merge.

## Coverage limitations
- Chapter 89 is an eBook-only listing in the supplied contents.
- This layer uses chapter titles/page metadata plus original clinical synthesis; it does not embed or reproduce the copyrighted chapters.
- No update is deployed to the live service by this branch commit alone.

# Google Sheets Export

These TSV files are copy-ready for Google Sheets. Create a new Google Sheet, add one tab for each file, then paste the matching TSV content into cell A1.

Recommended tab names:

- lessons -> lessons.tsv (4 rows)
- puhekieli -> puhekieli.tsv (100 rows)
- puhekieli_2 -> puhekieli_2.tsv (85 rows)
- helsinki_slang -> helsinki_slang.tsv (131 rows)
- language_notes -> language_notes.tsv (3 rows)

Notes:

- Keep the first row as headers.
- The `lessons` tab includes the disabled `workplace-finnish` placeholder from the current app, so that metadata is not lost.
- For future lessons, create a new tab with the same columns as the lesson TSV files, then add a row to `lessons` with `enabled` set to TRUE.
- Add an optional `gid` column to the `lessons` tab. For any new lesson tab, copy the number after `gid=` from the Google Sheets editor URL and paste it into that row. This lets the app load new tabs without another code change.
- These files were generated from the current repo JSON files and app lesson metadata. No source JSON files were modified.

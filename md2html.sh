#!/bin/bash
rm -r html/
mkdir html
for md_file in md/*.md; do
	html_file="html/$( basename -s ".md" "${md_file}" ).html"
	#cmark -t html --validate-utf8 --smart --unsafe "${md_file}" > "${html_file}"
	echo "title: " "${md_file//_/ }"
	pandoc -f markdown -t html5 -s -o "${html_file}" "${md_file}" --metadata title="${md_file// /_}" --lua-filter=fix_markdown_links.lua
done

pandoc -f markdown -t html5 -s -o index.html README.md --metadata title="MCPU Documentation README" --lua-filter=fix_markdown_links.lua

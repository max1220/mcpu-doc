-- fix links in HTML generated from markdown
-- adapted from: https://stackoverflow.com/a/49396058
function Link(el)
	el.target = el.target:gsub("%.md$", ".html"):gsub("^/?(md/)", "html/")
	return el
end

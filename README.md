# tree-sitter-lc3

LC-3 grammar for tree-sitter designed to be style agnostic and look decent with
even super broken code.

## Usage

Using [nvim-tree-sitter](https://github.com/nvim-treesitter/nvim-treesitter)
with [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
return {
	"nvim-treesitter/nvim-treesitter",
	branch = "main",
	build = ":TSUpdate",
	config = function()
		vim.api.nvim_create_autocmd("User", {
			pattern = "TSUpdate",
			callback = function()
				local parsers = require("nvim-treesitter.parsers")
				-- custom parsers here
				parsers.lc3 = {
					install_info = {
						url = "https://github.com/twhlynch/tree-sitter-lc3",
						queries = "queries",
					},
				}
			end,
		})

		require("nvim-treesitter").install({
			-- other parsers here
			"lc3"
		})

		vim.api.nvim_create_autocmd("FileType", {
			group = vim.api.nvim_create_augroup("TreesitterSetup", { clear = true }),
			callback = function(args)
				if vim.treesitter.get_parser(args.buf) then
					vim.treesitter.start(args.buf)
				end
			end,
		})

		-- uncomment to treat all-lowercase labels as trap aliases
		-- or otherwise set @label.special.lc3 in your theme.
		-- vim.api.nvim_set_hl(0, "@label.special.lc3", { link = "@function.lc3" })
	end
}
```

## Development

Same as [Usage](#Usage) but local `path` instead of `url` and add `generate`.

```lua
require("nvim-treesitter.parsers").lc3 = {
	install_info = {
		path = vim.fn.expand("~/path/to/tree-sitter-lc3"),
		queries = "queries",
		generate = true,
	},
}
```

Use `:TSUpdate lc3` to regenerate and reload the parser.
Use `:TSUninstall lc3` first if swapping from the upstream to a local clone.

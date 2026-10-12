# Security

Please report a suspected security issue privately to
[damon@linchpin.studio](mailto:damon@linchpin.studio). Include the affected page
or file, the behavior you observed, and steps that reproduce it.

Do not publish credentials, personal information, exploit details, or a working
attack in a public GitHub issue. Bot Cabinet currently has one editor, so a
response may not be immediate.

Bot Cabinet's public review labels describe completed checks. They are not a
security guarantee. Read a Bot's files and begin with limited sample material
and access.

## Source publication boundary

Repository files, commit messages, pull requests, issues, and CI logs must contain
only implementation details and material approved for publication. Keep private
analytics, business plans, financial records, operating notes, account details,
and credentials outside the checkout. Repository visibility is not permission
to include private working records in deployable source.

Before pushing, review the complete diff and any GitHub description, then run
`npm run check:source-privacy`. CI runs this check before installing dependencies.
It rejects unreviewed documentation paths, common private directories,
environment files, and explicit non-public document classifications. New public
documentation needs owner review before its path is added to both the checker
and `.gitignore` allowlists.

These checks are a backstop, not a complete privacy or secret scanner. They do
not inspect GitHub descriptions or remove older copies from Git history. Review
the actual content, including public examples and generated output, before
publication. Do not paste private excerpts into an issue or CI log to explain a
failure.
